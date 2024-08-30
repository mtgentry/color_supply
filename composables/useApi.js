
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
  const refreshAuthExecute = async () => {
    const newAuth = useCookie('auth.token')
    if (newAuth.value) {
      options.headers['Authorization'] = 'Bearer ' + newAuth.value
    }
    await execute()
  }
  return {data, pending, error, execute, refresh, refreshAuthExecute}
}