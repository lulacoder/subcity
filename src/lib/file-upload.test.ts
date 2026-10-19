import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { uploadFile, validateFile } from './file-upload'

// Only the network transport is stubbed. File, AbortController and the upload
// helper's validation, cancellation and response handling run normally.
const requests: TestRequest[] = []
class TestRequest {
  status = 200
  response: unknown = { storageId: 'test-storage-id' }
  responseType = ''
  timeout = 0
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  ontimeout: (() => void) | null = null
  onabort: (() => void) | null = null
  upload: { onprogress: ((event: ProgressEvent) => void) | null } = {
    onprogress: null,
  }
  open = vi.fn()
  setRequestHeader = vi.fn()
  send = vi.fn()
  abort = vi.fn(() => this.onabort?.())

  constructor() {
    requests.push(this)
  }
}

beforeEach(() => {
  requests.length = 0
  vi.stubGlobal('XMLHttpRequest', TestRequest)
})
afterEach(() => vi.unstubAllGlobals())

test.each([
  ['report.pdf ', 'application/pdf'],
  ['  report.PDF  ', 'application/pdf'],
  ['photo.png ', 'image/png'],
  [
    'letter.docx ',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  [
    'budget.xlsx ',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  [
    'slides.pptx ',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
])(
  'validates and uploads the supported filename "%s" with surrounding spaces',
  async (name, contentType) => {
    const file = new File(['test contents'], name)
    expect(validateFile(file)).toBeNull()
    const upload = uploadFile({ file, url: '/upload', onProgress: () => {} })
    const [request] = requests
    expect(request.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      contentType,
    )
    expect(request.send).toHaveBeenCalledWith(file)
    request.onload?.()
    await expect(upload).resolves.toBe('test-storage-id')
  },
)

test('does not start a transfer if the page already cancelled its upload batch', async () => {
  const controller = new AbortController()
  controller.abort()
  await expect(
    uploadFile({
      file: new File(['test'], 'report.pdf'),
      url: '/upload',
      signal: controller.signal,
      onProgress: () => {},
    }),
  ).rejects.toMatchObject({ name: 'AbortError' })
  expect(requests).toHaveLength(0)
})

test('aborts an active transfer when its page cancels the batch', async () => {
  const controller = new AbortController()
  const upload = uploadFile({
    file: new File(['test'], 'report.pdf'),
    url: '/upload',
    signal: controller.signal,
    onProgress: () => {},
  })
  const rejected = expect(upload).rejects.toMatchObject({ name: 'AbortError' })
  controller.abort()
  await rejected
  expect(requests[0].abort).toHaveBeenCalledOnce()
})

test('detaches cancellation from a completed upload', async () => {
  const controller = new AbortController()
  const upload = uploadFile({
    file: new File(['test'], 'report.pdf'),
    url: '/upload',
    signal: controller.signal,
    onProgress: () => {},
  })
  requests[0].onload?.()
  await upload
  controller.abort()
  expect(requests[0].abort).not.toHaveBeenCalled()
})
