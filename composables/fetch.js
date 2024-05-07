
export const fetch = async (path, method='get', query) => {
  const auth = useCookie('auth.token')
  const headers = {
    'Content-Type': 'application/json'
  }
  if (auth.value) {
    headers['Authorization'] = 'Bearer ' + auth.value
  }
  const config = useRuntimeConfig()

  const options = {
    baseURL: config.public.BASE_URL,
    headers,
    method,
    credentials: 'include',
  }
  if (method === 'post') {
    options.body = query
  } else if (method === 'get') {
    options.query = query
  }
  return $fetch(
    path, options
  )
}