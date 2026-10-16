# Implementation Plan: Product CRUD

Create a full CRUD for **Products** following the exact same patterns as **Product Categories**.

## Overview

Based on the Laravel model, the Product has these fields:

- `id` (auto)
- `product_category_id` (FK → product_categories)
- `image` (nullable)
- `name` (string)
- `price` (decimal)
- `stock` (integer)

The backend also supports:

- Scope `search` (by name)
- Scope `byCategory` (filter by category)
- Validation: `product_category_id` required, `name` required, `price` required numeric, `stock` required integer

---

## Files to Create

### 1. `src/types/product.ts` — Type definition

- Define `Product` interface with fields: `id`, `product_category_id`, `image`, `name`, `price`, `stock`
- Include optional `category` relation (nested `ProductCategory`)

### 2. `src/api/products.api.ts` — API layer

Following [product-categories.api.ts](file:///home/kepow/projects/fe-pos/src/api/product-categories.api.ts):

- `getProducts(params)` — GET `/products` with `page`, `search`, `limit`, `category_id` params
- `getProduct(id)` — GET `/products/:id`
- `createProduct(payload)` — POST `/products`
- `updateProduct(id, payload)` — PUT `/products/:id`
- `uploadProductImage(id, formData)` — POST `/products/:id/image`
- `deleteProduct(id)` — DELETE `/products/:id`

### 3. `src/stores/product.store.ts` — Pinia store

Following [product-category.store.ts](file:///home/kepow/projects/fe-pos/src/stores/product-category.store.ts):

- State: `items`, `pagination`, `page`, `limit`, `search`, `categoryId`, `loading`
- Getters: `currentPage`, `totalPages`
- Actions: `fetch()`, `setPage()`, `setLimit()`, `setCategoryId()`, `nextPage()`, `prevPage()`

### 4. `src/pages/products/ProductList.vue` — List page

Following [CategoryList.vue](file:///home/kepow/projects/fe-pos/src/pages/product-categories/CategoryList.vue):

- DataTable with columns: Name (with image), Category, Price, Stock, Action
- Search with debounce
- Category filter dropdown (using `getCategories` API)
- Pagination controls (rows per page, prev/next)
- Delete confirmation dialog
- RouterLink to create/edit

### 5. `src/pages/products/ProductForm.vue` — Create/Edit form

Following [CategoryForm.vue](file:///home/kepow/projects/fe-pos/src/pages/product-categories/CategoryForm.vue):

- Shared create/edit page (determined by route param `id`)
- Image upload with preview (FileUpload)
- Fields: Category dropdown (Select), Name (InputText), Price (InputNumber), Stock (InputNumber)
- Validation error display (422 handling)
- Toast notifications on success/error

## Files to Modify

### 6. `src/router/index.ts` — Add product routes

Add 3 routes under the AppLayout children:

- `/products` → `ProductList` (name: `products`)
- `/products/create` → `ProductForm` (name: `products-create`)
- `/products/:id/edit` → `ProductForm` (name: `products-edit`)

---

## Execution Order

| Step | File                                 | Action             |
| ---- | ------------------------------------ | ------------------ |
| 1    | `src/types/product.ts`               | Create type        |
| 2    | `src/api/products.api.ts`            | Create API layer   |
| 3    | `src/stores/product.store.ts`        | Create Pinia store |
| 4    | `src/pages/products/ProductList.vue` | Create list page   |
| 5    | `src/pages/products/ProductForm.vue` | Create form page   |
| 6    | `src/router/index.ts`                | Register routes    |

> [!NOTE]
> All files follow the exact same coding style, comments (Indonesian), and patterns as the existing product-categories implementation.
