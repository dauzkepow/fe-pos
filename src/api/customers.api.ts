import api from './axios'

// get list customer dengan pagination & search
export const getCustomers = (params?: { page?: number; search?: string; limit?: number }) =>
  api.get('/customers', { params })

// get customer by id
export const getCustomer = (id: number) => api.get(`/customers/${id}`)

// validasi untuk input data
export const createCustomer = (payload: { name: string; phone?: string | null }) =>
  api.post('/customers', payload)

// validasi untuk update edit data
export const updateCustomer = (id: number, payload: { name: string; phone?: string | null }) =>
  api.put(`/customers/${id}`, payload)

// delete customer
export const deleteCustomer = (id: number) => api.delete(`/customers/${id}`)
