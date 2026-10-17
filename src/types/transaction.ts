// untuk mendefinisikan isi dari transactions
import type { Customer } from './customer'
import type { Product } from './product'

export interface TransactionItem {
  id: number
  transaction_id: number
  product_id: number
  quantity: number
  price: number
  subtotal?: number
  product?: Product
  created_at?: string
  updated_at?: string
}

export interface Transaction {
  id: number
  code: string
  customer_id: number | null
  subtotal: number
  tax: number
  total: number
  customer?: Customer | null
  items?: TransactionItem[]
  created_at: string
  updated_at?: string
}
