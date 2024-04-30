
export const fetch = (path, method='get', body) => {
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
    body,
    credentials: 'include',
  };
  return $fetch(
    path, options
  )
}