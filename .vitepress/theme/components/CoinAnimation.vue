<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { use3dAnimation } from './../hooks/3dAnimation';

const element = ref<HTMLElement>();

const { renderCoin, resize, dispose } = use3dAnimation();

async function init(): Promise<void> {
  if (!element.value) {
    return;
  }

  const canvas = await renderCoin();

  element.value?.appendChild(canvas);

  resize('communicator');
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  dispose('communicator');
});
</script>

<template>
  <div class="coin-animation">
    <div ref="element" class="coin-animation__body" />
  </div>
</template>

<style scoped>
.coin-animation__body {
  position: relative;
  width: 300px;
  height: 300px;
  margin: -6px;
}

.coin-animation :deep(canvas) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.coin-animation :deep(canvas):focus {
  outline: none;
}
</style>
