---
hello: world
---

<script setup lang="ts">
import { ref } from 'vue'
import names from './static/names.json';
import surnames from './static/surnames.json';

const MAX_ITEMS = 20;

const generated = ref([]);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateNew () {
  const [idx1, idx2] = [getRandomInt(1, names.total), getRandomInt(1, surnames.total)]
  const name = names[idx1];
  const surname = surnames[idx2];

  let a = generated.value.slice();
  a.unshift(`${name} ${surname}`);
  a = a.slice(0, MAX_ITEMS);

  generated.value = a;
}
</script>

# Генератор имён

<button @click="generateNew">Сгенерировать имя</button>

<ul>
  <li v-for="(name, idx) in generated" :key="idx"> {{name}} </li>
</ul>
