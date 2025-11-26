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

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
              :style="{ width: header.getSize() + 'px' }"
            >
              <template v-if="!header.isPlaceholder">
                {{ header.column.columnDef.header }}
              </template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id">
            <td v-for="cell in row.getVisibleCells()" :key="cell.id">
              {{ cell.getValue() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  useVueTable,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
} from '@tanstack/vue-table';

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
// Column sizing state - removed completely
// const columnSizing = ref({}); 

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


const table = useVueTable({
  data: data.value,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // Enable filtering
  // enableColumnResizing: false, // Removed completely
  // columnResizeMode: 'onChange', // Removed completely
  state: {
    get globalFilter() {
      return globalFilter.value;
    },
    // Removed columnSizing from state
  },
  onGlobalFilterChange: value => (globalFilter.value = value), // Re-enabled
  // Removed onColumnSizingChange
  // Custom filter function for case-insensitive and all-column search
  globalFilterFn: (row, columnId, filterValue) => {
    if (!filterValue || filterValue.length < 3) return true; // Only filter after 3 characters

    const search = String(filterValue).toLowerCase();
    return row.getVisibleCells().some(cell => {
      const cellValue = String(cell.getValue()).toLowerCase();
      return cellValue.includes(search);
    });
  },
});

// No need for watchEffect here, as `globalFilter` is now directly passed to the table state.
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

/* Resize handle styles - removed completely */
/* .resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 5px;
  background: var(--brand-blue);
  cursor: col-resize;
  user-select: none;
  touch-action: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

th:hover .resize-handle {
  opacity: 1;
}

.resize-handle.is-resizing {
  opacity: 1;
  background: var(--brand-red);
} */

/* Table wrapper and container styles for single scrollbar */
.products-container {
  /* Removed overflow-y: visible from here to allow main page to scroll */
}
.table-wrapper {
  max-height: none; /* Allow content to push page scrollbar */
  overflow-y: visible; /* Prevent table from having its own scrollbar */
  position: relative;
  margin-top: 20px; /* Adjust margin between search bar and table */
}

/* New styles for text truncation */
.data-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* Adjust as needed for column width */
}

/* Header cells also get truncation if they are too long */
.data-table th div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
