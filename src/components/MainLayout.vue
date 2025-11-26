<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { menuTree } from '../data/navigation';
import { PhCaretLeft, PhCaretRight, PhPlus } from "@phosphor-icons/vue";

const route = useRoute();
const isSidebarCollapsed = ref(false);
const isActionsCollapsed = ref(false);
const sidebarNav = ref(null);
const subMenuBar = ref(null); // Ref for the sub-menu container
const contentScrollable = ref(null); // Ref for the scrollable content area

// Animation Refs
const activeIndicatorStyle = ref({ top: '0px', opacity: 0 }); // Sidebar Elevator
const sliderStyle = ref({ left: '0px', width: '0px', opacity: 0 }); // Sub-menu Slider

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

// --- 1. SIDEBAR ELEVATOR LOGIC ---
const updateElevator = async () => {
  await nextTick();
  if (!sidebarNav.value) return;
  const activeLink = sidebarNav.value.querySelector('.active-target');
  if (activeLink) {
    activeIndicatorStyle.value = { top: `${activeLink.offsetTop}px`, opacity: 1 };
  } else {
    activeIndicatorStyle.value = { ...activeIndicatorStyle.value, opacity: 0 };
  }
};

// --- 2. SUB-MENU SLIDER LOGIC ---
const updateSlider = async () => {
  await nextTick();
  if (!subMenuBar.value) return;
  const activeLink = subMenuBar.value.querySelector('.router-link-active');
  if (activeLink) {
    sliderStyle.value = {
      left: `${activeLink.offsetLeft}px`,
      width: `${activeLink.offsetWidth}px`,
      opacity: 1
    };
  } else {
    sliderStyle.value = { ...sliderStyle.value, opacity: 0 };
  }
};

// Watch route to trigger animations
watch(() => route.path, () => {
  updateElevator();
  updateSlider();
}, { immediate: true });

// --- AUTO-COLLAPSE ON SCROLL LOGIC ---
let lastScrollTop = 0;
let scrollTimeout = null;
const SCROLL_THRESHOLD = 100; // Pixels to scroll before collapsing

const handleScroll = () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  scrollTimeout = setTimeout(() => {
    if (!contentScrollable.value) return;

    const currentScrollTop = contentScrollable.value.scrollTop;
    const scrollDifference = Math.abs(currentScrollTop - lastScrollTop);

    if (scrollDifference > SCROLL_THRESHOLD && !isActionsCollapsed.value) {
      isActionsCollapsed.value = true;
    }
    lastScrollTop = currentScrollTop;
  }, 100); // Debounce scroll event
};

onMounted(() => {
  if (contentScrollable.value) {
    contentScrollable.value.addEventListener('scroll', handleScroll);
  }
});

onBeforeUnmount(() => {
  if (contentScrollable.value) {
    contentScrollable.value.removeEventListener('scroll', handleScroll);
  }
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
});
</script>

<template>
  <div class="app-layout">
    <!-- SIDEBAR (Keep existing) -->
    <aside :class="['sidebar', { collapsed: isSidebarCollapsed }]">
      <div class="logo-area">
        <img v-if="!isSidebarCollapsed" src="https://i.ibb.co/9kVzWCh0/vendorya-180x54.png" alt="Vendorya" class="logo-main">
        <img v-else src="https://i.ibb.co/Fkf3BtLF/vendoria-mini-45x45.png" alt="V" class="logo-mini">
      </div>
      <nav class="sidebar-nav" ref="sidebarNav">
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

    <!-- MAIN CONTENT -->
    <div class="main-wrapper">
      <header class="top-header">
        <div class="header-left">Header Content (Search, Profile)</div>
      </header>

      <!-- SUB-MENU BAR (Updated with Slider) -->
      <div class="sub-menu-bar" v-if="currentSubMenus.length > 0" ref="subMenuBar">
        <RouterLink 
          v-for="(sub, index) in currentSubMenus" 
          :key="index" 
          :to="sub.path" 
          class="sub-menu-link"
        >
          {{ sub.label }}
        </RouterLink>
        <!-- THE MAGIC LINE -->
        <div class="sliding-line" :style="sliderStyle"></div>
      </div>

      <main class="content-scrollable" ref="contentScrollable">
        <div :class="['quick-actions-container', { collapsed: isActionsCollapsed }]">
          <div class="actions-group">
            <button class="action-btn"><PhPlus weight="bold"/> New Invoice</button>
            <button class="action-btn"><PhPlus weight="bold"/> New Supplier</button>
            <button class="action-btn"><PhPlus weight="bold"/> New Item</button>
          </div>
          <button @click="toggleActions" class="collapse-btn">
            <!-- The icon will now rotate with the button itself due to CSS transition on .collapse-btn -->
            <PhCaretLeft v-if="!isActionsCollapsed" />
            <PhCaretRight v-else />
          </button>
        </div>
        <div class="page-content">
          <RouterView v-slot="{ Component }">
            <Transition name="fade-slide" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </main>
    </div>
  </div>
</template>
