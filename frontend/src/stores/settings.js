import { defineStore } from "pinia"
import { LoadSettings, SaveSettings } from "../../wailsjs/go/main/App.js";

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: {},
  }),
  getters: {
    themes() {
      return [
        { name: 'Utilizează tema sistemului', code: 'system' },
        { name: 'Întunecată', code: 'dark' },
        { name: 'Luminosă', code: 'light' }
      ];
    },
    theme() {
      return this.settings?.Theme?.code || 'system';
    }
  },
  actions: {
    async loadSettings() {
      if (this.settings.Theme) return;

      let ApiKey, Theme;
      try {
        const { ApiKey: savedApiKey, Theme: savedTheme } = await LoadSettings() || {};
        ApiKey = savedApiKey;
        Theme = savedTheme;
      } catch (e) {
        console.error('Unable to retrive backend settings!\n', e);
      }

      const theme = this.themes.find((t) => t.code === Theme);
      this.settings.Theme = theme || this.themes[0];

      const systemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if ((this.theme === 'system' && systemDarkMode) || this.theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }


      this.settings.ApiKey = ApiKey || '';

    },
    async saveSettings() {
      const settingsToSave = { ...this.settings, Theme: this.theme };
      let saved = false;
      try {
        saved = await SaveSettings(JSON.stringify(settingsToSave));
      } catch (e) {
        console.error('Unable to send settings to the backend!\n', e);
        return false;
      }

      return saved;
    },
  },
});