import api from './axios'

export const getCategories = (params?: { page?: number; search?: string; limit?: number }) =>
  api.get('/product-categories', { params })

// edit category by id
export const getCategory = (id: number) => api.get(`/product-categories/${id}`)

// validasi untuk input data
export const createCategory = (payload: { name: string; description?: string }) =>
  api.post('/product-categories', payload)

// validasi untuk update edit data
export const updateCategory = (id: number, payload: { name: string; description?: string }) =>
  api.put(`/product-categories/${id}`, payload)

// upload image category
export const uploadCategoryImage = (id: number, formData: FormData) =>
  api.post(`/product-categories/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

// delete category, pakai haptick bukan petik
export const deleteCategory = (id: number) => api.delete(`/product-categories/${id}`)
