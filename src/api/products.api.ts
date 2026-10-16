import api from './axios'

// sesuaikan dengan GetProductRequest.php
export const getProducts = (params?: {
  page?: number
  search?: string
  limit?: number
  product_category_id?: number
}) => api.get('/products', { params })

// get product by id
export const getProduct = (id: number) => api.get(`/products/${id}`)

// validasi untuk input data
export const createProduct = (payload: {
  product_category_id: number
  name: string
  price: number
  stock: number
}) => api.post('/products', payload)

// validasi untuk update edit data
export const updateProduct = (
  id: number,
  payload: {
    product_category_id: number
    name: string
    price: number
    stock: number
  },
) => api.put(`/products/${id}`, payload)

// upload image product
export const uploadProductImage = (id: number, formData: FormData) =>
  api.post(`/products/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

// delete product
export const deleteProduct = (id: number) => api.delete(`/products/${id}`)
