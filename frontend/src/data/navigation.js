import { PhHouse, PhPackage, PhShoppingCart, PhReceipt, PhWallet, PhChartBar, PhGear } from "@phosphor-icons/vue";

export const menuTree = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/', 
    icon: PhHouse,
    subMenus: [
      { label: 'Main Dashboard', path: '/dashboard' }, 
      { label: 'My Dashboard', path: '/my-dashboard' }
    ]
  },
  {
    id: 'inventory',
    label: 'Inventory',
    path: '/inventory',
    icon: PhPackage,
    subMenus: [
      { label: 'Products', path: '/inventory/products' },
      { label: 'Inventory Reports', path: '/inventory/reports' },
      { label: 'Categories', path: '/inventory/categories' },
      { label: 'Suppliers', path: '/inventory/suppliers' }
    ]
  },
  {
    id: 'sales',
    label: 'Sales',
    path: '/sales',
    icon: PhReceipt,
    subMenus: [
      { label: 'Sales Reports', path: '/sales/reports' },
      { label: 'Invoices', path: '/sales/invoices' },
      { label: 'Customers', path: '/sales/customers' }
    ]
  },
  {
    id: 'purchases',
    label: 'Purchases',
    path: '/purchases',
    icon: PhShoppingCart,
    subMenus: [
      { label: 'Purchase Reports', path: '/purchases/reports' },
      { label: 'Purchase Invoices', path: '/purchases/invoices' }
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    path: '/finance',
    icon: PhWallet,
    subMenus: [
      { label: 'Financial Dashboard', path: '/finance/dashboard' },
      { label: 'Expenses', path: '/finance/expenses' },
      { label: 'Assets', path: '/finance/assets' }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: PhChartBar,
    subMenus: [
      { label: 'Smart Analysis', path: '/reports/analysis' },
      { label: 'Activity Log', path: '/reports/logs' }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: PhGear,
    subMenus: [
      { label: 'General', path: '/settings/general' },
      { label: 'Store Profile', path: '/settings/profile' },
      { label: 'Users & Permissions', path: '/settings/users' }
    ]
  }
];
