import { browserMocks } from "../utils"
import { defineStore } from "pinia"
import { v4 as uuidv4 } from 'uuid';
import { LoadCategories, SaveCategories } from "../../wailsjs/go/main/App";

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    selectedSubCategory: {},
    selectedCategory: {},
    categories: [],
  }),
  getters: {
  },
  actions: {
    async loadCategories() {
      if (Array.isArray(this.categories) && this.categories.length) return;

      try {
        const savedCategories = await LoadCategories();
        this.categories = savedCategories || [];
      } catch (e) {
        console.error('Unable to retrive backend categories!\n', e);

        if (browserMocks.useMocks) this.categories = browserMocks.categories;
      }
    },
    async saveCategories() {
      try {
        return await SaveCategories(JSON.stringify(this.categories));
      } catch (e) {
        console.error('Unable to send categories to the backend!\n', e);
        return false;
      }
    },
    async addCategory(category) {
      if (!category || !category.Name) return false;

      const Color = category.Color.startsWith('#') ? category.Color : `#${category.Color}`;
      const { shouldDelete, ...categoryToAdd } = category;
      this.categories.push({ ...categoryToAdd, Key: uuidv4(), Color });

      await this.saveCategories();
      return true;
    },
    async editCategory(key, category) {
      if (!key || !category || !category.Name) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.Key === key);
      if (categoryToModifyIndex === -1) return false;

      const Color = category.Color.startsWith('#') ? category.Color : `#${category.Color}`;
      const { shouldDelete, ...categoryToModify } = category;
      this.categories[categoryToModifyIndex] = { ...this.categories[categoryToModifyIndex], ...categoryToModify, Color };

      await this.saveCategories();
      return true;
    },
    async addSubCategory(parentKey, subCategory) {
      if (!parentKey || !subCategory || !subCategory.Name) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.Key === parentKey);
      if (categoryToModifyIndex === -1) return false;

      const { shouldDelete, ...subCategoryToAdd } = subCategory;
      const child = { ...subCategoryToAdd, Key: uuidv4() };
      const children = [...(this.categories[categoryToModifyIndex].Children || []), child];
      this.categories[categoryToModifyIndex].Children = children;

      await this.saveCategories();
      return true;
    },
    async editSubCategory(parentKey, key, subCategory) {
      if (!parentKey || !key || !subCategory || !subCategory.Name) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.Key === parentKey);
      if (categoryToModifyIndex === -1) return false;

      const childToModifyIndex = (this.categories[categoryToModifyIndex].Children || []).findIndex((child) => child.Key === key);
      if (childToModifyIndex === -1) return false;

      const { shouldDelete, ...subCategoryToModify } = subCategory;
      this.categories[categoryToModifyIndex].Children[childToModifyIndex] = { ...subCategoryToModify, Key: key };

      await this.saveCategories();
      return true;
    },
    async deleteCategory(key) {
      if (!key) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.Key === key);
      if (categoryToModifyIndex === -1) return false;

      this.categories = this.categories.filter((c) => c.Key !== key);

      await this.saveCategories();
      return true;
    },
    async deleteSubCategory(parentKey, key) {
      if (!parentKey || !key) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.Key === parentKey);
      if (categoryToModifyIndex === -1) return false;

      const childToModifyIndex = (this.categories[categoryToModifyIndex].Children || []).findIndex((child) => child.Key === key);
      if (childToModifyIndex === -1) return false;

      this.categories[categoryToModifyIndex].Children = this.categories[categoryToModifyIndex].Children.filter((child) => child.Key !== key);

      await this.saveCategories();
      return true;
    }
  },
});