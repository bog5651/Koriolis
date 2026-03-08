---
hello: world
---

<script setup lang="ts">
import { ref } from 'vue'
import names from './static/names.json';
import surnames from './static/surnames.json';

const generated = ref([]);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function generateNew () {
  const [idx1, idx2] = [getRandomInt(names.total), getRandomInt(surnames.total)]
  const name = names[idx1];
  const surname = surnames[idx2];
  const a = generated.value.slice(-20);
  a.push(`${name} ${surname}`);
  generated.value = a;
}
</script>

# Генератор имён

<button @click="generateNew">Сгенерировать имя</button>

<div v-for="(name, idx) in generated" :key="idx">- {{name}}</div>
