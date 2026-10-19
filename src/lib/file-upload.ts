import { z } from 'zod'
import { ConvexError } from 'convex/values'

import type { Id } from '../../convex/_generated/dataModel'
import {
  getFileNameError,
  getFileType,
  MAX_FILE_SIZE,
} from '../../convex/lib/file_types'

export type UploadItem = {
  id: string
  file: File
} & (
  | { status: 'waiting' }
  | { status: 'uploading'; progress: number }
  | { status: 'saving'; storageId: Id<'_storage'> }
  | { status: 'done' }
  | {
      status: 'error'
      message: string
      storageId: Id<'_storage'> | null
      retryable: boolean
    }
)

const uploadResponse = z.object({ storageId: z.string().min(1) })

export function fileErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ConvexError && typeof error.data === 'string') {
    return error.data
  }
  return error instanceof Error ? error.message : fallback
}

export function validateFile(file: File) {
  const nameError = getFileNameError(file.name)
  if (nameError) return nameError
  if (!getFileType(file.name)) {
    return 'Choose an image, PDF, Word, Excel, or PowerPoint file.'
  }
  if (file.size === 0) return 'This file is empty.'
  if (file.size > MAX_FILE_SIZE) return 'This file exceeds the 25 MB limit.'
  return null
}

export function uploadFile({
  file,
  url,
  onProgress,
}: {
  file: File
  url: string
  onProgress: (progress: number) => void
}) {
  const fileType = getFileType(file.name)
  if (!fileType) return Promise.reject(new Error('Unsupported file type.'))

  return new Promise<Id<'_storage'>>((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('POST', url)
    request.setRequestHeader('Content-Type', fileType.contentType)
    request.responseType = 'json'
    request.timeout = 120_000
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }
    request.onerror = () =>
      reject(new Error('Upload failed. Check your connection and retry.'))
    request.ontimeout = () =>
      reject(new Error('Upload timed out. Please retry.'))
    request.onabort = () =>
      reject(new Error('Upload was interrupted. Please retry.'))
    request.onload = () => {
      if (request.status < 200 || request.status >= 300) {
        reject(new Error('The file could not be uploaded. Please retry.'))
        return
      }
      const body: unknown = request.response
      const parsed = uploadResponse.safeParse(body)
      if (!parsed.success) {
        reject(
          new Error('The upload returned an invalid response. Please retry.'),
        )
        return
      }
      // Convex validates the opaque storage ID again when saving the file.
      resolve(parsed.data.storageId as Id<'_storage'>)
    }
    request.send(file)
  })
}

export async function downloadFile({
  url,
  name,
  originalName,
}: {
  url: string
  name: string
  originalName: string
}) {
  const response = await fetch(url)
  if (!response.ok)
    throw new Error('The file could not be downloaded. Please retry.')
  const blobUrl = URL.createObjectURL(await response.blob())
  const extension = getFileType(originalName)?.extension
  const filename =
    extension && !name.toLowerCase().endsWith(`.${extension}`)
      ? `${name}.${extension}`
      : name
  const anchor = document.createElement('a')
  anchor.href = blobUrl
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
}
