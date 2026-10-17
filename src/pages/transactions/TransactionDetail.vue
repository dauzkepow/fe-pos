<script setup lang="ts">
import { getTransaction } from '@/api/transactions.api'
import type { Transaction } from '@/types/transaction'
import { Button, Column, DataTable, useToast } from 'primevue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const toast = useToast()

const transaction = ref<Transaction | null>(null)
const loading = ref(false)

const transactionId = Number(route.params.id)

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

const printReceipt = () => {
  window.print()
}

onMounted(async () => {
  if (!transactionId) return

  loading.value = true
  try {
    const res = await getTransaction(transactionId)
    transaction.value = res.data.data
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Failed to load transaction details!',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-surface-50 font-sans text-surface-900 pb-12">
    <!-- top header sections -->
    <div class="flex justify-between items-center mb-8 print:hidden">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 mb-1">Transaction Details</h1>
        <p class="text-surface-500 text-sm">
          Detail information for transaction
          <span class="font-mono font-semibold text-primary-600">
            {{ transaction?.code }}
          </span>
        </p>
      </div>

      <div class="flex items-center gap-3">
        <Button
          v-if="transaction"
          icon="pi pi-print"
          label="Print Receipt"
          severity="secondary"
          outlined
          @click="printReceipt"
        />

        <Button asChild v-slot="slotProps">
          <RouterLink :to="{ name: 'transactions' }" :class="slotProps.class">
            <i class="pi pi-arrow-left"></i>
            Back
          </RouterLink>
        </Button>
      </div>
    </div>

    <!-- loading state -->
    <div
      v-if="loading"
      class="bg-white rounded-2xl border border-surface-200 p-12 flex flex-col items-center justify-center gap-4"
    >
      <i class="pi pi-spin pi-spinner text-4xl text-primary-600"></i>
      <span class="text-surface-500 text-sm">Loading transaction details...</span>
    </div>

    <!-- transaction details -->
    <div v-else-if="transaction" class="flex flex-col gap-6 max-w-4xl">
      <!-- meta info cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- code & status -->
        <div class="bg-white p-5 rounded-2xl border border-surface-200 flex flex-col gap-1">
          <span class="text-xs font-semibold text-surface-400 uppercase tracking-wider">
            Transaction Code
          </span>
          <span class="text-lg font-bold text-surface-900 font-mono">
            {{ transaction.code }}
          </span>
          <div class="mt-2">
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
            >
              <i class="pi pi-check-circle text-xs"></i>
              Completed
            </span>
          </div>
        </div>

        <!-- date & time -->
        <div class="bg-white p-5 rounded-2xl border border-surface-200 flex flex-col gap-1">
          <span class="text-xs font-semibold text-surface-400 uppercase tracking-wider">
            Date & Time
          </span>
          <span class="text-base font-semibold text-surface-900">
            {{ formatDate(transaction.created_at) }}
          </span>
          <span class="text-xs text-surface-400 mt-auto">Local Time</span>
        </div>

        <!-- customer info -->
        <div class="bg-white p-5 rounded-2xl border border-surface-200 flex flex-col gap-1">
          <span class="text-xs font-semibold text-surface-400 uppercase tracking-wider">
            Customer
          </span>
          <div v-if="transaction.customer" class="flex flex-col">
            <span class="text-base font-semibold text-surface-900">
              {{ transaction.customer.name }}
            </span>
            <span class="text-xs text-surface-500 mt-1">
              {{ transaction.customer.phone || 'No phone number' }}
            </span>
          </div>
          <span v-else class="text-base text-surface-400 italic">
            General Customer
          </span>
        </div>
      </div>

      <!-- items table card -->
      <div class="bg-white rounded-2xl border border-surface-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
          <h2 class="font-bold text-surface-900">Purchased Items</h2>
          <span class="text-xs font-medium text-surface-500">
            {{ transaction.items?.length || 0 }} Items
          </span>
        </div>

        <DataTable :value="transaction.items || []" class="clean-table">
          <!-- product -->
          <Column field="product.name" header="Product" class="min-w-60">
            <template #body="{ data }">
              <div class="flex items-center gap-3">
                <img
                  v-if="data.product?.image"
                  :src="data.product.image"
                  class="w-10 h-10 rounded-lg object-cover bg-surface-100"
                />
                <div
                  v-else
                  class="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-surface-400"
                >
                  <i class="pi pi-box text-lg"></i>
                </div>
                <div>
                  <div class="font-semibold text-surface-900">
                    {{ data.product?.name || `Product #${data.product_id}` }}
                  </div>
                  <div v-if="data.product?.category" class="text-xs text-surface-400">
                    {{ data.product.category.name }}
                  </div>
                </div>
              </div>
            </template>
          </Column>

          <!-- unit price -->
          <Column field="price" header="Price" class="min-w-32">
            <template #body="{ data }">
              <span class="text-surface-700">
                {{ formatPrice(data.price) }}
              </span>
            </template>
          </Column>

          <!-- quantity -->
          <Column field="quantity" header="Qty" class="min-w-20">
            <template #body="{ data }">
              <span class="font-semibold text-surface-900">
                x{{ data.quantity }}
              </span>
            </template>
          </Column>

          <!-- subtotal -->
          <Column header="Total" class="min-w-32 text-right">
            <template #body="{ data }">
              <span class="font-semibold text-surface-900">
                {{ formatPrice(data.subtotal ?? (data.price * data.quantity)) }}
              </span>
            </template>
          </Column>
        </DataTable>

        <!-- summary calculations -->
        <div class="p-6 bg-surface-50/50 border-t border-surface-100 flex justify-end">
          <div class="w-full md:w-80 flex flex-col gap-3">
            <div class="flex justify-between items-center text-sm">
              <span class="text-surface-500">Subtotal</span>
              <span class="font-medium text-surface-900">
                {{ formatPrice(transaction.subtotal) }}
              </span>
            </div>

            <div class="flex justify-between items-center text-sm">
              <span class="text-surface-500">Tax</span>
              <span class="font-medium text-surface-900">
                {{ formatPrice(transaction.tax) }}
              </span>
            </div>

            <div class="pt-3 border-t border-surface-200 flex justify-between items-center">
              <span class="font-bold text-surface-900 text-base">Total</span>
              <span class="font-bold text-xl text-primary-600">
                {{ formatPrice(transaction.total) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
