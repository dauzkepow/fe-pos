<script setup lang="ts">
import { createCustomer, getCustomer, updateCustomer } from '@/api/customers.api'
import router from '@/router'
import { Button, InputText, Message, useToast } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const toast = useToast()

const loading = ref(false)
const errors = ref<Record<string, string[]>>({})

const form = ref({
  id: 0,
  name: '',
  phone: '',
})

// page create dan edit sama tidak perlu buat 2 page
const customerId = computed<number | null>(() => (route.params.id ? Number(route.params.id) : null))
const isEdit = computed(() => !!customerId.value)

// submit input data | edit
const submit = async () => {
  loading.value = true

  try {
    // jika edit jalankan update
    if (isEdit.value) {
      await updateCustomer(form.value.id, {
        name: form.value.name,
        phone: form.value.phone || null,
      }) // id, payload
    } else {
      // jika mode create jalankan create
      await createCustomer({
        name: form.value.name,
        phone: form.value.phone || null,
      })
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      // ternary
      detail: isEdit.value ? 'Customer updated successfully' : 'Customer created successfully',
      life: 3000,
    })

    router.push('/customers')
  } catch (error: any) {
    if (error.response?.status === 422) {
      errors.value = error.response?.data.errors ?? {}
      return
    }

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Something went wrong',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

// edit customer, gunakan endpoint /customers/id
onMounted(async () => {
  // jika bukan edit function ini tidak perlu dijalankan
  if (!isEdit.value) return

  loading.value = true

  try {
    const res = await getCustomer(customerId.value!) // panggil api getCustomer
    const data = res.data.data // buat variabel data diambil dari res data

    // set value form
    form.value.id = data.id
    form.value.name = data.name
    form.value.phone = data.phone ?? ''
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load customer!',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-surface-50 font-sans text-surface-900">
    <!-- top header sections -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 mb-1">
          <span v-if="isEdit"> Edit Customer </span>
          <span v-else> Create Customer </span>
        </h1>
        <p class="text-surface-500 text-sm">
          <span v-if="isEdit"> Update Customer Detail </span>
          <span v-else> Add a new customer </span>
        </p>
      </div>

      <!-- 
      - navigasi
      - asChild = teruskan style primevue ke element anak di dalam RouterLink
      - v-slot="slotProps" = event bawaan primevue agar bisa dipasang ke tag <RouterLink>
      - :class="slotProps.class" = terapkan visual bawaan primevue ke <RouterLink>
      - :to="" = tujuan navigasi menggunakan named route tanpa reload halaman (SPA)
        -->
      <Button asChild v-slot="slotProps">
        <!-- Routerlink pindah antar link karena SPA -->
        <RouterLink :to="{ name: 'customers' }" :class="slotProps.class">
          <i class="pi pi-arrow-left"> </i>
          Back
        </RouterLink>
      </Button>
    </div>

    <!-- form -->
    <div class="bg-white rounded-2xl border border-surface-200 overflow-hidden max-w-2xl">
      <form @submit.prevent="submit">
        <div class="p-6 md:p-8 flex flex-col gap-6">
          <!-- Name -->
          <div class="flex flex-col gap-2">
            <label for="name" class="font-medium text-surface-900">
              Name <span class="text-red-600">*</span>
            </label>
            <InputText
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Customer Name"
              fluid
              class="bg-surface-50! focus:bg-white! border-surface-200"
              :invalid="!!errors.name"
            />

            <Message v-if="errors.name" severity="error" size="small" variant="simple">
              {{ errors.name[0] }}
            </Message>
          </div>

          <!-- Phone -->
          <div class="flex flex-col gap-2">
            <label for="phone" class="font-medium text-surface-900">Phone</label>
            <InputText
              id="phone"
              v-model="form.phone"
              type="text"
              placeholder="e.g. 08123456789"
              fluid
              class="bg-surface-50! focus:bg-white! border-surface-200"
              :invalid="!!errors.phone"
            />

            <Message v-if="errors.phone" severity="error" size="small" variant="simple">
              {{ errors.phone[0] }}
            </Message>
          </div>

          <!-- Button -->
          <div class="flex justify-end pt-4 border-t border-surface-100">
            <div class="flex gap-3">
              <Button label="Cancel" severity="secondary" text @click="router.back()" />
              <Button
                type="submit"
                :label="isEdit ? 'Update Customer' : 'Save Customer'"
                icon="pi pi-check"
                :loading="loading"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
