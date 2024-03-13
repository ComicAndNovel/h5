const API_URL = {
  // development: 'http://169.254.163.222:8080/api',
  // development: 'http://192.168.100.24:8080/api',/
  development: 'http://localhost:3000/api',
  production: ''
}

type ENV = 'development' | 'production'

export const BASE_URL = API_URL[import.meta.env.MODE as ENV]

