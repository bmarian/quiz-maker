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
  <Panel class="main-panel" :header="header">
    <RouterView />
  </Panel>
</template>

<script setup>
import { reactive, computed, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router';
import { useSettingsStore } from "./stores/settings.js"

const settingsStore = useSettingsStore();
const { settings, theme } = storeToRefs(settingsStore);
const route = useRoute();

const routes = [
  { route: '/', label: 'Adaugă o întrebare', icon: 'pi pi-clipboard' },
  { route: '/category', label: 'Manager de categorii', icon: 'pi pi-book' },
  { route: '/label', label: 'Manager de etichete', icon: 'pi pi-tag' },
  { route: '/list', label: 'Lista întrebărilor', icon: 'pi pi-bars' },
  { route: '/settings', label: 'Setări', icon: 'pi pi-cog' },
];
const header = computed(() => {
  const { path } = route;
  const label = routes.find((r) => r.route === path)?.label || '';

  return label;
});

settingsStore.loadSettings();

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
