<template>
  <Toast position="bottom-right" group="br" />
  <DynamicDialog />
  <div v-if="!categories.length">
    <Message size="large" severity="info">Nu a fost găsită nici o categorie, te rog adaugă una!</Message>
    <Button label="Adaugă o categorie" class="no-category-button" variant="outlined" icon="pi pi-plus"
      @click="addNewCategory" />
  </div>
</template>

<script setup>
import DynamicDialog from 'primevue/dynamicdialog';
import { useCategoriesStore } from "../stores/categories.js";
import { storeToRefs } from 'pinia';
import { useDialog } from 'primevue/usedialog';
import { defineAsyncComponent } from 'vue';
import { useToast } from 'primevue/usetoast';
import { randomHexColorGenerator } from '../utils.js';

const toast = useToast();
const categoriesStore = useCategoriesStore();
const { selectedCategory, categories } = storeToRefs(categoriesStore);

const dialog = useDialog();
const CategoryDialog = defineAsyncComponent(() => import('../components/CategoryDialog.vue'));
const addNewCategory = () => {
  selectedCategory.value = { color: randomHexColorGenerator() };
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
        toast.add({ severity: 'success', summary: 'Succes', detail: `Categoria ${selectedCategory.value.name} a fost adăugată cu succes!`, group: 'br', life: 1000 });
      } else {
        toast.add({ severity: 'error', summary: 'Eroare', detail: `Categoria ${selectedCategory.value.name}, nu a putut fi adăugată! `, group: 'br', life: 3000 });
      }

      selectedCategory.value = {};
    }
  });
};
</script>

<style lang="scss">
.no-category-button {
  margin-top: 1rem;
}
</style>
