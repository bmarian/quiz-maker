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

  <Button label="Deschide fișierul de configurare" variant="outlined" size="small" icon="pi pi-folder"
    @click="openConfigFolder" />
</template>

<script setup>
import { useSettingsStore } from "../stores/settings.js";
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { OpenConfigFolder } from "../../wailsjs/go/main/App.js";


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
const openConfigFolder = async () => {
  let status = false;

  try {
    status = await OpenConfigFolder();
  } catch (e) {
    console.error('Unable to open config file!\n', e);
  }

  if (!status) toast.add({ severity: 'error', summary: 'Eroare', detail: 'Fișierul de configurare nu a putut fi deschis!', group: 'br', life: 3000 });
};
</script>

<style lang="scss">
.form-input {
  margin-bottom: 1rem;
}
</style>
