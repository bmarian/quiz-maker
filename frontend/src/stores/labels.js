import { defineStore } from "pinia"
import { v4 as uuidv4 } from 'uuid';

export const useLabelsStore = defineStore('labels', {
  state: () => ({
    selectedLabel: {},
    labels: [],
  }),
  getters: {
  },
  actions: {
    async loadLabels() {
      this.labels = [
        {
          "Color": "#1bf747",
          "Name": "Easy",
          "Key": "4b467f94-143d-45b5-bbfb-d1d7409d0841"
        },
        {
          "Color": "#086CC2",
          "Name": "Medium",
          "Key": "cbd9ab6d-6631-457e-b44f-3ca722e721f6"
        },
        {
          "Color": "#ff0000",
          "Name": "Hard",
          "Key": "e70f99d8-e4fe-4b84-b303-5fe0c1f16dd9"
        }
      ];
    },
    async saveLabels() {
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