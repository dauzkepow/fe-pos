// untuk mendefinisikan isi dari products
import type { ProductCategory } from './product-category'

export interface Product {
  id: number
  product_category_id: number
  image?: string | null
  name: string
  price: number
  stock: number
  category?: ProductCategory
}
