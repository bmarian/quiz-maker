import { defineStore } from "pinia"
import { v4 as uuidv4 } from 'uuid';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    selectedSubCategory: {},
    selectedCategory: {},
    categories: [],
  }),
  getters: {
  },
  actions: {
    addCategory(category) {
      if (!category || !category.name) return false;

      const color = category.color.startsWith('#') ? category.color : `#${category.color}`;
      this.categories.push({ ...category, key: uuidv4(), color });

      return true;
    },
    editCategory(key, category) {
      if (!key || !category || !category.name) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.key === key);
      if (categoryToModifyIndex === -1) return false;

      const color = category.color.startsWith('#') ? category.color : `#${category.color}`;
      this.categories[categoryToModifyIndex] = { ...this.categories[categoryToModifyIndex], ...category, color };

      return true;
    },
    addSubCategory(parentKey, subCategory) {
      if (!parentKey || !subCategory || !subCategory.name) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.key === parentKey);
      if (categoryToModifyIndex === -1) return false;

      const child = { ...subCategory, key: uuidv4() };
      const children = [...(this.categories[categoryToModifyIndex].children || []), child];
      this.categories[categoryToModifyIndex].children = children;

      return true;
    },
    editSubCategory(parentKey, key, subCategory) {
      if (!parentKey || !key || !subCategory || !subCategory.name) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.key === parentKey);
      if (categoryToModifyIndex === -1) return false;

      const childToModifyIndex = (this.categories[categoryToModifyIndex].children || []).findIndex((child) => child.key === key);
      if (childToModifyIndex === -1) return false;

      this.categories[categoryToModifyIndex].children[childToModifyIndex] = { ...subCategory, key };
      return true;
    },
    deleteCategory(key) {
      if (!key) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.key === key);
      if (categoryToModifyIndex === -1) return false;

      this.categories = this.categories.filter((c) => c.key !== key);
      return true;
    },
    deleteSubCategory(parentKey, key) {
      if (!parentKey || !key) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.key === parentKey);
      if (categoryToModifyIndex === -1) return false;

      const childToModifyIndex = (this.categories[categoryToModifyIndex].children || []).findIndex((child) => child.key === key);
      if (childToModifyIndex === -1) return false;

      this.categories[categoryToModifyIndex].children = this.categories[categoryToModifyIndex].children.filter((child) => child.key !== key);
      return true;
    }
  },
});