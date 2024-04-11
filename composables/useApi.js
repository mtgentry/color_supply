
export const useApi = (path, query, method='get') => {
  const auth = useCookie('auth:token')
  const headers = {
    'Authorization': 'Bearer ' + auth,
    'Content-Type': 'application/json'
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

  return {data, pending, error, execute, refresh};
}