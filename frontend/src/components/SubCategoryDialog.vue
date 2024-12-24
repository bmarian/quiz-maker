<template>
  <FloatLabel variant="on" class="form-input">
    <InputText v-model="selectedSubCategory.Name" id="categoryName" type="text" fluid />
    <label for="categoryName">Numele subcategoriei</label>
  </FloatLabel>
  <div class="form-input color-picker">
    <label for="categoryColor">Culoarea subcategoriei: </label>
    <ColorPicker :modelValue="selectedSubCategory.Color" id="categoryColor" disabled fluid />
  </div>
  <div class="category-dialog-footer">
    <Button label="Salvează" class="no-category-button" variant="outlined" icon="pi pi-check"
      @click="closeDialog(false)" />
    <Button v-if="selectedSubCategory.Key" label="Șterge" class="no-category-button" variant="outlined"
      icon="pi pi-trash" severity="danger" @click="closeDialog(true)" />
  </div>
</template>

<script setup>
import { useCategoriesStore } from "../stores/categories.js";
import { storeToRefs } from 'pinia';
import { inject } from "vue";

const categoriesStore = useCategoriesStore();
const { selectedSubCategory } = storeToRefs(categoriesStore);

const dialogRef = inject('dialogRef');
const closeDialog = (shouldDelete) => {
  selectedSubCategory.value.shouldDelete = shouldDelete;
  dialogRef.value.close();
}
</script>

<style lang="scss">
.form-input {
  margin-bottom: 1rem;

  &:first-child {
    margin-top: 0.5rem;
  }
}

.color-picker {
  margin-left: 0.3rem;
  margin-bottom: 0.3rem;

  & .p-disabled {
    opacity: 100%;
  }
}

.category-dialog-footer {
  display: flex;
  flex-direction: row-reverse;
  gap: 1rem;
}
</style>
