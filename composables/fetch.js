
export const fetch = async (path, method='get', query) => {
  const dialogStore = useDialogStore()
  const {changeSignUpForm} = dialogStore
  const auth = useCookie('auth.token')
  // no Content-Type on GET (there's no body): it's a non-"simple" header, so it forced a CORS
  // preflight (an extra OPTIONS request) before every GET
  const headers = method === 'get' ? {} : {
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
  } else if (method === 'delete') {
    options.body = query
  } else if (method === 'put') {
    options.body = query
  } else if (method === 'patch') {
    options.body = query
  }
  return $fetch(
    path, options
  ).catch((error) => {
    if (error.data === 'Access limited') {
      changeSignUpForm(true, true)
    } else {
      throw error
    }
  })
}