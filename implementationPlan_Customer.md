# Implementation Plan: Customer CRUD

Create a full CRUD for **Customers** following the exact same patterns, Indonesian comments, and conventions as **Product Categories** and **Products**.

## Overview

Based on the Laravel model and form request provided:

- **Model**: `Customer` with fillable `['name', 'phone']` and search scope on `name` or `phone`.
- **Validation** (`StoreCustomerRequest`):
  - `name`: `required|string|max:255`
  - `phone`: `nullable|string|max:20`

---

## Proposed Changes

### 1. `src/types/customer.ts` — Type Definition

Create type interface for `Customer`:

```typescript
export interface Customer {
  id: number
  name: string
  phone?: string | null
  created_at?: string
  updated_at?: string
}
```

### 2. `src/api/customers.api.ts` — API Layer

Following [product-categories.api.ts](file:///home/kepow/projects/fe-pos/src/api/product-categories.api.ts):

- `getCustomers(params)`: `GET /customers` with query params `page`, `search`, `limit`
- `getCustomer(id)`: `GET /customers/:id`
- `createCustomer(payload)`: `POST /customers` with `{ name, phone? }`
- `updateCustomer(id, payload)`: `PUT /customers/:id` with `{ name, phone? }`
- `deleteCustomer(id)`: `DELETE /customers/:id`

### 3. `src/stores/customer.store.ts` — Pinia Store

Following [product-category.store.ts](file:///home/kepow/projects/fe-pos/src/stores/product-category.store.ts):

- **State**: `items`, `pagination` (`current_page`, `last_page`, `per_page`, `total`, `from`, `to`), `page`, `limit`, `search`, `loading`
- **Getters**: `currentPage`, `totalPages`
- **Actions**: `fetch()`, `setPage(page)`, `setLimit(limit)`, `nextPage()`, `prevPage()`

### 4. `src/pages/customers/CustomerList.vue` — List Page

Following [CategoryList.vue](file:///home/kepow/projects/fe-pos/src/pages/product-categories/CategoryList.vue):

- Header with title, subtitle, and "Add Customer" button
- Search field with debounce (`useDebounceFn` 400ms)
- `DataTable` with columns:
  - **Name**: with avatar icon / badge
  - **Phone**: customer phone number or `-`
  - **Actions**: Edit button (RouterLink) and Delete button (ConfirmDialog)
- Pagination bar with rows-per-page select and Next/Previous navigation
- Delete confirmation dialog with PrimeVue `useConfirm` and `useToast`

### 5. `src/pages/customers/CustomerForm.vue` — Create/Edit Form

Following [CategoryForm.vue](file:///home/kepow/projects/fe-pos/src/pages/product-categories/CategoryForm.vue):

- Shared create & edit form (determined by `route.params.id`)
- Header with Back button and dynamic title/subtitle
- Inputs:
  - **Name** (`InputText`, required with asterisk)
  - **Phone** (`InputText`, optional)
- 422 error display below inputs using PrimeVue `<Message>`
- Submit action with loading state and toast feedback
- Auto-fetch data on `onMounted` when editing

### 6. `src/router/index.ts` — Route Registration

Register customer routes under `AppLayout`:

- `/customers` → `CustomerList` (name: `customers`)
- `/customers/create` → `CustomerForm` (name: `customers-create`)
- `/customers/:id/edit` → `CustomerForm` (name: `customers-edit`)

### 7. `src/layout/AppSidebar.vue` — Navigation

Add "Customer" item (`icon: 'pi pi-users'`, `to: '/customers'`) to the Management section in the sidebar.

---

## Execution Order

| Step | File                                   | Action                       |
| ---- | -------------------------------------- | ---------------------------- |
| 1    | `src/types/customer.ts`                | Create customer interface    |
| 2    | `src/api/customers.api.ts`             | Create API layer             |
| 3    | `src/stores/customer.store.ts`         | Create Pinia store           |
| 4    | `src/pages/customers/CustomerList.vue` | Create list page             |
| 5    | `src/pages/customers/CustomerForm.vue` | Create form page             |
| 6    | `src/router/index.ts`                  | Register customer routes     |
| 7    | `src/layout/AppSidebar.vue`            | Add customer menu to sidebar |

---

## Verification Plan

1. **Type & Build Check**: Run `npm run build` or Vite build check to ensure all components and imports compile cleanly.
2. **Component & Route Validation**: Verify route definitions, Pinia store actions, and reactivity bindings.
