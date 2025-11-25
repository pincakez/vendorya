<template>
  <transition name="slide-up">
    <div v-if="isVisible" class="notification-bar">
      <p class="notification-text">This is a notification message!</p>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isVisible = ref(true); // For static display as requested

// Example of how it might be controlled dynamically
// onMounted(() => {
//   setTimeout(() => {
//     isVisible.value = false;
//   }, 3000);
// });
</script>

<style scoped>
.notification-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--footer-height); /* Same height as footer */
  background-color: var(--brand-green);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.notification-text {
  font-size: 0.875rem; /* text-sm */
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.5s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
