<template>
  <FloatLabel variant="on" class="form-input">
    <InputText v-model="selectedLabel.Name" id="labelName" type="text" fluid />
    <label for="labelName">Numele etichetei</label>
  </FloatLabel>
  <div class="form-input color-picker">
    <label for="labelColor">Alege culoarea etichetei: </label>
    <ColorPicker v-model="selectedLabel.Color" id="labelColor" fluid />
  </div>
  <div class="label-dialog-footer">
    <Button label="Salvează" variant="outlined" icon="pi pi-check" @click="closeDialog(false)" />
    <Button v-if="selectedLabel.Key" label="Șterge" variant="outlined" icon="pi pi-trash" severity="danger"
      @click="closeDialog(true)" />
  </div>
</template>

<script setup>
import { useLabelsStore } from "../stores/labels.js";
import { storeToRefs } from 'pinia';
import { inject } from "vue";

const labelStore = useLabelsStore();
const { selectedLabel } = storeToRefs(labelStore);

const dialogRef = inject('dialogRef');
const closeDialog = (shouldDelete) => {
  selectedLabel.value.shouldDelete = shouldDelete;
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
}

.label-dialog-footer {
  display: flex;
  flex-direction: row-reverse;
  gap: 1rem;
}
</style>
