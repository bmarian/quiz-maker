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
      if (!category || !category.Name) return false;

      const Color = category.Color.startsWith('#') ? category.Color : `#${category.Color}`;
      const { shouldDelete, ...categoryToAdd } = category;
      this.categories.push({ ...categoryToAdd, Key: uuidv4(), Color });

      return true;
    },
    editCategory(key, category) {
      if (!key || !category || !category.Name) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.Key === key);
      if (categoryToModifyIndex === -1) return false;

      const Color = category.Color.startsWith('#') ? category.Color : `#${category.Color}`;
      const { shouldDelete, ...categoryToModify } = category;
      this.categories[categoryToModifyIndex] = { ...this.categories[categoryToModifyIndex], ...categoryToModify, Color };

      return true;
    },
    addSubCategory(parentKey, subCategory) {
      if (!parentKey || !subCategory || !subCategory.Name) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.Key === parentKey);
      if (categoryToModifyIndex === -1) return false;

      const { shouldDelete, ...subCategoryToAdd } = subCategory;
      const child = { ...subCategoryToAdd, Key: uuidv4() };
      const children = [...(this.categories[categoryToModifyIndex].Children || []), child];
      this.categories[categoryToModifyIndex].Children = children;

      return true;
    },
    editSubCategory(parentKey, key, subCategory) {
      if (!parentKey || !key || !subCategory || !subCategory.Name) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.Key === parentKey);
      if (categoryToModifyIndex === -1) return false;

      const childToModifyIndex = (this.categories[categoryToModifyIndex].Children || []).findIndex((child) => child.Key === key);
      if (childToModifyIndex === -1) return false;

      const { shouldDelete, ...subCategoryToModify } = subCategory;
      this.categories[categoryToModifyIndex].Children[childToModifyIndex] = { ...subCategoryToModify, Key: key };
      return true;
    },
    deleteCategory(key) {
      if (!key) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.Key === key);
      if (categoryToModifyIndex === -1) return false;

      this.categories = this.categories.filter((c) => c.Key !== key);
      return true;
    },
    deleteSubCategory(parentKey, key) {
      if (!parentKey || !key) return false;

      const categoryToModifyIndex = this.categories.findIndex((c) => c.Key === parentKey);
      if (categoryToModifyIndex === -1) return false;

      const childToModifyIndex = (this.categories[categoryToModifyIndex].Children || []).findIndex((child) => child.Key === key);
      if (childToModifyIndex === -1) return false;

      this.categories[categoryToModifyIndex].Children = this.categories[categoryToModifyIndex].Children.filter((child) => child.Key !== key);
      return true;
    }
  },
});