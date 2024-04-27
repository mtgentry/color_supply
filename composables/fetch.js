
export const fetch = (path, body, method='patch') => {
  const auth = useCookie('auth.token')
  const headers = {
    'Authorization': 'Bearer ' + auth.value,
    'Content-Type': 'application/json'
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