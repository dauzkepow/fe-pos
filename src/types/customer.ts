// untuk mendefinisikan isi dari customers

export interface Customer {
  id: number
  name: string
  phone?: string | null
  created_at?: string
  updated_at?: string
}
