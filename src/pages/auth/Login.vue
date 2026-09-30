<script setup lang="ts">
import { Button, InputText } from 'primevue'
import { ref } from 'vue'

const form = ref({
  email: '',
  password: '',
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-surface-50 px-4 py-10">
    <div class="w-full max-w-100">
      <!-- card -->
      <div class="bg-white p-8 rounded-2xl shadow-xl border border-surface-100">
        <!-- header -->
        <div class="text-center mb-8">
          <!-- logo -->
          <div
            class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 mx-auto mb-4"
          >
            <i class="pi pi-bolt text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-surface-900 mb-2">Welcome Back</h1>
          <p class="text-surface-500">Please sign in to your account</p>
        </div>

        <!-- form -->
        <form action="" class="flex flex-col gap-5">
          <!-- Email -->
          <div class="flex flex-col gap-2">
            <label for="email" class="font-medium text-surface-900"
              >Email <span class="text-red-600">*</span>
            </label>
            <InputText
              id="email"
              v-model="form.email"
              type="text"
              placeholder="name@email.com"
              fluid
              class="!bg-surface-50 focus:!bg-white"
            />
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-2">
            <label for="password" class="font-medium text-surface-900"
              >Password <span class="text-red-600">*</span>
            </label>
            <InputText
              id="password"
              v-model="form.password"
              type="password"
              placeholder="********"
              fluid
              class="!bg-surface-50 focus:!bg-white"
            />
          </div>

          <!-- Button -->
          <Button type="submit" label="Login" fluid class="mt-2" />
        </form>
      </div>
    </div>
  </div>
</template>
