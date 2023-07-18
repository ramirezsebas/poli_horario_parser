export const isFileExcel = (file: File) => {
  return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}