export const getSignedRequest = ({ name, type, baseUrl }, cb) => {
  const xhr = new window.XMLHttpRequest()

  const qs = '?name=' + file.name + '&type=' + file.type
  const url = baseUrl + qs

  xhr.open('GET', url, true)
  // xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          cb(null, JSON.parse(xhr.responseText))
        } catch (err) {
          cb(err)
        }
      } else {
        cb({
          message: 'Could not get signed URL',
          status: xhr.status
        })
      }
    }
  }
  xhr.send()
}
