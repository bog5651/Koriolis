<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

const EARTH_HOURS_IN_DAY = 24;

const hoursInPlanetDay = ref(20);
const earthTimeHours = ref(12);
const earthTimeMinutes = ref(0);
const selectedConversion = ref<'earthToPlanet' | 'planetToEarth'>('earthToPlanet');
const planetTimeHours = ref(0);
const planetTimeMinutes = ref(0);

const orbitAngle = ref(0);
const orbitAnimationId = ref<number | null>(null);

const convertedTime = computed(() => {
  const earthTotalMinutes = earthTimeHours.value * 60 + earthTimeMinutes.value;

  if (selectedConversion.value === 'earthToPlanet') {
    const planetTotalMinutes = (earthTotalMinutes * hoursInPlanetDay.value) / EARTH_HOURS_IN_DAY;
    planetTimeHours.value = Math.floor(planetTotalMinutes / 60);
    planetTimeMinutes.value = Math.floor(planetTotalMinutes % 60);
    return { hours: planetTimeHours.value, minutes: planetTimeMinutes.value };
  } else {
    const earthTotalMinutes_ = (earthTotalMinutes * EARTH_HOURS_IN_DAY) / hoursInPlanetDay.value;
    planetTimeHours.value = Math.floor(earthTotalMinutes_ / 60);
    planetTimeMinutes.value = Math.floor(earthTotalMinutes_ % 60);
    return { hours: planetTimeHours.value, minutes: planetTimeMinutes.value };
  }
});

const twilightTimes = computed(() => {
  const sunrise = 6;
  const sunset = 18;

  const planetSunrise = (sunrise / EARTH_HOURS_IN_DAY) * hoursInPlanetDay.value;
  const planetSunset = (sunset / EARTH_HOURS_IN_DAY) * hoursInPlanetDay.value;
  const almostNight = planetSunset + 2;
  const midday = (hoursInPlanetDay.value / 2);

  return {
    planetMidday: formatMinutesTime(midday * 60),
    planetSunrise: formatMinutesTime(planetSunrise * 60),
    planetSunset: formatMinutesTime(planetSunset * 60),
    planetAlmostNight: formatMinutesTime(almostNight * 60)
  };
});

const startOrbitAnimation = () => {
  const updateOrbit = () => {
    orbitAngle.value = (orbitAngle.value + 0.5) % 360;
    orbitAnimationId.value = requestAnimationFrame(updateOrbit);
  };
  updateOrbit();
};

onMounted(() => {
  startOrbitAnimation();
});

onBeforeUnmount(() => {
  if (orbitAnimationId.value) {
    cancelAnimationFrame(orbitAnimationId.value);
  }
});

watch(selectedConversion, () => {
  earthTimeHours.value = Math.trunc(hoursInPlanetDay.value / 2);
})

watch(hoursInPlanetDay, () => {
  earthTimeHours.value = Math.trunc(hoursInPlanetDay.value / 2);
})

const formatTime = (hours: number, minutes: number) => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const formatMinutesTime = (totalMinutes: number) =>  {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
</script>

<template>
  <div class="planet-times-container">
    <div class="main-content">
      <div class="input-section">
        <div class="column">
          <h3>Конфигурация</h3>
          <div class="form-group">
            <label for="hoursInPlanetDay">Часов в сутках планеты:</label>
            <input
              id="hoursInPlanetDay"
              type="number"
              v-model="hoursInPlanetDay"
              min="1"
              max="100"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Преобразование:</label>
            <div class="radio-group">
              <label>
                <input
                  type="radio"
                  v-model="selectedConversion"
                  value="earthToPlanet"
                />
                Земное → Планетарное
              </label>
              <label>
                <input
                  type="radio"
                  v-model="selectedConversion"
                  value="planetToEarth"
                />
                Планетарное → Земное
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="earthTime">Время:</label>
            <div class="time-input">
              <input
                id="earthTime"
                type="number"
                v-model="earthTimeHours"
                min="0"
                :max="selectedConversion === 'earthToPlanet'? 23 : hoursInPlanetDay - 1"
                class="time-hour"
              />
              <span>:</span>
              <input
                type="number"
                v-model="earthTimeMinutes"
                min="0"
                max="59"
                class="time-minute"
              />
            </div>
          </div>
        </div>

        <div class="column">
          <h3>Результат</h3>
          <div class="result-box">
            <p>Время на планете: <strong>{{ formatTime(convertedTime.hours, convertedTime.minutes) }}</strong></p>
          </div>
        </div>
      </div>

      <div class="timings-section">
        <div class="column">
          <h3>Время астрономических событий</h3>
          <div class="timings-grid">
            <div class="timing-item">
              <span>Восход:</span>
              <strong>{{ twilightTimes.planetSunrise }}</strong>
            </div>
            <div class="timing-item">
              <span>Полдень:</span>
              <strong>{{ twilightTimes.planetMidday }}</strong>
            </div>
            <div class="timing-item">
              <span>Закат:</span>
              <strong>{{ twilightTimes.planetSunset }}</strong>
            </div>
            <div class="timing-item">
              <span>Почти темнота:</span>
              <strong>{{ twilightTimes.planetAlmostNight }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="orbit-visual">
      <div class="orbit-container">
        <div class="orbit">
          <div class="orbit-inner">
            <div class="orbit-path"></div>
            <div class="sun"></div>
            <div
              class="planet"
              :style="{ transform: `rotate(${orbitAngle}deg) translate(128px)` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.planet-times-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  color: white;
  max-width: 900px;
  margin: 0 auto;
}

.main-content {
  margin-bottom: 2rem;
}

.column {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #4a9eff;
  background: rgba(255, 255, 255, 0.1);
}

.time-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-hour, .time-minute {
  width: 60px;
  padding: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  text-align: center;
  font-size: 1rem;
}

.time-hour:focus, .time-minute:focus {
  outline: none;
  border-color: #4a9eff;
  background: rgba(255, 255, 255, 0.1);
}

.radio-group {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio-group input[type="radio"] {
  accent-color: #4a9eff;
}

.result-box {
  background: rgba(74, 158, 255, 0.2);
  border: 1px solid rgba(74, 158, 255, 0.4);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  margin-top: 1rem;
}

.result-box p {
  margin: 0;
  font-size: 1.25rem;
}

.timings-section {
  margin-top: 1rem;
}

.timings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.timing-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.timing-item span {
  color: #a0a0b0;
}

.orbit-visual {
  text-align: center;
}

.orbit-label {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #4a9eff;
}

.orbit-container {
  position: relative;
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.orbit {
  position: relative;
  width: 260px;
  height: 260px;
}

.orbit-inner {
  position: relative;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.orbit-path {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  border: 2px dashed rgba(74, 158, 255, 0.3);
}

.planet {
  position: absolute;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #4a9eff 0%, #0056b3 100%);
  border-radius: 50%;
  box-shadow: 0 0 8px #4a9eff;
}


.sun {
  position: absolute;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle at 30% 30%, #ffd700, #ff8c00, #ff4500);
  border-radius: 50%;
  box-shadow:
    0 0 20px #ffd700,
    0 0 40px #ff8c00,
    0 0 60px #ff4500,
    0 0 80px #ff8c00;
  animation: sunPulse 4s ease-in-out infinite alternate;
  z-index: 10;
}

@keyframes sunPulse {
  0% {
    transform: scale(1);
    box-shadow:
      0 0 20px #ffd700,
      0 0 40px #ff8c00,
      0 0 60px #ff4500,
      0 0 80px #ff8c00;
  }
  100% {
    transform: scale(1.15);
    box-shadow:
      0 0 30px #ffd700,
      0 0 60px #ff8c00,
      0 0 90px #ff4500,
      0 0 120px #ff8c00,
      0 0 140px rgba(255, 165, 0, 0.8);
  }
}

.sun::before {
  content: '';
  position: absolute;
  top: -20%;
  left: -20%;
  right: -20%;
  bottom: -20%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%);
  animation: sunGlow 6s linear infinite;
}

@keyframes sunGlow {
  0% {
    transform: rotate(0deg);
    opacity: 0.8;
  }
  100% {
    transform: rotate(360deg);
    opacity: 0.4;
  }
}

.sun::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,200,0.3), transparent 70%);
  border-radius: 50%;
  animation: sunRipple 3s ease-out infinite;
}

@keyframes sunRipple {
  0% {
    transform: scale(0.5);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

</style>
