<template>
  <div class="products-container">
    <div class="products-header">
      <h1>Inventory Products</h1>
      <div class="search-bar">
        <input
          type="text"
          v-model="filterInput"
          placeholder="Search all columns..."
          @input="handleSearchInput"
        />
      </div>
    </div>

    <!-- Use the reusable BaseDataGrid component -->
    <BaseDataGrid :data="data" :columns="columns" :globalFilterInput="globalFilter" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseDataGrid from '../components/BaseDataGrid.vue';
import { createColumnHelper } from '@tanstack/vue-table';

const columnHelper = createColumnHelper();

// Data structure for a product with updated fields
class Product {
  constructor(id, season, gender, type, model, size, wholesalePrice, retailPrice, supplier, inStock) {
    this.id = id;
    this.season = season;
    this.gender = gender;
    this.type = type;
    this.model = model;
    this.size = size;
    this.wholesalePrice = wholesalePrice;
    this.retailPrice = retailPrice;
    this.profit = (retailPrice - wholesalePrice).toFixed(2); // Calculate profit
    this.supplier = supplier;
    this.inStock = inStock;
  }
}

// Generate 30 random product items with updated fields
const generateRandomProducts = (count) => {
  const products = [];
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  const genders = ['Male', 'Female', 'Unisex'];
  const types = ['Shirt', 'Pants', 'Dress', 'Jacket', 'Shoes', 'Accessory'];
  const models = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const suppliers = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D', 'Supplier E'];

  for (let i = 0; i < count; i++) {
    const id = `PROD-${String(i + 1).padStart(3, '0')}`;
    const season = seasons[Math.floor(Math.random() * seasons.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const model = models[Math.floor(Math.random() * models.length)];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const wholesalePrice = (Math.random() * 50 + 10).toFixed(2);
    const retailPrice = (parseFloat(wholesalePrice) * (1 + Math.random() * 0.5 + 0.1)).toFixed(2); // 10-60% profit
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const inStock = Math.floor(Math.random() * 500);

    products.push(new Product(id, season, gender, type, model, size, parseFloat(wholesalePrice), parseFloat(retailPrice), supplier, inStock));
  }
  return products;
};

const data = ref(generateRandomProducts(30));

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('season', {
    header: 'SEASON',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('gender', {
    header: 'GENDER',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'TYPE',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('model', {
    header: 'MODEL',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('size', {
    header: 'SIZE',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('wholesalePrice', {
    header: 'W-PRICE', // Renamed
    cell: info => `$${info.getValue()}`,
  }),
  columnHelper.accessor('retailPrice', {
    header: 'R-PRICE', // Renamed
    cell: info => `$${info.getValue()}`,
  }),
  columnHelper.accessor('profit', {
    header: 'PROFIT',
    cell: info => `$${info.getValue()}`,
  }),
  columnHelper.accessor('supplier', {
    header: 'SUPPLIER',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('inStock', {
    header: 'IN STOCK',
    cell: info => info.getValue(),
  }),
];

// Global filter state
const filterInput = ref(''); // Use a separate ref for input
const globalFilter = ref(''); // This will be the actual filter value for TanStack
// Debounce for search input - updated logic
let searchTimeout = null;
const handleSearchInput = (event) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    globalFilter.value = event.target.value; // Always update globalFilter
  }, 300); // 300ms debounce
};
</script>

<style scoped>
/* Scoped styles for InventoryProducts.vue */
.products-header {
  margin-bottom: 10px; /* Reduced margin to move content up */
}

.search-bar {
  margin-top: 15px; /* Added a small margin for spacing below the title */
}

.search-bar input {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  width: 300px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
  transition: border-color 0.2s ease;
}

.search-bar input:focus {
  outline: none;
  border-color: var(--brand-blue);
  box-shadow: 0 0 0 2px rgba(var(--brand-blue), 0.2);
}
</style>
