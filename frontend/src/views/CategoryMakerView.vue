<template>
  <Toast position="bottom-right" group="br" />
  <DynamicDialog />
  <div v-if="!categories.length">
    <Message size="large" severity="info">Nu a fost găsită nici o categorie, te rog adaugă una!</Message>
    <Button label="Adaugă o categorie" class="no-category-button" variant="outlined" icon="pi pi-plus"
      @click="addNewCategory" />
  </div>
  <TreeTable v-else class="categories-table" :value="formattedCategories">
    <Column field="Name" header="Nume" expander expended></Column>
    <Column field="Color" header="Culoare">
      <template #body="{ node }">
        <ColorPicker class="categories-table-color-picker" :modelValue="node.data.Color" disabled fluid />
      </template>
    </Column>
    <Column style="width: 10rem">
      <template #body="{ node }">
        <Button v-if="Array.isArray(node.children)" type="button" icon="pi pi-pencil" variant="outlined"
          severity="success" @click="editCategory(node)" />
        <Button v-if="Array.isArray(node.children)" type="button" icon="pi pi-plus" variant="outlined"
          @click="addSubCategory(node)" />

        <Button v-if="!Array.isArray(node.children)" type="button" icon="pi pi-pencil" variant="outlined"
          severity="success" @click="editSubCategory(node)" />
      </template>
    </Column>
    <template #footer>
      <Button label="Adaugă o categorie nouă" variant="outlined" size="small" icon="pi pi-plus"
        @click="addNewCategory" />
    </template>
  </TreeTable>
</template>

<script setup>
import { defineAsyncComponent, computed } from 'vue';
import DynamicDialog from 'primevue/dynamicdialog';
import { useCategoriesStore } from "../stores/categories.js";
import { storeToRefs } from 'pinia';
import { useDialog } from 'primevue/usedialog';
import { useToast } from 'primevue/usetoast';
import { randomHexColorGenerator } from '../utils.js';

const toast = useToast();
const categoriesStore = useCategoriesStore();
const { selectedCategory, selectedSubCategory, categories } = storeToRefs(categoriesStore);
const formattedCategories = computed(() => {
  if (!Array.isArray(categories.value) || !categories.value.length) return [];
  return categories.value.map((c) => {
    const { Key, Children = [], ...data } = c;
    const formattedChildren = Children.map((child) => {
      const { Key: childKey, ...childData } = child;
      return { key: childKey, parentKey: Key, data: childData };
    });
    return { key: Key, data, children: formattedChildren };
  });
});

const dialog = useDialog();
const CategoryDialog = defineAsyncComponent(() => import('../components/CategoryDialog.vue'));
const SubCategoryDialog = defineAsyncComponent(() => import('../components/SubCategoryDialog.vue'));
const addNewCategory = () => {
  selectedCategory.value = { Color: randomHexColorGenerator() };
  dialog.open(CategoryDialog, {
    props: {
      header: 'Adaugă o categorie',
      style: {
        width: '50vw',
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      modal: true
    },
    onClose() {
      const status = categoriesStore.addCategory(selectedCategory.value);
      if (status) {
        toast.add({ severity: 'success', summary: 'Succes', detail: `Categoria ${selectedCategory.value.Name} a fost adăugată cu succes!`, group: 'br', life: 3000 });
      } else {
        toast.add({ severity: 'error', summary: 'Eroare', detail: `Categoria ${selectedCategory.value.Name}, nu a putut fi adăugată! `, group: 'br', life: 3000 });
      }

      selectedCategory.value = {};
    }
  });
};
const editCategory = (category) => {
  const { key, data } = category;
  selectedCategory.value = { ...data, Key: key };

  dialog.open(CategoryDialog, {
    props: {
      header: `Editează categoria: ${data.Name}`,
      style: {
        width: '50vw',
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      modal: true
    },
    onClose() {
      if (selectedCategory.value.shouldDelete) {
        const status = categoriesStore.deleteCategory(key);
        if (status) {
          toast.add({ severity: 'success', summary: 'Succes', detail: `Categoria ${selectedCategory.value.Name} a fost ștearsă cu succes!`, group: 'br', life: 3000 });
        } else {
          toast.add({ severity: 'error', summary: 'Eroare', detail: `Categoria ${selectedCategory.value.Name}, nu a putut fi ștearsă! `, group: 'br', life: 3000 });
        }
        return;
      }

      const status = categoriesStore.editCategory(key, selectedCategory.value);
      if (status) {
        toast.add({ severity: 'success', summary: 'Succes', detail: `Categoria ${selectedCategory.value.Name} a fost editată cu succes!`, group: 'br', life: 3000 });
      } else {
        toast.add({ severity: 'error', summary: 'Eroare', detail: `Categoria ${selectedCategory.value.Name}, nu a putut fi editată! `, group: 'br', life: 3000 });
      }

      selectedCategory.value = {};
    }
  });
};
const addSubCategory = (category) => {
  const { key: parentKey, data: parentData } = category;
  selectedSubCategory.value = { Color: parentData.Color };

  dialog.open(SubCategoryDialog, {
    props: {
      header: `Adaugă o subcategorie pentru ${parentData.Name}`,
      style: {
        width: '50vw',
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      modal: true
    },
    onClose() {
      const status = categoriesStore.addSubCategory(parentKey, selectedSubCategory.value);
      if (status) {
        toast.add({ severity: 'success', summary: 'Succes', detail: `Subcategoria ${selectedSubCategory.value.Name} a fost adaugată cu succes!`, group: 'br', life: 3000 });
      } else {
        toast.add({ severity: 'error', summary: 'Eroare', detail: `Subcategoria ${selectedSubCategory.value.Name}, nu a putut fi adaugată! `, group: 'br', life: 3000 });
      }

      selectedSubCategory.value = {};
    }
  });
};
const editSubCategory = (subCategory) => {
  const { key, parentKey, data } = subCategory;
  selectedSubCategory.value = { ...data, Key: key };

  dialog.open(SubCategoryDialog, {
    props: {
      header: `Editeaza subcategoria: ${data.Name}`,
      style: {
        width: '50vw',
      },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      modal: true
    },
    onClose() {
      if (selectedSubCategory.value.shouldDelete) {
        const status = categoriesStore.deleteSubCategory(parentKey, key);
        if (status) {
          toast.add({ severity: 'success', summary: 'Succes', detail: `Subcategoria ${selectedSubCategory.value.Name} a fost ștearsă cu succes!`, group: 'br', life: 3000 });
        } else {
          toast.add({ severity: 'error', summary: 'Eroare', detail: `Subcategoria ${selectedSubCategory.value.Name}, nu a putut fi ștearsă! `, group: 'br', life: 3000 });
        }
        return;
      }

      const status = categoriesStore.editSubCategory(parentKey, key, selectedSubCategory.value);
      if (status) {
        toast.add({ severity: 'success', summary: 'Succes', detail: `Subcategoria ${selectedSubCategory.value.Name} a fost editată cu succes!`, group: 'br', life: 3000 });
      } else {
        toast.add({ severity: 'error', summary: 'Eroare', detail: `Subcategoria ${selectedSubCategory.value.Name}, nu a putut fi editată! `, group: 'br', life: 3000 });
      }

      selectedSubCategory.value = {};
    }
  });
};
</script>

<style lang="scss">
.no-category-button {
  margin-top: 1rem;
}

.categories-table {
  height: 100%;

  & .p-treetable-table-container {
    height: calc(100% - 56px);
  }

  & .p-treetable-footer {
    border-bottom: 0;
  }
}

.categories-table-color-picker {
  & .p-disabled {
    opacity: 100%;
  }
}
</style>
