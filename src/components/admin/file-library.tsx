import {
  Copy01Icon,
  Delete02Icon,
  Download04Icon,
  Edit02Icon,
  File01Icon,
  Folder01Icon,
  LinkSquare02Icon,
  Search01Icon,
  Upload04Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRef, useState } from 'react'
import type { FunctionReturnType } from 'convex/server'
import type { PaginationStatus } from 'convex/react'

import type { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'
import {
  FILE_ACCEPT,
  MAX_FILE_NAME_LENGTH,
} from '../../../convex/lib/file_types'
import type { FileKind } from '../../../convex/lib/file_types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import type { UploadItem } from '@/lib/file-upload'
import { fileErrorMessage } from '@/lib/file-upload'
import '@/file-library.css'

export type LibraryFile = FunctionReturnType<
  typeof api.files.list
>['page'][number]

const fileKinds: { kind: FileKind; label: string }[] = [
  { kind: 'image', label: 'Images' },
  { kind: 'pdf', label: 'PDFs' },
  { kind: 'document', label: 'Word' },
  { kind: 'spreadsheet', label: 'Excel' },
  { kind: 'presentation', label: 'PowerPoint' },
]

const typeLabels: Record<FileKind, string> = {
  image: 'Image',
  pdf: 'PDF',
  document: 'Word',
  spreadsheet: 'Excel',
  presentation: 'PowerPoint',
}

type FileLibraryProps = {
  files: LibraryFile[]
  status: PaginationStatus
  search: string
  kind: FileKind | 'all'
  onSearch: (value: string) => void
  onKindChange: (value: FileKind | 'all') => void
  uploads: UploadItem[]
  uploading: boolean
  discardingId: string | null
  error: string
  notice: string
  downloadingId: Id<'files'> | null
  onUpload: (files: File[]) => void
  onRetry: (item: UploadItem) => void
  onDiscard: (item: UploadItem) => void
  onClearUploads: () => void
  onCopyLink: (file: LibraryFile) => void
  onDownload: (file: LibraryFile) => void
  onRename: (file: LibraryFile, name: string) => Promise<void>
  onDelete: (file: LibraryFile) => Promise<void>
  onLoadMore: () => void
}

type FileDialog = { kind: 'rename' | 'delete'; file: LibraryFile }

export function FileLibraryView(props: FileLibraryProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [dialog, setDialog] = useState<FileDialog | null>(null)
  const [name, setName] = useState('')
  const [dialogError, setDialogError] = useState('')
  const [saving, setSaving] = useState(false)
  const hasFilters = Boolean(props.search.trim()) || props.kind !== 'all'
  const busy = props.uploading || props.discardingId !== null

  function openDialog(kind: FileDialog['kind'], file: LibraryFile) {
    setName(file.name)
    setDialogError('')
    setDialog({ kind, file })
  }

  async function submitDialog(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!dialog || saving) return
    setDialogError('')
    setSaving(true)
    try {
      if (dialog.kind === 'rename') {
        await props.onRename(dialog.file, name.trim())
      } else {
        await props.onDelete(dialog.file)
      }
      setDialog(null)
    } catch (error) {
      setDialogError(
        fileErrorMessage(
          error,
          'Could not complete this action. Please retry.',
        ),
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="files-page">
      <header className="files-header">
        <div>
          <p className="files-eyebrow">Admin workspace</p>
          <h1>Files</h1>
          <p>Upload images and documents, then share a link with anyone.</p>
        </div>
        <Button
          size="lg"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          <HugeiconsIcon icon={Upload04Icon} size={18} />
          {props.uploading ? 'Uploading files...' : 'Upload files'}
        </Button>
      </header>

      <input
        ref={inputRef}
        type="file"
        accept={FILE_ACCEPT}
        multiple
        className="sr-only"
        aria-label="Choose files to upload"
        disabled={busy}
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? [])
          event.currentTarget.value = ''
          props.onUpload(files)
        }}
      />

      <button
        type="button"
        className="files-dropzone"
        data-dragging={dragging}
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = busy ? 'none' : 'copy'
          if (!busy) setDragging(true)
        }}
        onDragLeave={(event) => {
          if (
            !(event.relatedTarget instanceof Node) ||
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            setDragging(false)
          }
        }}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          if (!busy) props.onUpload(Array.from(event.dataTransfer.files))
        }}
      >
        <span className="files-dropzone-icon">
          <HugeiconsIcon icon={Upload04Icon} size={24} />
        </span>
        <span>
          <strong>
            {dragging
              ? 'Drop to upload'
              : 'Drop files here or browse your computer'}
          </strong>
          <small>
            Images, PDF, Word, Excel and PowerPoint. Up to 25 MB per file.
          </small>
        </span>
      </button>

      {props.uploads.length > 0 && (
        <section className="files-upload-list" aria-label="Uploads">
          <div className="files-upload-heading">
            <h2>{props.uploading ? 'Uploading your files' : 'Uploads'}</h2>
            {!busy &&
              props.uploads.some(
                (item) =>
                  item.status === 'done' ||
                  (item.status === 'error' && !item.retryable),
              ) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={props.onClearUploads}
                >
                  Clear finished
                </Button>
              )}
          </div>
          <ul>
            {props.uploads.map((item) => (
              <li
                key={item.id}
                className="files-upload-item"
                data-status={item.status}
              >
                <HugeiconsIcon icon={File01Icon} size={20} />
                <div className="files-upload-detail">
                  <strong>{item.file.name}</strong>
                  <span role={item.status === 'error' ? 'alert' : undefined}>
                    {item.status === 'waiting' && 'Waiting to upload'}
                    {item.status === 'uploading' &&
                      `Uploading ${item.progress}%`}
                    {item.status === 'saving' && 'Finishing upload...'}
                    {item.status === 'done' && 'Uploaded and ready to share'}
                    {item.status === 'error' && item.message}
                  </span>
                  {item.status === 'uploading' && (
                    <progress
                      value={item.progress}
                      max={100}
                      aria-label={`Uploading ${item.file.name}`}
                    />
                  )}
                </div>
                {item.status === 'error' && item.retryable && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busy}
                    onClick={() => props.onRetry(item)}
                  >
                    Retry
                  </Button>
                )}
                {item.status === 'error' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={busy}
                    aria-label={`Discard ${item.file.name}`}
                    onClick={() => props.onDiscard(item)}
                  >
                    {props.discardingId === item.id
                      ? 'Discarding...'
                      : 'Discard'}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="files-notice" role="status">
        {props.notice}
      </div>
      {props.error && (
        <div className="files-error" role="alert">
          {props.error}
        </div>
      )}

      <section className="files-library" aria-label="File library">
        <div className="files-toolbar">
          <label className="files-search">
            <HugeiconsIcon icon={Search01Icon} size={18} />
            <Input
              type="search"
              aria-label="Search files by name"
              placeholder="Search files by name"
              value={props.search}
              maxLength={MAX_FILE_NAME_LENGTH}
              onChange={(event) => props.onSearch(event.target.value)}
            />
          </label>
          <label className="files-filter">
            <span className="sr-only">Filter by file type</span>
            <select
              value={props.kind}
              onChange={(event) =>
                props.onKindChange(
                  fileKinds.find((item) => item.kind === event.target.value)
                    ?.kind ?? 'all',
                )
              }
            >
              <option value="all">All file types</option>
              {fileKinds.map((item) => (
                <option key={item.kind} value={item.kind}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {props.status === 'LoadingFirstPage' ? (
          <div
            className="files-loading"
            aria-label="Loading files"
            aria-busy="true"
          >
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : props.files.length === 0 ? (
          <div className="files-empty">
            <span className="files-empty-icon">
              <HugeiconsIcon
                icon={hasFilters ? Search01Icon : Folder01Icon}
                size={30}
              />
            </span>
            <h2>
              {hasFilters
                ? 'No matching files'
                : 'Your file library starts here'}
            </h2>
            <p>
              {hasFilters
                ? 'Try another name or file type.'
                : 'Upload your first image or document to get a shareable link.'}
            </p>
            {hasFilters ? (
              <Button
                variant="outline"
                onClick={() => {
                  props.onSearch('')
                  props.onKindChange('all')
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
              >
                Choose files
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="files-column-headings" aria-hidden="true">
              <span>Name</span>
              <span>Type</span>
              <span>Size</span>
              <span>Uploaded</span>
              <span>Actions</span>
            </div>
            <ul className="files-rows">
              {props.files.map((file) => (
                <li key={file._id} className="files-row">
                  <div className="files-name-cell">
                    <span className="files-thumbnail" data-kind={file.kind}>
                      {file.kind === 'image' && file.url ? (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${file.name}`}
                        >
                          <img
                            src={file.url}
                            alt=""
                            loading="lazy"
                            width={44}
                            height={44}
                          />
                        </a>
                      ) : (
                        <HugeiconsIcon icon={File01Icon} size={23} />
                      )}
                    </span>
                    <div>
                      <strong>{file.name}</strong>
                      <small>
                        {file.url ? file.originalName : 'File is unavailable'}
                      </small>
                    </div>
                  </div>
                  <span className="files-type" data-kind={file.kind}>
                    {typeLabels[file.kind]}
                  </span>
                  <span className="files-size">{formatSize(file.size)}</span>
                  <span className="files-uploaded">
                    <time dateTime={new Date(file._creationTime).toISOString()}>
                      {formatDate(file._creationTime)}
                    </time>
                    <small title={file.uploadedBy}>{file.uploadedBy}</small>
                  </span>
                  <div className="files-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!file.url}
                      onClick={() => props.onCopyLink(file)}
                      aria-label={`Copy link for ${file.name}`}
                    >
                      <HugeiconsIcon icon={Copy01Icon} size={15} />
                      Copy link
                    </Button>
                    {file.url &&
                      (file.kind === 'image' || file.kind === 'pdf') && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          nativeButton={false}
                          render={
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                            />
                          }
                          aria-label={`Open ${file.name}`}
                          title="Open file"
                        >
                          <HugeiconsIcon icon={LinkSquare02Icon} size={17} />
                        </Button>
                      )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={!file.url || props.downloadingId !== null}
                      onClick={() => props.onDownload(file)}
                      aria-label={`Download ${file.name}`}
                      title={
                        props.downloadingId === file._id
                          ? 'Downloading...'
                          : 'Download'
                      }
                    >
                      <HugeiconsIcon icon={Download04Icon} size={17} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openDialog('rename', file)}
                      aria-label={`Rename ${file.name}`}
                      title="Rename"
                    >
                      <HugeiconsIcon icon={Edit02Icon} size={17} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="files-delete-button"
                      onClick={() => openDialog('delete', file)}
                      aria-label={`Delete ${file.name}`}
                      title="Delete"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={17} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {(props.status === 'CanLoadMore' || props.status === 'LoadingMore') && (
          <div className="files-load-more">
            <Button
              variant="outline"
              disabled={props.status === 'LoadingMore'}
              onClick={props.onLoadMore}
            >
              {props.status === 'LoadingMore'
                ? 'Loading...'
                : 'Load more files'}
            </Button>
          </div>
        )}
        <footer className="files-library-footer">
          <HugeiconsIcon icon={LinkSquare02Icon} size={15} />
          <span>Anyone with a shared link can open the file.</span>
        </footer>
      </section>

      <Dialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open && !saving) setDialog(null)
        }}
      >
        <DialogContent showCloseButton={!saving}>
          <form
            onSubmit={(event) => void submitDialog(event)}
            className="grid min-w-0 gap-6"
          >
            <DialogHeader>
              <DialogTitle>
                {dialog?.kind === 'rename' ? 'Rename file' : 'Delete file?'}
              </DialogTitle>
              <DialogDescription className="break-words">
                {dialog?.kind === 'rename'
                  ? 'Choose a name that is easy to find. The shared link will stay the same.'
                  : `"${dialog?.file.name ?? ''}" will be permanently deleted. Its shared link will stop working.`}
              </DialogDescription>
            </DialogHeader>
            {dialog?.kind === 'rename' && (
              <label className="grid gap-2 text-sm font-medium">
                File name
                <Input
                  autoFocus
                  value={name}
                  maxLength={MAX_FILE_NAME_LENGTH}
                  required
                  disabled={saving}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
            )}
            {dialogError && (
              <p role="alert" className="files-dialog-error">
                {dialogError}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setDialog(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={dialog?.kind === 'delete' ? 'destructive' : 'default'}
                disabled={saving || (dialog?.kind === 'rename' && !name.trim())}
              >
                {saving
                  ? 'Saving...'
                  : dialog?.kind === 'rename'
                    ? 'Save name'
                    : 'Delete file'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(timestamp)
}
