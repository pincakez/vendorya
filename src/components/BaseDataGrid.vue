<script setup>
import { ref, computed } from 'vue';
import { 
  useVueTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getFilteredRowModel,
  getSortedRowModel,
  flexRender 
} from '@tanstack/vue-table';
import { PhMagnifyingGlass, PhCaretUp, PhCaretDown, PhCaretUpDown } from "@phosphor-icons/vue";

const props = defineProps({
  data: Array,
  columns: Array
});

const globalFilter = ref('');
const pageSize = ref(30);

const activeSearch = computed(() => {
  return globalFilter.value.length >= 3 ? globalFilter.value : '';
});

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  state: {
    get globalFilter() { return activeSearch.value },
    get pagination() { return { pageIndex: 0, pageSize: pageSize.value } }
  },
  onGlobalFilterChange: (val) => { globalFilter.value = val }
});
</script>

<template>
  <div class="grid-container">
    <div class="grid-toolbar">
      <div class="search-wrapper">
        <PhMagnifyingGlass class="search-icon" />
        <input v-model="globalFilter" type="text" placeholder="Inventory Search (Type /h for help)" class="search-input" />
      </div>
      <div class="pagination-controls">
        <span class="page-info">Items per page:</span>
        <select v-model="pageSize" class="page-select">
          <option :value="30">30</option>
          <option :value="40">40</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th v-for="header in headerGroup.headers" :key="header.id" @click="header.column.getToggleSortingHandler()?.($event)" class="grid-header">
              <div class="header-content">
                <component :is="flexRender(header.column.columnDef.header, header.getContext())" />
                <span class="sort-icon" v-if="header.column.getCanSort()">
                  <PhCaretUp v-if="header.column.getIsSorted() === 'asc'" />
                  <PhCaretDown v-else-if="header.column.getIsSorted() === 'desc'" />
                  <PhCaretUpDown v-else class="inactive-sort" />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id" class="grid-row">
            <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="grid-cell">
              <component :is="flexRender(cell.column.columnDef.cell, cell.getContext())" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="grid-footer">Showing {{ table.getRowModel().rows.length }} items</div>
  </div>
</template>

<style scoped>
.grid-container { display: flex; flex-direction: column; gap: 16px; height: 100%; }
.grid-toolbar { display: flex; justify-content: space-between; align-items: center; }
.search-wrapper { position: relative; width: 400px; display: flex; align-items: center; }
.search-icon { position: absolute; left: 12px; color: var(--brand-text-light); font-size: 18px; }
.search-input { width: 100%; padding: 10px 12px 10px 40px; border: 1px solid var(--border-color); border-radius: var(--radius-md); font-size: 14px; outline: none; transition: border 0.2s; }
.search-input:focus { border-color: var(--brand-blue); }
.table-wrapper { flex: 1; overflow: auto; background: white; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); }
table { width: 100%; border-collapse: collapse; min-width: 1000px; }
.grid-header { text-align: left; padding: 16px; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); position: sticky; top: 0; z-index: 10; border-bottom: 1px solid var(--border-color); font-size: 12px; font-weight: 700; color: var(--brand-text-light); text-transform: uppercase; cursor: pointer; user-select: none; }
.header-content { display: flex; align-items: center; gap: 8px; }
.sort-icon { font-size: 14px; }
.inactive-sort { opacity: 0.3; }
.grid-row { border-bottom: 1px solid #f1f3f4; transition: background 0.1s; }
.grid-row:hover { background: #f8f9fa; }
.grid-cell { padding: 14px 16px; font-size: 14px; color: var(--brand-text); }
.page-select { padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color); }
.grid-footer { font-size: 13px; color: var(--brand-text-light); text-align: right; }
</style>
