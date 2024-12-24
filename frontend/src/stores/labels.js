import { defineStore } from "pinia"
import { v4 as uuidv4 } from 'uuid';
import { browserMocks } from "../utils";
import { LoadLabels, SaveLabels } from "../../wailsjs/go/main/App";

export const useLabelsStore = defineStore('labels', {
  state: () => ({
    selectedLabel: {},
    labels: [],
  }),
  getters: {
  },
  actions: {
    async loadLabels() {
      if (Array.isArray(this.labels) && this.labels.length) return;
      try {
        const savedLabels = await LoadLabels();
        this.labels = savedLabels || [];
      } catch (e) {
        console.error('Unable to retrive backend labels!\n', e);

        if (browserMocks.useMocks) this.labels = browserMocks.labels;
      }
    },
    async saveLabels() {
      try {
        return await SaveLabels(JSON.stringify(this.labels));
      } catch (e) {
        console.error('Unable to send labels to the backend!\n', e);
        return false;
      }
    },
    async addLabel(label) {
      if (!label || !label.Name) return false;

      const Color = label.Color.startsWith('#') ? label.Color : `#${label.Color}`;
      const { shouldDelete, ...labelToAdd } = label;
      this.labels.push({ ...labelToAdd, Key: uuidv4(), Color });

      await this.saveLabels();
      return true;
    },
    async editLabel(key, label) {
      if (!key || !label || !label.Name) return false;

      const labelToModifyIndex = this.labels.findIndex((c) => c.Key === key);
      if (labelToModifyIndex === -1) return false;

      const Color = label.Color.startsWith('#') ? label.Color : `#${label.Color}`;
      const { shouldDelete, ...labelToModify } = label;
      this.labels[labelToModifyIndex] = { ...this.labels[labelToModifyIndex], ...labelToModify, Color };

      await this.saveLabels();
      return true;
    },
    async deleteLabel(key) {
      if (!key) return false;

      const labelToModifyIndex = this.labels.findIndex((c) => c.Key === key);
      if (labelToModifyIndex === -1) return false;

      this.labels = this.labels.filter((c) => c.Key !== key);

      await this.saveLabels();
      return true;
    }
  },
});