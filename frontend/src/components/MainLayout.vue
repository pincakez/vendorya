<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { menuTree } from '../data/navigation';
import { PhCaretLeft, PhCaretRight, PhPlus } from "@phosphor-icons/vue";

const route = useRoute();
const isSidebarCollapsed = ref(false);
const isActionsCollapsed = ref(false);
const sidebarNav = ref(null);
const activeIndicatorStyle = ref({ top: '0px', opacity: 0 });

const toggleSidebar = () => isSidebarCollapsed.value = !isSidebarCollapsed.value;
const toggleActions = () => isActionsCollapsed.value = !isActionsCollapsed.value;

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/' || route.path.startsWith('/dashboard') || route.path.startsWith('/my-dashboard');
  }
  return route.path.startsWith(path);
};

const currentSubMenus = computed(() => {
  const activeParent = menuTree.find(item => isActive(item.path));
  return activeParent ? activeParent.subMenus : [];
});

// --- ELEVATOR ANIMATION LOGIC ---
const updateElevator = async () => {
  await nextTick();
  if (!sidebarNav.value) return;

  // Find the active link inside the nav
  const activeLink = sidebarNav.value.querySelector('.active-target');
  
  if (activeLink) {
    // Calculate position relative to the nav container
    const topPosition = activeLink.offsetTop;
    activeIndicatorStyle.value = {
      top: `${topPosition}px`,
      opacity: 1
    };
  } else {
    activeIndicatorStyle.value = { ...activeIndicatorStyle.value, opacity: 0 };
  }
};

watch(
  () => route.path,
  () => updateElevator(),
  { immediate: true }
);
</script>

<template>
  <div class="app-layout">
    <aside :class="['sidebar', { collapsed: isSidebarCollapsed }]">
      <div class="logo-area">
        <img v-if="!isSidebarCollapsed" src="https://i.ibb.co/9kVzWCh0/vendorya-180x54.png" alt="Vendorya" class="logo-main">
        <img v-else src="https://i.ibb.co/Fkf3BtLF/vendoria-mini-45x45.png" alt="V" class="logo-mini">
      </div>

      <nav class="sidebar-nav" ref="sidebarNav">
        <!-- THE GHOST ELEVATOR -->
        <div class="sidebar-elevator" :style="activeIndicatorStyle"></div>

        <RouterLink 
          v-for="item in menuTree" 
          :key="item.id" 
          :to="item.path" 
          class="nav-item"
          :class="{ 'active-target': isActive(item.path) }"
        >
          <component :is="item.icon" class="nav-icon" />
          <span v-if="!isSidebarCollapsed">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <button @click="toggleSidebar" class="sidebar-toggle">
        <PhCaretLeft v-if="!isSidebarCollapsed" />
        <PhCaretRight v-else />
        <span v-if="!isSidebarCollapsed" style="margin-left: 8px">Collapse</span>
      </button>
    </aside>

    <!-- MAIN CONTENT (Keep existing) -->
    <div class="main-wrapper">
      <header class="top-header">
        <div class="header-left">Header Content (Search, Profile)</div>
      </header>

      <div class="sub-menu-bar" v-if="currentSubMenus.length > 0">
        <RouterLink 
          v-for="(sub, index) in currentSubMenus" 
          :key="index" 
          :to="sub.path" 
          class="sub-menu-link"
        >
          {{ sub.label }}
        </RouterLink>
      </div>

      <main class="content-scrollable">
        <div class="quick-actions-container">
          <div v-if="!isActionsCollapsed" class="actions-group">
            <button class="action-btn"><PhPlus weight="bold"/> New Invoice</button>
            <button class="action-btn"><PhPlus weight="bold"/> New Supplier</button>
            <button class="action-btn"><PhPlus weight="bold"/> New Item</button>
          </div>
          <button @click="toggleActions" class="collapse-btn">
            <PhCaretRight v-if="isActionsCollapsed" />
            <PhCaretLeft v-else />
          </button>
        </div>
        <div class="page-content">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
