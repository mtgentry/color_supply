
export const useApi = (path, query, method='get') => {
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
  const {data, pending, error, execute, refresh} = useFetch(
    path, options
  );

  return {data, pending, error, execute, refresh}
}