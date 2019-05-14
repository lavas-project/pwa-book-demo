function networkOnly ({
  fetchOptions
} = {}) {
  return request => fetch(request, fetchOptions)
}
