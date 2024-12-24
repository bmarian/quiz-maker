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
    async loadCategories() {
      this.categories = [
        {
          "Color": "#B45237",
          "Name": "A.T.I.",
          "Key": "652dbca9-21a3-4f9d-b815-2debc9799555"
        },
        {
          "Color": "#0F877A",
          "Name": "Anatomie topografică și secțională",
          "Key": "a1ce2d30-4777-4e4a-bd07-2f269d4cd5fd"
        },
        {
          "Color": "#FB83B9",
          "Name": "Anatomia omului",
          "Key": "c672771e-a1fe-42b3-a896-3ed0719b9dd1",
          "Children": [
            {
              "Color": "#FB83B9",
              "Name": "Partea de sus",
              "Key": "70784449-28a4-46a0-9e33-b25024dd6072"
            },
            {
              "Color": "#FB83B9",
              "Name": "Partea de jos",
              "Key": "e8b427f2-fd94-446e-8e02-5d0a15f791b5"
            },
            {
              "Color": "#FB83B9",
              "Name": "Partea de stanga",
              "Key": "7fa44e91-6ea0-4f1b-8b2f-d6b913f3e09a"
            }
          ]
        },
        {
          "Color": "#8852C6",
          "Name": "Boli infecțioase tropicale",
          "Key": "10d762fd-c0d0-4051-8e1d-b254f17df0b0"
        },
        {
          "Color": "#3F727A",
          "Name": "Dermatologie",
          "Key": "d6e8447d-d980-4db4-8d04-bee70369d254",
          "Children": [
            {
              "Color": "#3F727A",
              "Name": "Maini",
              "Key": "5a5eb9a9-574c-4c89-97af-f90971111f0d"
            },
            {
              "Color": "#3F727A",
              "Name": "Picioare",
              "Key": "7e86421d-18a3-4c57-bdcc-52c0f7243b89"
            },
            {
              "Color": "#3F727A",
              "Name": "Fata",
              "Key": "96126c0d-a47a-43ac-a052-7d2b6fe42faf"
            }
          ]
        }
      ];
    },
    async saveCategories() {

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