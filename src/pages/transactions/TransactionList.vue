<script setup lang="ts">
import {
  Button,
  Column,
  DataTable,
  IconField,
  InputIcon,
  InputText,
  Select,
} from 'primevue'
import { useTransactionStore } from '@/stores/transaction.store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { RouterLink } from 'vue-router'

const transactionStore = useTransactionStore()
const { fetch, setLimit, setPage, nextPage, prevPage } = transactionStore
const { items, loading, limit, currentPage, totalPages, search } = storeToRefs(transactionStore)

// function search dengan debounce 400ms
const onSearch = useDebounceFn(() => {
  setPage(1)
}, 400)

// format harga ke rupiah
const formatPrice = (value: number | string) => {
  const num = Number(value) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

// format tanggal & waktu indonesia
const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

onMounted(() => {
  fetch()
})
</script>

<template>
  <div class="min-h-screen bg-surface-50 font-sans text-surface-900">
    <!-- top header sections -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 mb-1">Transactions</h1>
        <p class="text-surface-500 text-sm">The List here show all transaction history</p>
      </div>
    </div>

    <!-- main card table -->
    <div class="bg-white rounded-2xl border border-surface-200 p-2">
      <!-- search -->
      <div class="flex flex-col md:flex-row justify-between items-center px-4 py-4 gap-4">
        <IconField iconPosition="left" class="w-full md:w-80">
          <InputIcon class="pi pi-search text-surface-400" />
          <InputText v-model="search" placeholder="Search by code..." @input="onSearch" />
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
        <!-- Code -->
        <Column field="code" header="Transaction Code" class="min-w-44">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <i class="pi pi-receipt text-primary-600"></i>
              <span class="font-semibold text-surface-900 font-mono">
                {{ data.code }}
              </span>
            </div>
          </template>
        </Column>

        <!-- Customer -->
        <Column field="customer.name" header="Customer" class="min-w-44">
          <template #body="{ data }">
            <div v-if="data.customer" class="flex items-center gap-2">
              <div
                class="w-7 h-7 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-semibold text-xs border border-primary-100"
              >
                {{ data.customer.name.charAt(0).toUpperCase() }}
              </div>
              <span class="font-medium text-surface-900">
                {{ data.customer.name }}
              </span>
            </div>
            <span v-else class="text-surface-400 italic text-sm">
              General Customer
            </span>
          </template>
        </Column>

        <!-- Date -->
        <Column field="created_at" header="Date" class="min-w-40">
          <template #body="{ data }">
            <span class="text-surface-600 text-sm">
              {{ formatDate(data.created_at) }}
            </span>
          </template>
        </Column>

        <!-- Subtotal -->
        <Column field="subtotal" header="Subtotal" class="min-w-32">
          <template #body="{ data }">
            <span class="text-surface-600 text-sm">
              {{ formatPrice(data.subtotal) }}
            </span>
          </template>
        </Column>

        <!-- Tax -->
        <Column field="tax" header="Tax" class="min-w-28">
          <template #body="{ data }">
            <span class="text-surface-600 text-sm">
              {{ formatPrice(data.tax) }}
            </span>
          </template>
        </Column>

        <!-- Total -->
        <Column field="total" header="Total" class="min-w-36">
          <template #body="{ data }">
            <span class="font-bold text-surface-900">
              {{ formatPrice(data.total) }}
            </span>
          </template>
        </Column>

        <!-- Action -->
        <Column header="Action" style="width: 5rem">
          <template #body="{ data }">
            <div class="flex items-center gap-2">
              <RouterLink :to="{ name: 'transactions-detail', params: { id: data.id } }">
                <Button
                  icon="pi pi-eye"
                  text
                  rounded
                  severity="primary"
                  class="w-9! h-9! border-surface-200! text-surface-200! hover:text-primary-600! hover:border-primary-500 bg-white hover:bg-primary-50!"
                />
              </RouterLink>
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- pagination -->
      <div class="flex justify-between items-center px-4 py-4 border-t border-surface-100 gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-surface-500">Rows per page:</span>
          <Select :model-value="limit" :options="[5, 10, 20, 50]" @update:model-value="setLimit" />
        </div>

        <!-- pagination controls -->
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
</template>
