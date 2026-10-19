export const MAX_FILE_SIZE = 25 * 1024 * 1024
export const MAX_FILE_NAME_LENGTH = 180

const fileTypes = [
  {
    extension: 'jpg',
    kind: 'image',
    contentType: 'image/jpeg',
    label: 'Image',
  },
  {
    extension: 'jpeg',
    kind: 'image',
    contentType: 'image/jpeg',
    label: 'Image',
  },
  { extension: 'png', kind: 'image', contentType: 'image/png', label: 'Image' },
  {
    extension: 'webp',
    kind: 'image',
    contentType: 'image/webp',
    label: 'Image',
  },
  { extension: 'gif', kind: 'image', contentType: 'image/gif', label: 'Image' },
  {
    extension: 'pdf',
    kind: 'pdf',
    contentType: 'application/pdf',
    label: 'PDF',
  },
  {
    extension: 'docx',
    kind: 'document',
    contentType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    label: 'Word document',
  },
  {
    extension: 'xlsx',
    kind: 'spreadsheet',
    contentType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    label: 'Excel spreadsheet',
  },
  {
    extension: 'pptx',
    kind: 'presentation',
    contentType:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    label: 'PowerPoint presentation',
  },
] as const

export type FileKind = (typeof fileTypes)[number]['kind']

export const FILE_ACCEPT = fileTypes
  .map(({ extension }) => `.${extension}`)
  .join(',')

export function getFileNameError(value: string): string | null {
  const name = value.trim()
  if (!name || name.length > MAX_FILE_NAME_LENGTH) {
    return `File names must be between 1 and ${MAX_FILE_NAME_LENGTH} characters.`
  }
  for (const character of name) {
    const code = character.charCodeAt(0)
    if (character === '/' || character === '\\' || code < 32 || code === 127) {
      return 'File names cannot include path separators or control characters.'
    }
  }
  return null
}

export function getFileType(filename: string) {
  const name = filename.trim()
  const dot = name.lastIndexOf('.')
  if (dot <= 0) return undefined

  const extension = name.slice(dot + 1).toLowerCase()
  return fileTypes.find((type) => type.extension === extension)
}
