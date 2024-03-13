import { ref } from 'vue'
import http from '../api'

export async function useRequest (options: any) {
  const loading = ref(false)
  const data = ref()

  return new Promise((resolve, reject) => {
    http(options).then(res => {
      data.value = res.data

      resolve({
        data: data.value,
        loading: loading.value
      })
    }).catch(() => {
      loading.value = false

      resolve({
        data: data.value,
        loading: loading.value
      })
    })
  })
   
}