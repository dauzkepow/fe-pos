import AppLayout from '@/layout/AppLayout.vue'
import Login from '@/pages/auth/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import CategoryForm from '@/pages/product-categories/CategoryForm.vue'
import CategoryList from '@/pages/product-categories/CategoryList.vue'
import ProductForm from '@/pages/products/ProductForm.vue'
import ProductList from '@/pages/products/ProductList.vue'
import { useAuthStore } from '@/stores/auth.store'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { guest: true }, // guest tidak perlu kena login
    },
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard,
        },
        // product-categories
        {
          path: '/product-categories',
          name: 'product-categories',
          component: CategoryList,
        },
        // create product-categories-create
        {
          path: '/product-categories/create', // url yang diakses
          name: 'product-categories-create', // melakukan navigasi secara programmatic
          component: CategoryForm, // component yang dirender
        },
        // edit
        {
          path: '/product-categories/:id/edit',
          name: 'product-categories-edit',
          component: CategoryForm,
        },
        // products
        {
          path: '/products',
          name: 'products',
          component: ProductList,
        },
        // create product
        {
          path: '/products/create',
          name: 'products-create',
          component: ProductForm,
        },
        // edit product
        {
          path: '/products/:id/edit',
          name: 'products-edit',
          component: ProductForm,
        },
      ],
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (auth.isAuthenticated && !auth.user) {
    try {
      await auth.fetchUser()
    } catch {
      auth.logout()
      return next('/login')
    }
  }

  // jika belum login akan otomatis diarahkan ke halaman login
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  // jika sudah login dan sudah authenticated
  if (to.meta.guest && auth.isAuthenticated) {
    return next('/')
  }

  next()
})

export default router
