
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
    query,
    credentials: 'include',
  };
  return $fetch(
    path, options
  )
}