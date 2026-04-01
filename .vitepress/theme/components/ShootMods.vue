<script setup lang="ts">
import { useData } from 'vitepress';
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';

enum ModifierType {
  FIRE_TYPE_SNAP = 'fire_snap',
  FIRE_TYPE_NORMAL = 'fire_normal',
  FIRE_TYPE_AIMED = 'fire_aimed',
  FIRE_TYPE_AUTO = 'fire_auto',

  ADDITIONAL_USHOR = 'additional_ushor',
  ADDITIONAL_RANGE_PENALTY = 'additional_range_penalty',
  ADDITIONAL_STEALTH = 'additional_stealth',
  ADDITIONAL_BACKSTAB = 'additional_backstab',
  ADDITIONAL_FLOOR = 'additional_floor',

  RANGE_ZERO = 'range_zero',
  RANGE_SHORT = 'range_short',
  RANGE_LONG = 'range_long',
  RANGE_EXTREME = 'range_extreme',

  TARGET_SMALL = 'target_small',
  TARGET_NORMAL = 'target_normal',
  TARGET_LARGE = 'target_large',
  TARGET_HUGE = 'target_huge',

  SITUATIONAL_NEG3 = 'situational_neg3',
  SITUATIONAL_NEG2 = 'situational_neg2',
  SITUATIONAL_NEG1 = 'situational_neg1',
  SITUATIONAL_POS1 = 'situational_pos1',
  SITUATIONAL_POS2 = 'situational_pos2',
  SITUATIONAL_POS3 = 'situational_pos3',
}

interface ModifierOption {
  type: ModifierType;
  label: string;
  value: number;
}

const { isDark } = useData();

const fireTypeModifiers: ModifierOption[] = [
  { type: ModifierType.FIRE_TYPE_SNAP, label: 'На вскидку', value: -2 },
  { type: ModifierType.FIRE_TYPE_NORMAL, label: 'Обычный', value: 0 },
  { type: ModifierType.FIRE_TYPE_AIMED, label: 'Прицельный', value: +2 },
  { type: ModifierType.FIRE_TYPE_AUTO, label: 'Автоматический', value: -2 },
];

const additionalModifiers: ModifierOption[] = [
  { type: ModifierType.ADDITIONAL_USHOR, label: 'Упор', value: +1 },
  { type: ModifierType.ADDITIONAL_RANGE_PENALTY, label: 'Превышения дальности оружия', value: -3 },
  { type: ModifierType.ADDITIONAL_STEALTH, label: 'Цель обездвижена/Не знает где стрелок', value: +3 },
  { type: ModifierType.ADDITIONAL_BACKSTAB, label: 'Исподтишка', value: +2 },
  { type: ModifierType.ADDITIONAL_FLOOR, label: 'Цель лежит на полу', value: -1 },
];

const rangeModifiers: ModifierOption[] = [
  { type: ModifierType.RANGE_ZERO, label: 'Нулевая', value: -3 },
  { type: ModifierType.RANGE_SHORT, label: 'Ближняя', value: 0 },
  { type: ModifierType.RANGE_LONG, label: 'Дальняя', value: -1 },
  { type: ModifierType.RANGE_EXTREME, label: 'Предельная', value: -2 },
];

const targetSizeModifiers: ModifierOption[] = [
  { type: ModifierType.TARGET_SMALL, label: 'Меньше человека', value: -1 },
  { type: ModifierType.TARGET_NORMAL, label: 'Обычная', value: 0 },
  { type: ModifierType.TARGET_LARGE, label: 'Крупная', value: +1 },
  { type: ModifierType.TARGET_HUGE, label: 'Гигантская', value: +2 },
];

const situationalModifiers: ModifierOption[] = [
  { type: ModifierType.SITUATIONAL_NEG3, label: '', value: -3 },
  { type: ModifierType.SITUATIONAL_NEG2, label: '', value: -2 },
  { type: ModifierType.SITUATIONAL_NEG1, label: '', value: -1 },
  { type: ModifierType.SITUATIONAL_POS1, label: '', value: +1 },
  { type: ModifierType.SITUATIONAL_POS2, label: '', value: +2 },
  { type: ModifierType.SITUATIONAL_POS3, label: '', value: +3 },
];

const fireType = ref<ModifierType | null>(ModifierType.FIRE_TYPE_NORMAL);
const additionalSelection = ref<ModifierType[]>([]);
const rangeType = ref<ModifierType | null>(ModifierType.RANGE_SHORT);
const targetSizeType = ref<ModifierType | null>(ModifierType.TARGET_NORMAL);
const situationalSelection = ref<ModifierType[]>([]);

const showWangingRangePenalties = computed(() => {
  return additionalSelection.value.includes(ModifierType.ADDITIONAL_STEALTH);
});

const totalModifier = computed(() => {
  let sum = 0;

  if (fireType.value !== null) {
    const modifier = fireTypeModifiers.find(m => m.type === fireType.value);
    sum += modifier ? modifier.value : 0;
  }

  sum += additionalSelection.value.reduce((acc, type) => {
    const modifier = additionalModifiers.find(m => m.type === type);
    return acc + (modifier ? modifier.value : 0);
  }, 0);

  if (rangeType.value !== null) {
    const modifier = rangeModifiers.find(m => m.type === rangeType.value);
    sum += modifier ? modifier.value : 0;
  }

  if (targetSizeType.value !== null) {
    const modifier = targetSizeModifiers.find(m => m.type === targetSizeType.value);
    sum += modifier ? modifier.value : 0;
  }

  sum += situationalSelection.value.reduce((acc, type) => {
    const modifier = situationalModifiers.find(m => m.type === type);
    return acc + (modifier ? modifier.value : 0);
  }, 0);

  return sum;
});

function handleAdditionalToggle(type: ModifierType, isChecked: boolean) {
  if (isChecked) {
    if (!additionalSelection.value.includes(type)) {
      additionalSelection.value.push(type);
    }
  } else {
    additionalSelection.value = additionalSelection.value.filter(t => t !== type);
  }
}

function handleSituationalToggle(type: ModifierType, isChecked: boolean) {
  if (isChecked) {
    if (!situationalSelection.value.includes(type)) {
      situationalSelection.value.push(type);
    }
  } else {
    situationalSelection.value = situationalSelection.value.filter(t => t !== type);
  }
}

function isAdditionalOptionDisabled(type: ModifierType): boolean {
  if (type === ModifierType.ADDITIONAL_USHOR && fireType.value === ModifierType.FIRE_TYPE_SNAP) {
    return true;
  }

  if (type === ModifierType.ADDITIONAL_STEALTH && rangeType.value !== ModifierType.RANGE_ZERO) {
    return true;
  }

  if (type === ModifierType.ADDITIONAL_RANGE_PENALTY && (rangeType.value === ModifierType.RANGE_ZERO || rangeType.value === ModifierType.RANGE_SHORT)) {
    return true;
  }

  return false;
}

function getModifierColorClass(value: number): string {
  if (value < 0) return 'negative';
  if (value > 0) return 'positive';
  return 'neutral';
}

function getModifierText(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}

watch(fireType, (nv) => {
  if (nv === ModifierType.FIRE_TYPE_SNAP) {
    additionalSelection.value = additionalSelection.value.filter(t => t !== ModifierType.ADDITIONAL_USHOR);
  }
})

watch(rangeType, (nv) => {
  if (nv === ModifierType.RANGE_ZERO || nv === ModifierType.RANGE_SHORT) {
    additionalSelection.value = additionalSelection.value.filter(t => t !== ModifierType.ADDITIONAL_RANGE_PENALTY);
  }
  if (nv === ModifierType.RANGE_SHORT) {
    additionalSelection.value = additionalSelection.value.filter(t => t !== ModifierType.ADDITIONAL_STEALTH);
  }
})
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
              :key="option.type"
              class="radio-option"
            >
              <input
                type="radio"
                :value="option.type"
                v-model="fireType"
                name="fireType"
              />
              {{ option.label }} (
                <span :class="getModifierColorClass(option.value)">
                  {{ getModifierText(option.value) }}
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
              :key="option.type"
              class="checkbox-option"
              :class="{ 'disabled': isAdditionalOptionDisabled(option.type) }"
            >
              <input
                type="checkbox"
                :value="option.type"
                :checked="additionalSelection.some((item) => item === option.type)"
                :disabled="isAdditionalOptionDisabled(option.type)"
                @change="handleAdditionalToggle(option.type, ($event.target as HTMLInputElement).checked)"
              />
              {{ option.label }} (
                <span :class="getModifierColorClass(option.value)">
                  {{ getModifierText(option.value) }}
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
              :key="option.type"
              class="radio-option"
            >
              <input
                type="radio"
                :value="option.type"
                v-model="rangeType"
                name="range"
              />
              {{ option.label }} (
                <span :class="getModifierColorClass(option.value)">
                  {{ getModifierText(option.value) }}
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
              :key="option.type"
              class="radio-option"
            >
              <input
                type="radio"
                :value="option.type"
                v-model="targetSizeType"
                name="targetSize"
              />
              {{ option.label }} (
                <span :class="getModifierColorClass(option.value)">
                  {{ getModifierText(option.value) }}
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
                v-for="option in situationalModifiers.slice(0, situationalModifiers.length / 2)"
                :key="option.type"
                class="checkbox-option"
              >
                <input
                  type="checkbox"
                  :value="option.type"
                  @change="handleSituationalToggle(option.type, ($event.target as HTMLInputElement).checked)"
                />
                {{ option.label }} (
                  <span :class="getModifierColorClass(option.value)">
                    {{ getModifierText(option.value) }}
                  </span>
                )
              </label>
            </div>
            <div class="situational-subcolumn">
              <label
                v-for="option in situationalModifiers.slice(situationalModifiers.length / 2)"
                :key="option.type"
                class="checkbox-option"
              >
                <input
                  type="checkbox"
                  :value="option.type"
                  @change="handleSituationalToggle(option.type, ($event.target as HTMLInputElement).checked)"
                />
                {{ option.label }} (
                  <span :class="getModifierColorClass(option.value)">
                    {{ getModifierText(option.value) }}
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
          {{ getModifierText(totalModifier) }}
        </strong>
      </p>
      <p v-if="showWangingRangePenalties" class="note" :class="{ 'dark': isDark }">
        <small>Внимание: штраф за нулевую дальность игнорируется из-за выбора "Цель обездвижена/Не знает где стрелок"</small>
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

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.note {
  margin-top: 5px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.dark .note {
  color: var(--vp-c-text-2);
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
