import Cookies from 'js-cookie';

export const useApi = async (path, params, method='put') => {
  let containsFile = false;
  for (let key in params) {
    if (params[key] instanceof File || params[key] instanceof Blob) {
      containsFile = true;
      break;
    }
  }
  let formData = new FormData();
  if (containsFile) {
    for (let key in params) {
      formData.append(key, params[key]);
    }
  }
  const headers = {
    'Authorization': 'Bearer ' + Cookies.get('auth:token'),
  }
  if (!containsFile) {
    headers['Content-Type'] = 'application/json';
  }
  const config = useRuntimeConfig()
  const options = {
    baseURL: config.public.BASE_URL,
    headers: headers,
    body: containsFile ? formData : params,
    method: method,
    credentials: 'include'
  };
  const {data, pending, error} = await useFetch(
    path, options
  );

  return {data, pending, error}
}