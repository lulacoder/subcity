import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useConvexAuth, useMutation, usePaginatedQuery } from 'convex/react'
import { useDeferredValue, useEffect, useRef, useState } from 'react'

import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import type { FileKind } from '../../convex/lib/file_types'
import { FileLibraryView } from '@/components/admin/file-library'
import type { LibraryFile } from '@/components/admin/file-library'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth-client'
import {
  downloadFile,
  fileErrorMessage,
  uploadFile,
  validateFile,
} from '@/lib/file-upload'
import type { UploadItem } from '@/lib/file-upload'

export const Route = createFileRoute('/admin/files')({
  component: FileLibraryPage,
})

function FileLibraryPage() {
  const session = authClient.useSession()
  const { isLoading, isAuthenticated } = useConvexAuth()

  if (session.isPending) return <FileLibrarySkeleton />
  if (!session.data?.user) return <Navigate to="/admin/login" />
  const role = 'role' in session.data.user ? session.data.user.role : undefined
  if (role !== 'admin') {
    return (
      <main className="files-page">
        <h1 className="text-xl font-semibold">Admin access required</h1>
        <p className="mt-2 text-muted-foreground">
          This account cannot manage files.
        </p>
      </main>
    )
  }
  if (isLoading) return <FileLibrarySkeleton />
  if (!isAuthenticated) {
    return (
      <main className="files-page">
        <p role="alert">
          Your session could not be verified. Please sign in again.
        </p>
      </main>
    )
  }
  // Mount the paginated library only after authentication, so cached files do
  // not survive a sign-out or an account change.
  return <FileLibrary key={session.data.user.id} />
}

function FileLibrary() {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search.trim())
  const [kind, setKind] = useState<FileKind | 'all'>('all')
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [uploading, setUploading] = useState(false)
  const uploadLock = useRef(false)
  const uploadController = useRef<AbortController | null>(null)
  const pendingStorageIds = useRef(new Set<Id<'_storage'>>())
  const [discardingId, setDiscardingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [downloadingId, setDownloadingId] = useState<Id<'files'> | null>(null)

  const { results, status, loadMore } = usePaginatedQuery(
    api.files.list,
    {
      search: deferredSearch || undefined,
      kind: kind === 'all' ? undefined : kind,
    },
    { initialNumItems: 20 },
  )
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const saveFile = useMutation(api.files.save)
  const renameFile = useMutation(api.files.rename)
  const removeFile = useMutation(api.files.remove)
  const discardUpload = useMutation(api.files.discardUpload)

  useEffect(() => {
    const pending = pendingStorageIds.current
    return () => {
      uploadController.current?.abort()
      for (const storageId of pending) {
        // The scheduled cleanup handles offline/browser-close failures.
        void discardUpload({ storageId }).catch(() => {})
      }
    }
  }, [discardUpload])

  function updateUpload(item: UploadItem) {
    setUploads((current) =>
      current.map((entry) => (entry.id === item.id ? item : entry)),
    )
  }

  async function processUploads(items: UploadItem[]) {
    if (uploadLock.current) return
    uploadLock.current = true
    const controller = new AbortController()
    uploadController.current = controller
    const { signal } = controller
    setUploading(true)
    setError('')
    setNotice('')
    try {
      for (const item of items) {
        if (signal.aborted) break
        if (item.status === 'error' && !item.retryable) continue
        let storageId = item.status === 'error' ? item.storageId : null
        try {
          if (!storageId) {
            updateUpload({ ...item, status: 'uploading', progress: 0 })
            const url = await generateUploadUrl()
            signal.throwIfAborted()
            storageId = await uploadFile({
              file: item.file,
              url,
              signal,
              onProgress: (progress) =>
                updateUpload({ ...item, status: 'uploading', progress }),
            })
          }
          pendingStorageIds.current.add(storageId)
          signal.throwIfAborted()
          updateUpload({ ...item, status: 'saving', storageId })
          await saveFile({ storageId, originalName: item.file.name.trim() })
          pendingStorageIds.current.delete(storageId)
          signal.throwIfAborted()
          updateUpload({ ...item, status: 'done' })
        } catch (uploadError) {
          if (controller.signal.aborted) {
            if (storageId && pendingStorageIds.current.has(storageId)) {
              void discardUpload({ storageId }).catch(() => {})
            }
            break
          }
          updateUpload({
            ...item,
            status: 'error',
            storageId,
            retryable: true,
            message: storageId
              ? 'The upload could not be finished. Retry to save this file.'
              : fileErrorMessage(uploadError, 'Upload failed. Please retry.'),
          })
        }
      }
    } finally {
      uploadLock.current = false
      uploadController.current = null
      if (!signal.aborted) setUploading(false)
    }
  }

  async function discard(item: UploadItem) {
    if (uploadLock.current || item.status !== 'error') return
    uploadLock.current = true
    setDiscardingId(item.id)
    setError('')
    try {
      if (item.storageId) {
        await discardUpload({ storageId: item.storageId })
        pendingStorageIds.current.delete(item.storageId)
      }
      setUploads((current) => current.filter((entry) => entry.id !== item.id))
    } catch (discardError) {
      setError(
        fileErrorMessage(
          discardError,
          'Could not discard this upload. Please retry.',
        ),
      )
    } finally {
      uploadLock.current = false
      setDiscardingId(null)
    }
  }

  function addFiles(files: File[]) {
    if (uploadLock.current || files.length === 0) return
    const items = files.map((file): UploadItem => {
      const message = validateFile(file)
      const base = { id: crypto.randomUUID(), file }
      return message
        ? {
            ...base,
            status: 'error',
            message,
            retryable: false,
            storageId: null,
          }
        : { ...base, status: 'waiting' }
    })
    setUploads((current) => [
      ...current.filter((item) => item.status !== 'done'),
      ...items,
    ])
    void processUploads(items)
  }

  async function copyLink(file: LibraryFile) {
    setError('')
    setNotice('')
    if (!file.url) return
    try {
      await navigator.clipboard.writeText(file.url)
      setNotice(`Link copied for "${file.name}".`)
    } catch {
      setError(
        'Could not copy the link. Allow clipboard access in your browser and retry.',
      )
    }
  }

  async function download(file: LibraryFile) {
    if (!file.url || downloadingId) return
    setError('')
    setNotice('')
    setDownloadingId(file._id)
    try {
      await downloadFile({
        url: file.url,
        name: file.name,
        originalName: file.originalName,
      })
    } catch (downloadError) {
      setError(
        fileErrorMessage(downloadError, 'Download failed. Please retry.'),
      )
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <FileLibraryView
      files={results}
      status={status}
      search={search}
      kind={kind}
      onSearch={setSearch}
      onKindChange={setKind}
      uploads={uploads}
      uploading={uploading}
      discardingId={discardingId}
      error={error}
      notice={notice}
      downloadingId={downloadingId}
      onUpload={addFiles}
      onRetry={(item) => void processUploads([item])}
      onDiscard={(item) => void discard(item)}
      onClearUploads={() =>
        setUploads((current) =>
          current.filter(
            (item) =>
              item.status !== 'done' &&
              !(item.status === 'error' && !item.retryable),
          ),
        )
      }
      onCopyLink={(file) => void copyLink(file)}
      onDownload={(file) => void download(file)}
      onRename={async (file, name) => {
        await renameFile({ fileId: file._id, name })
        setNotice('File renamed.')
      }}
      onDelete={async (file) => {
        await removeFile({ fileId: file._id })
        setNotice('File deleted. Its shared link no longer works.')
      }}
      onLoadMore={() => loadMore(20)}
    />
  )
}

function FileLibrarySkeleton() {
  return (
    <main className="files-page" aria-label="Loading files" aria-busy="true">
      <Skeleton className="mb-8 h-12 w-40" />
      <Skeleton className="mb-8 h-40 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </main>
  )
}
