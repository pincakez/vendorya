<template>
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
</template>

<script setup>
import { ref, watch } from 'vue';
import {
  useVueTable,
  getCoreRowModel,
  getFilteredRowModel,
} from '@tanstack/vue-table';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  globalFilterInput: {
    type: String,
    default: '',
  },
});

const globalFilter = ref(props.globalFilterInput);

watch(() => props.globalFilterInput, (newValue) => {
  globalFilter.value = newValue;
});

const table = useVueTable({
  data: props.data,
  columns: props.columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // Enable filtering
  state: {
    get globalFilter() {
      return globalFilter.value;
    },
  },
  onGlobalFilterChange: value => (globalFilter.value = value),
  globalFilterFn: (row, columnId, filterValue) => {
    if (!filterValue || filterValue.length < 3) return true;

    const search = String(filterValue).toLowerCase();
    return row.getVisibleCells().some(cell => {
      const cellValue = String(cell.getValue()).toLowerCase();
      return cellValue.includes(search);
    });
  },
});
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto; /* Enable horizontal scrolling for wide tables */
  margin-top: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--brand-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.201);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  color: var(--brand-text);
  min-width: 700px; /* Ensure table has a minimum width for scrolling */
}

.data-table thead {
  background-color: var(--brand-blue); /* Use brand-blue for header background */
  position: sticky;
  top: 0;
  z-index: 2; /* Keep header sticky on scroll */
}

.data-table th {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 2px solid var(--border-color);
  font-weight: 600;
  color: var(--brand-bg); /* Use brand-bg for header text */
}

.data-table tbody tr {
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
}

.data-table tbody tr:hover {
  background-color: rgba(var(--brand-blue), 0.05); /* Light hover effect */
}

.data-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* Adjust as needed for column width */
  padding: 10px 15px;
  vertical-align: middle;
}

.data-table tbody tr:last-child {
  border-bottom: none;
}
</style>
