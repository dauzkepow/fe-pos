<script setup lang="ts">
import {
  Button,
  Column,
  ConfirmDialog,
  DataTable,
  IconField,
  InputIcon,
  InputText,
  Select,
  useConfirm,
  useToast,
} from 'primevue'
import { useProductStore } from '@/stores/product.store'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { deleteProduct } from '@/api/products.api'
import { getCategories } from '@/api/product-categories.api'
import { RouterLink } from 'vue-router'
import type { ProductCategory } from '@/types/product-category'

const productStore = useProductStore()
const { fetch, setLimit, setPage, nextPage, prevPage, setCategoryId } = productStore // panggil fungsi, bagian action
const { items, loading, limit, currentPage, totalPages, search, categoryId } =
  storeToRefs(productStore) // panggil bagian variabel

const confirm = useConfirm()
const toast = useToast()

// daftar category untuk filter
const categories = ref<ProductCategory[]>([])

// load daftar category
const loadCategories = async () => {
  try {
    const res = await getCategories({ limit: 100 })
    categories.value = res.data.data.items
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

// function search dengan debounce, delay 4 detik
const onSearch = useDebounceFn(() => {
  setPage(1)
}, 400)

// filter by category
const onCategoryFilter = (value: number | null) => {
  setCategoryId(value)
}

// format harga ke rupiah
const formatPrice = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

// confirm delete
const confirmDelete = (id: number) => {
  confirm.require({
    message: 'Are you sure want to delete this product?',
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: async () => {
      try {
        await deleteProduct(id)
        toast.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Product Removed',
          life: 3000,
        })
        fetch()
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to deleted product',
          life: 3000,
        })
      }
    },
  })
}

// stock
const getStockClass = (stock: number) => {
  if (stock === 0) {
    return 'bg-red-100 text-red-700 border-red-200' // Stok Habis (Merah)
  }
  if (stock >= 1 && stock <= 5) {
    return 'bg-amber-100 text-amber-700 border-amber-200' // Stok Menipis (Kuning/Orange)
  }
  return 'bg-emerald-100 text-emerald-700 border-emerald-200' // Stok Aman (Hijau)
}

// tampilan load jalankan function fetch dan load categories
onMounted(() => {
  fetch()
  loadCategories()
})
</script>

<template>
  <div class="min-h-screen bg-surface-50 font-sans text-surface-900">
    <!-- top header sections -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 mb-1">Products</h1>
        <p class="text-surface-500 text-sm">The List here show all products</p>
      </div>

      <Button asChild v-slot="slotProps">
        <!-- Routerlink pindah antar link karena SPA -->
        <RouterLink :to="{ name: 'products-create' }" :class="slotProps.class">
          Add Product
        </RouterLink>
      </Button>
    </div>

    <!-- main card table -->
    <div class="bg-white rounded-2xl border border-surface-200 p-2">
      <!-- search & filter -->
      <div class="flex flex-col md:flex-row justify-between items-center px-4 py-4 gap-4">
        <IconField iconPosition="left" class="w-full md:w-80">
          <InputIcon class="pi pi-search text-surface-400" />

          <!-- ketika search panggil function onSearch -->
          <InputText v-model="search" placeholder="Search" @input="onSearch" />
        </IconField>

        <!-- filter category -->
        <Select
          :model-value="categoryId"
          :options="categories"
          optionLabel="name"
          optionValue="id"
          placeholder="All Categories"
          filter
          showClear
          class="w-full md:w-56"
          @update:model-value="onCategoryFilter"
        />
      </div>

      <!-- datatable -->
      <DataTable
        :value="items"
        :loading="loading"
        dataKey="id"
        class="clean-table"
        :rowHover="true"
      >
        <Column field="name" header="Name" class="min-w-[16rem]">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <div class="relative">
                <img :src="data.image" class="w-10 h-10 rounded-full object-cover bg-surface-100" />
              </div>
              <span class="font-semibold text-surface-900">
                {{ data.name }}
              </span>
            </div>
          </template>
        </Column>

        <Column field="category.name" header="Category"></Column>

        <Column field="price" header="Price">
          <template #body="{ data }">
            <span class="font-medium text-surface-700">{{ formatPrice(data.price) }}</span>
          </template>
        </Column>

        <Column field="stock" header="Stock">
          <template #body="{ data }">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
              :class="getStockClass(data.stock)"
            >
              {{ data.stock }}
            </span>
          </template>
        </Column>

        <Column header="Action" style="width: 5rem">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <!-- edit -->
              <RouterLink :to="{ name: 'products-edit', params: { id: data.id } }">
                <Button
                  icon="pi pi-pencil"
                  text
                  rounded
                  severity="primary"
                  class="w-9! h-9! border-surface-200! text-surface-200! hover:text-primary-600! hover:border-primary-500 bg-white hover:bg-primary-50!"
                />
              </RouterLink>
              <!-- delete -->
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                class="w-9! h-9! border-surface-200! text-surface-200! hover:text-primary-600! hover:border-primary-500 bg-white hover:bg-primary-50!"
                @click="confirmDelete(data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- pagination -->
      <div class="flex justify-between item-center px-4 py-4 border-t border-surface-100 gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-surface-500">Rows per page:</span>
          <Select :model-value="limit" :options="[5, 10, 20, 50]" @update:model-value="setLimit" />
        </div>

        <!-- bagian geser geser -->
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium text-surface-600">
            {{ currentPage }} of {{ totalPages }}
          </span>

          <div class="flex gap-1">
            <Button
              icon="pi pi-chevron-left"
              text
              rounded
              severity="secondary"
              :disabled="currentPage === 1"
              class="w-9! h-9! border! border-surface-500! hover:bg-surface-50!"
              @click="prevPage()"
            />

            <Button
              icon="pi pi-chevron-right"
              text
              rounded
              severity="secondary"
              :disabled="currentPage === totalPages"
              class="w-9! h-9! border! border-surface-500! hover:bg-surface-50!"
              @click="nextPage()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Dialog Box -->
  <ConfirmDialog />
</template>
