import {useApi} from "~/composables/useApi";

export const getData = async (params, method) => {
  const router = useRouter()
  let path = router.currentRoute.value.path + '/'
  const { data, pending , error} = await useApi(path, params, method)
  return { data, pending, error}
}