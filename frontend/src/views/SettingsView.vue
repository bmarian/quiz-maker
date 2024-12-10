<template>
  <Toast position="bottom-right" group="br" />
  <FloatLabel variant="on" class="form-input">
    <Select v-model="settings.Theme" :options="themes" optionLabel="name" fluid @change="saveSettings" />
    <label for="apiKey">Selectează Tema</label>
  </FloatLabel>

  <FloatLabel variant="on" class="form-input">
    <InputText v-model="settings.ApiKey" id="apiKey" type="text" fluid @change="saveSettings" />
    <label for="apiKey">API Key</label>
  </FloatLabel>
</template>

<script setup>
import { useSettingsStore } from "../stores/settings.js";
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';

const settingsStore = useSettingsStore();
const toast = useToast();
const { settings, themes } = storeToRefs(settingsStore);

const saveSettings = async () => {
  const settingsSaved = await settingsStore.saveSettings();
  if (settingsSaved) {
    toast.add({ severity: 'success', summary: 'Succes', detail: 'Setările au fost salvate cu succes!', group: 'br', life: 3000 });
  } else {
    toast.add({ severity: 'error', summary: 'Eroare', detail: 'Setările nu au putut fi salvate!', group: 'br', life: 3000 });
  }
};
</script>

<style lang="scss">
.form-input {
  margin-bottom: 1rem;
}
</style>
