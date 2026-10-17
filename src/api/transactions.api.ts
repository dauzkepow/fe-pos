import api from './axios'

// get list transactions dengan pagination & search
export const getTransactions = (params?: { page?: number; search?: string; limit?: number }) =>
  api.get('/transactions', { params })

// get transaction detail by id
export const getTransaction = (id: number) => api.get(`/transactions/${id}`)
