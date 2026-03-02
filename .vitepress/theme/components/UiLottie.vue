<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import type { AnimationItem } from 'lottie-web';
import lottie from 'lottie-web';

interface Props {
  size?: number;
  data: any;
  name?: string;
  lastFrame?: number;
}

const props = withDefaults(defineProps<Props>(), {
  name: 'lottie-' + Math.random(),
  speed: 1,
  size: 56,
  lastFrame: undefined
});

const emit = defineEmits<{
  (e: 'init', value: AnimationItem): void;
  (e: 'complete'): void;
}>();

let instance: AnimationItem | null = null;

const root = ref<HTMLElement | null>(null);

const sizeInPx = computed((): string => `${props.size}px`);

onMounted((): void => {
  instance = lottie.loadAnimation({
    container: root.value as HTMLElement,
    renderer: 'svg',
    name: props.name,
    loop: true,
    autoplay: true,
    path: `/lottie/${props.data}.json`
  });

  instance.addEventListener('complete', () => {
    emit('complete');
  });

  emit('init', instance);
});

function play(): void {
  instance?.play();
}

function pause(): void {
  instance?.play();
}

function stop(): void {
  instance?.play();
}

defineExpose({
  play,
  pause,
  stop
});
</script>

<template>
  <span ref="root" class="ui-lottie"></span>
</template>

<style scoped>
.ui-lottie {
  display: block;
  width: v-bind(sizeInPx);
  height: v-bind(sizeInPx);
}

.ui-lottie:deep(svg) {
  display: block;
  margin: 0 auto;
}
</style>
