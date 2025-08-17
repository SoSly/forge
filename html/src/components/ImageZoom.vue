<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  imageSrc: string;
  visible: boolean;
}>();

const emits = defineEmits(['close']);

const overlayRef = ref<HTMLElement>();

function closeZoom() {
  emits('close');
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeZoom();
  }
}

function handleOverlayClick(event: MouseEvent) {
  closeZoom();
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <div 
    v-if="visible" 
    ref="overlayRef"
    class="image-zoom-overlay" 
    @click="handleOverlayClick"
  >
    <div class="image-zoom-container">
      <img :src="imageSrc" class="image-zoom-image" alt="Zoomed image" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-zoom-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483648;
  animation: fadeIn 0.3s ease-out;
}

.image-zoom-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  box-sizing: border-box;
}

.image-zoom-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: zoomIn 0.3s ease-out;
}


@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>