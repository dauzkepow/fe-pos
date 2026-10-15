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
import { useProductCategoryStore } from '@/stores/product-category.store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { deleteCategory } from '@/api/product-categories.api'
import { RouterLink } from 'vue-router'

const productCategoryStore = useProductCategoryStore()
const { fetch, setLimit, setPage, nextPage, prevPage } = productCategoryStore // panggil fungsi, bagian action
const { items, loading, limit, currentPage, totalPages, search } = storeToRefs(productCategoryStore) // panggil bagian variabel, di product-category.store.ts useProductCategoryStore

const confirm = useConfirm()
const toast = useToast()

// function search tanpa debounce = boros request API
// const onSearch = () => {
//   setPage(1)
// }

// function search dengan debounce, delay 4 detik
const onSearch = useDebounceFn(() => {
  setPage(1)
}, 400)

// confirm delete
const confirmDelete = (id: number) => {
  confirm.require({
    message: 'Are you sure want to delete this category?',
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
        await deleteCategory(id)
        toast.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Category Removed',
          life: 3000,
        })
        fetch()
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to deleted category',
          life: 3000,
        })
      }
    },
  })
}

// tampilan load jalankan function fetch yang ada di productCategoryStore
onMounted(() => {
  fetch()
})
</script>

<template>
  <div class="min-h-screen bg-surface-50 font-sans text-surface-900">
    <!-- top header sections -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 mb-1">Product Categories</h1>
        <p class="text-surface-500 text-sm">The List here show all product categories</p>
      </div>

      <Button asChild v-slot="slotProps">
        <!-- Routerlink pindah antar link karena SPA -->
        <RouterLink :to="{ name: 'product-categories-create' }" :class="slotProps.class">
          Add Category
        </RouterLink>
      </Button>
    </div>

    <!-- main card table -->
    <div class="bg-white rounded-2xl border border-surface-200 p-2">
      <!-- search -->
      <div class="flex flex-col md:flex-row justify-between items-center px-4 py-4 gap-4">
        <IconField iconPosition="left" class="w-full md:w-80">
          <InputIcon class="pi pi-search text-surface-400" />

          <!-- ketika search panggil function onSearch -->
          <InputText v-model="search" placeholder="Search" @input="onSearch" />
        </IconField>
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

        <Column field="description" header="description"></Column>

        <Column header="Action" style="width: 5rem">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <!-- edit -->
              <RouterLink :to="{ name: 'product-categories-edit', params: { id: data.id } }">
                <Button
                  icon="pi pi-pencil"
                  text
                  rounded
                  severity="primary"
                  class="w-9! h-9! border-surface-200! text-surface-200! hover:text-primary-600! hover:border-primary-500 bg-white hover:bg-primary-50!"
                  @click="confirmDelete(data.id)"
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
