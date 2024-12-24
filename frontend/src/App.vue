<template>
  <Menubar :model="routes">
    <template #item="{ item, props, hasSubmenu }">
      <RouterLink v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
        </a>
      </RouterLink>
    </template>
  </Menubar>
  <Panel class="main-panel">
    <template #header>
      <div><i :class="header.icon"></i> <span>{{ header.label }}</span></div>
    </template>
    <RouterView />
  </Panel>
</template>

<script setup>
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import { useSettingsStore } from "./stores/settings.js"
import { useCategoriesStore } from './stores/categories.js';
import { useLabelsStore } from './stores/labels.js';
import { useQuestionsStore } from './stores/questions.js';

const settingsStore = useSettingsStore();
const categoriesStore = useCategoriesStore();
const labelsStore = useLabelsStore();
const questionsStore = useQuestionsStore();

const { theme } = storeToRefs(settingsStore);
const route = useRoute();

const routes = [
  { route: '/', label: 'Adaugă o întrebare', icon: 'pi pi-clipboard' },
  { route: '/list', label: 'Lista întrebărilor', icon: 'pi pi-bars' },
  { route: '/category', label: 'Manager de categorii', icon: 'pi pi-book' },
  { route: '/label', label: 'Manager de etichete', icon: 'pi pi-tag' },
  { route: '/settings', label: 'Setări', icon: 'pi pi-cog' },
];
const header = computed(() => {
  const { path } = route;
  return routes.find((r) => r.route === path) || {};
});

settingsStore.loadSettings();
categoriesStore.loadCategories();
labelsStore.loadLabels();
questionsStore.loadQuestions();

watch(theme, (newValue) => {
  const systemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if ((newValue === 'system' && systemDarkMode) || newValue === 'dark') {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  const themeValue = theme.value;
  const systemDarkMode = event.matches;

  if (themeValue !== 'system') return;

  if (systemDarkMode) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
});
document.addEventListener('contextmenu', (evt) => {
  evt.preventDefault();
});
</script>

<style lang="scss">
.main-panel {
  margin-top: 0.5rem;
  height: calc(100vh - (52px + 1.6rem));

  overflow: auto;

  & .p-panel-content-container {
    height: calc(100% - 52px);
  }

  & .p-panel-content {
    height: 100%;
  }
}
</style>
