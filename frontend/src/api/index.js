import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const auth = {
  login(data) {
    return instance.post('/auth/login', data)
  }
}

export const articles = {
  list(params) {
    return instance.get('/articles', { params })
  },
  get(slug) {
    return instance.get(`/articles/${slug}`)
  }
}

export const categories = {
  list() {
    return instance.get('/categories')
  },
  get(id) {
    return instance.get(`/categories/${id}`)
  }
}

export const tags = {
  list() {
    return instance.get('/tags')
  }
}

export const comments = {
  listByArticle(articleId) {
    return instance.get(`/comments/article/${articleId}`)
  },
  create(data) {
    return instance.post('/comments', data)
  }
}

export const projects = {
  list() {
    return instance.get('/projects')
  }
}

export default instance
