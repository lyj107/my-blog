import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
})

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const auth = {
  login(data) {
    return instance.post('/auth/login', data)
  },
  getMe() {
    return instance.get('/auth/me')
  }
}

export const articles = {
  list(params) {
    return instance.get('/articles', { params })
  },
  get(id) {
    return instance.get(`/articles/${id}`)
  },
  create(data) {
    return instance.post('/articles', data)
  },
  update(id, data) {
    return instance.put(`/articles/${id}`, data)
  },
  delete(id) {
    return instance.delete(`/articles/${id}`)
  }
}

export const categories = {
  list() {
    return instance.get('/categories')
  },
  get(id) {
    return instance.get(`/categories/${id}`)
  },
  create(data) {
    return instance.post('/categories', data)
  },
  update(id, data) {
    return instance.put(`/categories/${id}`, data)
  },
  delete(id) {
    return instance.delete(`/categories/${id}`)
  }
}

export const tags = {
  list() {
    return instance.get('/tags')
  },
  get(id) {
    return instance.get(`/tags/${id}`)
  },
  create(data) {
    return instance.post('/tags', data)
  },
  update(id, data) {
    return instance.put(`/tags/${id}`, data)
  },
  delete(id) {
    return instance.delete(`/tags/${id}`)
  }
}

export const comments = {
  list(params) {
    return instance.get('/comments', { params })
  },
  update(id, data) {
    return instance.put(`/comments/${id}`, data)
  },
  delete(id) {
    return instance.delete(`/comments/${id}`)
  }
}

export const projects = {
  list() {
    return instance.get('/projects')
  },
  get(id) {
    return instance.get(`/projects/${id}`)
  },
  create(data) {
    return instance.post('/projects', data)
  },
  update(id, data) {
    return instance.put(`/projects/${id}`, data)
  },
  delete(id) {
    return instance.delete(`/projects/${id}`)
  }
}

export const stats = {
  get() {
    return instance.get('/stats')
  },
  getMonthlyArticles(year) {
    return instance.get('/stats/articles/monthly', { params: { year } })
  },
  getTopArticles() {
    return instance.get('/stats/articles/top')
  }
}

export const upload = {
  file(formData) {
    return instance.post('/upload', formData)
  }
}

export default instance
