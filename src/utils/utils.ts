export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  let value = bytes / Math.pow(k, i);

  // Round to nearest whole number for KB and MB
  if (sizes[i] === 'KB' || sizes[i] === 'MB') {
    value = Math.round(value);
    return value + ' ' + sizes[i];
  }

  return parseFloat(value.toFixed(dm)) + ' ' + sizes[i];
}
