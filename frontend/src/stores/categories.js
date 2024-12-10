import { defineStore } from "pinia"
import { v4 as uuidv4 } from 'uuid';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    selectedCategory: {},
    categories: [],
  }),
  getters: {
  },
  actions: {
    addCategory(category) {
      if (!category || !category.name) return false;
      this.categories.push({ key: uuidv4(), ...category });

      return true;
    },
  },
});