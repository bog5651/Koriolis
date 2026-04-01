<script setup lang="ts">
import { computed, ref } from 'vue';

interface ModifierOption {
  label: string;
  value: number;
}

// Тип выстрела (только один, radio)
const fireTypeModifiers: ModifierOption[] = [
  { label: 'На вскидку', value: -2 },
  { label: 'Обычный', value: 0 },
  { label: 'Прицельный', value: +2 },
  { label: 'Автоматический', value: -2 },
];

// Дополнительные модификаторы (множественный выбор, checkbox)
const additionalModifiers: ModifierOption[] = [
  { label: 'Упор', value: +1 },
  { label: 'Штраф превышения дальности', value: -3 },
  { label: 'Скрытность', value: +3 },
  { label: 'Цель обездвижена', value: +3 },
];

// Дальность (только один, radio)
const rangeModifiers: ModifierOption[] = [
  { label: 'Нулевая', value: -3 },
  { label: 'Ближняя', value: 0 },
  { label: 'Дальняя', value: -1 },
  { label: 'Предельная', value: -2 },
];

// Размер цели (только один, radio)
const targetSizeModifiers: ModifierOption[] = [
  { label: 'Меньше человека/лежит на полу', value: -1 },
  { label: 'Обычная', value: 0 },
  { label: 'Крупная', value: +1 },
  { label: 'Гигантская', value: +2 },
];

// Ситуативные модификаторы (множественный выбор, checkbox)
const situationalModifiers: ModifierOption[] = [
  { label: '', value: -3 },
  { label: '', value: -2 },
  { label: '', value: -1 },
  { label: '', value: +1 },
  { label: '', value: +2 },
  { label: '', value: +3 },
];

// Состояние
const fireType = ref<number | null>(0);
const additionalSelection = ref<number[]>([]);
const rangeSelection = ref<number | null>(0);
const targetSizeSelection = ref<number | null>(0);
const situationalSelection = ref<number[]>([]);

const totalModifier = computed(() => {
  let sum = 0;

  if (fireType.value !== null) {
    sum += fireType.value;
  }

  sum += additionalSelection.value.reduce((acc, val) => acc + val, 0);

  if (rangeSelection.value !== null) {
    sum += rangeSelection.value;
  }

  if (targetSizeSelection.value !== null) {
    sum += targetSizeSelection.value;
  }

  sum += situationalSelection.value.reduce((acc, val) => acc + val, 0);

  return sum;
});

function handleAdditionalToggle(value: number, isChecked: boolean) {
  if (isChecked) {
    additionalSelection.value.push(value);
  } else {
    additionalSelection.value = additionalSelection.value.filter(v => v !== value);
  }
}

function handleSituationalToggle(value: number, isChecked: boolean) {
  if (isChecked) {
    situationalSelection.value.push(value);
  } else {
    situationalSelection.value = situationalSelection.value.filter(v => v !== value);
  }
}
</script>

<template>
  <div class="modifiers-container">
    <div class="columns-container">
      <div class="column left-column">
        <div class="section">
          <h4>Тип выстрела</h4>
          <div class="radio-group">
            <label v-for="option in fireTypeModifiers" :key="option.label" class="radio-option">
              <input
                type="radio"
                :value="option.value"
                v-model="fireType"
                name="fireType"
              />
              {{ option.label }} ({{ option.value > 0 ? '+' : '' }}{{ option.value }})
            </label>
          </div>
        </div>

        <div class="section">
          <h4>Дополнительные</h4>
          <div class="checkbox-group">
            <label v-for="option in additionalModifiers" :key="option.label" class="checkbox-option">
              <input
                type="checkbox"
                :value="option.value"
                @change="handleAdditionalToggle(option.value, ($event.target as HTMLInputElement).checked)"
              />
              {{ option.label }} ({{ option.value > 0 ? '+' : '' }}{{ option.value }})
            </label>
          </div>
        </div>
      </div>

      <div class="column right-column">
        <div class="section">
          <h4>Дальность</h4>
          <div class="radio-group">
            <label v-for="option in rangeModifiers" :key="option.label" class="radio-option">
              <input
                type="radio"
                :value="option.value"
                v-model="rangeSelection"
                name="range"
              />
              {{ option.label }} ({{ option.value > 0 ? '+' : '' }}{{ option.value }})
            </label>
          </div>
        </div>

        <div class="section">
          <h4>Размер цели</h4>
          <div class="radio-group">
            <label v-for="option in targetSizeModifiers" :key="option.label" class="radio-option">
              <input
                type="radio"
                :value="option.value"
                v-model="targetSizeSelection"
                name="targetSize"
              />
              {{ option.label }} ({{ option.value > 0 ? '+' : '' }}{{ option.value }})
            </label>
          </div>
        </div>

        <div class="section">
          <h4>Ситуативные</h4>
          <div class="checkbox-group">
            <label v-for="option in situationalModifiers" :key="option.label" class="checkbox-option">
              <input
                type="checkbox"
                :value="option.value"
                @change="handleSituationalToggle(option.value, ($event.target as HTMLInputElement).checked)"
              />
              {{ option.label }} ({{ option.value > 0 ? '+' : '' }}{{ option.value }})
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="total-section">
      <p>Сумма модификаторов: <strong>{{ totalModifier }}</strong></p>
    </div>
  </div>
</template>

<style scoped>
.modifiers-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.columns-container {
  display: flex;
  gap: 20px;
}

.column {
  flex: 1;
  min-width: 300px;
}

.section {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 14px;
}

.radio-group,
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-option,
.checkbox-option {
  display: flex;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
}

.radio-option input,
.checkbox-option input {
  margin-right: 8px;
}

.total-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #e9f5e9;
  border-radius: 6px;
  text-align: center;
}

.total-section p {
  margin: 0;
  font-size: 16px;
}

.total-section strong {
  font-size: 24px;
  color: #2e7d32;
}

@media (max-width: 768px) {
  .columns-container {
    flex-direction: column;
  }

  .column {
    min-width: auto;
  }
}
</style>
