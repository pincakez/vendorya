import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', component: () => import('../views/Dashboard.vue') },
        { path: 'my-dashboard', component: () => import('../views/MyDashboard.vue') },
        
        // Inventory
        { path: 'inventory', redirect: '/inventory/products' },
        { path: 'inventory/reports', component: () => import('../views/InventoryReports.vue') },
        { path: 'inventory/products', component: () => import('../views/InventoryProducts.vue') },
        { path: 'inventory/categories', component: () => import('../views/InventoryCategories.vue') },
        { path: 'inventory/suppliers', component: () => import('../views/InventorySuppliers.vue') },

        // Sales
        { path: 'sales', redirect: '/sales/reports' },
        { path: 'sales/reports', component: () => import('../views/SalesReports.vue') },
        { path: 'sales/invoices', component: () => import('../views/SalesInvoices.vue') },
        { path: 'sales/customers', component: () => import('../views/SalesCustomers.vue') },

        // Purchases
        { path: 'purchases', redirect: '/purchases/reports' },
        { path: 'purchases/reports', component: () => import('../views/PurchasesReports.vue') },
        { path: 'purchases/invoices', component: () => import('../views/PurchasesInvoices.vue') },

        // Finance
        { path: 'finance', redirect: '/finance/dashboard' },
        { path: 'finance/dashboard', component: () => import('../views/FinanceDashboard.vue') },
        { path: 'finance/expenses', component: () => import('../views/FinanceExpenses.vue') },
        { path: 'finance/assets', component: () => import('../views/FinanceAssets.vue') },

        // Reports
        { path: 'reports', redirect: '/reports/analysis' },
        { path: 'reports/analysis', component: () => import('../views/ReportsAnalysis.vue') },
        { path: 'reports/logs', component: () => import('../views/ReportsLogs.vue') },

        // Settings
        { path: 'settings', redirect: '/settings/general' },
        { path: 'settings/general', component: () => import('../views/SettingsGeneral.vue') },
        { path: 'settings/profile', component: () => import('../views/SettingsProfile.vue') },
        { path: 'settings/users', component: () => import('../views/SettingsUsers.vue') }
      ]
    }
  ]
})

export default router
