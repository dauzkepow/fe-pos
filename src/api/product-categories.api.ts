import api from './axios'

export const getCategories = (params?: { page?: number; search?: string; limit?: number }) =>
  api.get('/product-categories', { params })

// delete category, pakai haptick bukan petik
export const deleteCategory = (id: number) => api.delete(`/product-categories/${id}`)
