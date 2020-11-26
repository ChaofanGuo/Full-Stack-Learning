
export function formatDate(date, formattor) {
  let yyyy = date.getFullYear()
  let MM = date.getMonth() + 1
  if (MM < 10) {
    MM = '0' + MM
  }
  let dd = date.getDate()
  if (dd < 10) {
    dd = '0' + dd
  }

  formattor.replace('yyyy', yyyy)

  return `${yyyy}-${MM}-${dd}`
}
