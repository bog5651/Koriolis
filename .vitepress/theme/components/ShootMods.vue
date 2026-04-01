<script setup lang="ts">
import { useData } from 'vitepress';
import { computed, ref, onMounted, onUnmounted } from 'vue';

interface ModifierOption {
  id: number;
  label: string;
  value: number;
}

const { isDark } = useData();

const fireTypeModifiers: ModifierOption[] = [
  { id: 1, label: 'На вскидку', value: -2 },
  { id: 2, label: 'Обычный', value: 0 },
  { id: 3, label: 'Прицельный', value: +2 },
  { id: 4, label: 'Автоматический', value: -2 },
];

const additionalModifiers: ModifierOption[] = [
  { id: 1, label: 'Упор', value: +1 },
  { id: 2, label: 'Штраф превышения дальности', value: -3 },
  { id: 3, label: 'Скрытность/Цель обездвижена', value: +3 },
  { id: 4, label: 'Исподтишка', value: +2 },
  { id: 5, label: 'Лежит на полу', value: -1 },
];

const rangeModifiers: ModifierOption[] = [
  { id: 1, label: 'Нулевая', value: -3 },
  { id: 2, label: 'Ближняя', value: 0 },
  { id: 3, label: 'Дальняя', value: -1 },
  { id: 4, label: 'Предельная', value: -2 },
];

const targetSizeModifiers: ModifierOption[] = [
  { id: 1, label: 'Меньше человека', value: -1 },
  { id: 2, label: 'Обычная', value: 0 },
  { id: 3, label: 'Крупная', value: +1 },
  { id: 4, label: 'Гигантская', value: +2 },
];

const situationalModifiers: ModifierOption[] = [
  { id: 1, label: '', value: -3 },
  { id: 2, label: '', value: -2 },
  { id: 3, label: '', value: -1 },
  { id: 4, label: '', value: +1 },
  { id: 5, label: '', value: +2 },
  { id: 6, label: '', value: +3 },
];

const fireTypeId = ref<number | null>(2);
const additionalSelection = ref<number[]>([]);
const rangeId = ref<number | null>(2);
const targetSizeId = ref<number | null>(2);
const situationalSelection = ref<number[]>([]);

const totalModifier = computed(() => {
  let sum = 0;

  if (fireTypeId.value !== null) {
    const modifier = fireTypeModifiers.find(m => m.id === fireTypeId.value);
    sum += modifier ? modifier.value : 0;
  }

  sum += additionalSelection.value.reduce((acc, id) => {
    const modifier = additionalModifiers.find(m => m.id === id);
    return acc + (modifier ? modifier.value : 0);
  }, 0);

  if (rangeId.value !== null) {
    const modifier = rangeModifiers.find(m => m.id === rangeId.value);
    sum += modifier ? modifier.value : 0;
  }

  if (targetSizeId.value !== null) {
    const modifier = targetSizeModifiers.find(m => m.id === targetSizeId.value);
    sum += modifier ? modifier.value : 0;
  }

  sum += situationalSelection.value.reduce((acc, id) => {
    const modifier = situationalModifiers.find(m => m.id === id);
    return acc + (modifier ? modifier.value : 0);
  }, 0);

  return sum;
});

function handleAdditionalToggle(id: number, isChecked: boolean) {
  if (isChecked) {
    if (!additionalSelection.value.includes(id)) {
      additionalSelection.value.push(id);
    }
  } else {
    additionalSelection.value = additionalSelection.value.filter(i => i !== id);
  }
}

function handleSituationalToggle(id: number, isChecked: boolean) {
  if (isChecked) {
    if (!situationalSelection.value.includes(id)) {
      situationalSelection.value.push(id);
    }
  } else {
    situationalSelection.value = situationalSelection.value.filter(i => i !== id);
  }
}

// Функция для определения класса цвета по значению модификатора
function getModifierColorClass(value: number): string {
  if (value < 0) return 'negative';
  if (value > 0) return 'positive';
  return 'neutral';
}
</script>

<template>
  <div class="modifiers-container" :class="{ 'dark': isDark }">
    <div class="columns-container">
      <div class="column left-column">
        <div class="section" :class="{ 'dark': isDark }">
          <h4>Тип выстрела</h4>
          <div class="radio-group">
            <label
              v-for="option in fireTypeModifiers"
              :key="option.id"
              class="radio-option"
            >
              <input
                type="radio"
                :value="option.id"
                v-model="fireTypeId"
                name="fireType"
              />
              {{ option.label }} (
                <span :class="getModifierColorClass(option.value)">
                  {{ option.value > 0 ? '+' : '' }}{{ option.value }}
                </span>
              )
            </label>
          </div>
        </div>

        <div class="section" :class="{ 'dark': isDark }">
          <h4>Дополнительные</h4>
          <div class="checkbox-group">
            <label
              v-for="option in additionalModifiers"
              :key="option.id"
              class="checkbox-option"
            >
              <input
                type="checkbox"
                :value="option.id"
                @change="handleAdditionalToggle(option.id, ($event.target as HTMLInputElement).checked)"
              />
              {{ option.label }} (
                <span :class="getModifierColorClass(option.value)">
                  {{ option.value > 0 ? '+' : '' }}{{ option.value }}
                </span>
              )
            </label>
          </div>
        </div>
      </div>

      <div class="column right-column">
        <div class="section" :class="{ 'dark': isDark }">
          <h4>Дальность</h4>
          <div class="radio-group">
            <label
              v-for="option in rangeModifiers"
              :key="option.id"
              class="radio-option"
            >
              <input
                type="radio"
                :value="option.id"
                v-model="rangeId"
                name="range"
              />
              {{ option.label }} (
                <span :class="getModifierColorClass(option.value)">
                  {{ option.value > 0 ? '+' : '' }}{{ option.value }}
                </span>
              )
            </label>
          </div>
        </div>

        <div class="section" :class="{ 'dark': isDark }">
          <h4>Размер цели</h4>
          <div class="radio-group">
            <label
              v-for="option in targetSizeModifiers"
              :key="option.id"
              class="radio-option"
            >
              <input
                type="radio"
                :value="option.id"
                v-model="targetSizeId"
                name="targetSize"
              />
              {{ option.label }} (
                <span :class="getModifierColorClass(option.value)">
                  {{ option.value > 0 ? '+' : '' }}{{ option.value }}
                </span>
              )
            </label>
          </div>
        </div>

        <div class="section" :class="{ 'dark': isDark }">
          <h4>Ситуативные</h4>
          <div class="situational-container">
            <div class="situational-subcolumn">
              <label
                v-for="option in situationalModifiers.slice(0, 3)"
                :key="option.id"
                class="checkbox-option"
              >
                <input
                  type="checkbox"
                  :value="option.id"
                  @change="handleSituationalToggle(option.id, ($event.target as HTMLInputElement).checked)"
                />
                {{ option.label }} (
                  <span :class="getModifierColorClass(option.value)">
                    {{ option.value > 0 ? '+' : '' }}{{ option.value }}
                  </span>
                )
              </label>
            </div>
            <div class="situational-subcolumn">
              <label
                v-for="option in situationalModifiers.slice(3)"
                :key="option.id"
                class="checkbox-option"
              >
                <input
                  type="checkbox"
                  :value="option.id"
                  @change="handleSituationalToggle(option.id, ($event.target as HTMLInputElement).checked)"
                />
                {{ option.label }} (
                  <span :class="getModifierColorClass(option.value)">
                    {{ option.value > 0 ? '+' : '' }}{{ option.value }}
                  </span>
                )
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="total-section" :class="{ 'dark': isDark }">
      <p>Сумма модификаторов:
        <strong :class="getModifierColorClass(totalModifier)">
          {{ totalModifier > 0 ? '+' : '' }}{{ totalModifier }}
        </strong>
      </p>
    </div>
  </div>
</template>

<style scoped>
.modifiers-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: var(--vp-c-text-1);
}

.dark .modifiers-container {
  background-color: var(--vp-c-bg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
  background-color: var(--vp-c-bg-soft);
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: var(--vp-c-text-1);
}

.dark .section {
  background-color: var(--vp-c-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

h4 {
  margin: 0 0 10px 0;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 600;
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
  color: var(--vp-c-text-2);
}

.dark .radio-option,
.dark .checkbox-option {
  color: var(--vp-c-text-2);
}

.radio-option input,
.checkbox-option input {
  margin-right: 8px;
  accent-color: var(--vp-c-indigo-1);
}

.negative {
  color: var(--vp-c-red-1);
  font-weight: bold;
}

.neutral {
  color: var(--vp-c-text-2);
}

.positive {
  color: var(--vp-c-green-1);
  font-weight: bold;
}

.situational-container {
  display: flex;
  gap: 15px;
}

.situational-subcolumn {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.total-section {
  margin-top: 20px;
  padding: 15px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 6px;
  text-align: center;
  border: 1px solid var(--vp-c-border);
}

.dark .total-section {
  background-color: var(--vp-c-bg);
}

.total-section p {
  margin: 0;
  font-size: 16px;
}

.total-section strong {
  font-size: 24px;
}

@media (max-width: 768px) {
  .columns-container {
    flex-direction: column;
  }

  .column {
    min-width: auto;
  }

  .situational-container {
    flex-direction: column;
  }
}
</style>
