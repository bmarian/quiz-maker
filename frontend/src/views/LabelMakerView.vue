<template>
  <Toast position="bottom-right" group="br" />
  <DynamicDialog />
  <div v-if="!labels.length">
    <Message size="large" severity="info">Nu a fost găsită nici o etichetă, te rog adaugă una!</Message>
    <Button label="Adaugă o etichetă" class="no-label-button" variant="outlined" icon="pi pi-plus" @click="addLabel" />
  </div>
  <TreeTable v-else class="labels-table" :value="formattedLabels">
    <Column field="Name" header="Nume" expander expended></Column>
    <Column field="Color" header="Culoare">
      <template #body="{ node }">
        <ColorPicker class="labels-table-color-picker" :modelValue="node.data.Color" disabled fluid />
      </template>
    </Column>
    <Column style="width: 10rem">
      <template #body="{ node }">
        <Button type="button" icon="pi pi-pencil" variant="outlined" severity="success" @click="editCategory(node)" />
      </template>
    </Column>
    <template #footer>
      <Button label="Adaugă o etichetă nouă" variant="outlined" icon="pi pi-plus" @click="addLabel" />
    </template>
  </TreeTable>
</template>

<script setup>
import { defineAsyncComponent, computed } from 'vue';
import DynamicDialog from 'primevue/dynamicdialog';
import { useLabelsStore } from "../stores/labels.js";
import { storeToRefs } from 'pinia';
import { useDialog } from 'primevue/usedialog';
import { useToast } from 'primevue/usetoast';
import { randomHexColorGenerator } from '../utils.js';

const toast = useToast();
const labelStore = useLabelsStore();
const { labels, selectedLabel } = storeToRefs(labelStore);
const formattedLabels = computed(() => {
  return labels.value.map(({ Key, ...data }) => ({ key: Key, data }));
});

const dialog = useDialog();
const LabelDialog = defineAsyncComponent(() => import('../components/LabelDialog.vue'));
const addLabel = () => {
  selectedLabel.value = { Color: randomHexColorGenerator() };
  dialog.open(LabelDialog, {
    props: {
      header: 'Adaugă o etichetă',
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
      const status = labelStore.addLabel(selectedLabel.value);
      if (status) {
        toast.add({ severity: 'success', summary: 'Succes', detail: `Eticheta ${selectedLabel.value.Name} a fost adăugată cu succes!`, group: 'br', life: 3000 });
      } else {
        toast.add({ severity: 'error', summary: 'Eroare', detail: `Eticheta ${selectedLabel.value.Name}, nu a putut fi adăugată! `, group: 'br', life: 3000 });
      }

      selectedLabel.value = {};
    }
  });
};
const editCategory = (label) => {
  const { key, data } = label;
  selectedLabel.value = { ...data, Key: key };

  dialog.open(LabelDialog, {
    props: {
      header: `Editează eticheta: ${data.Name}`,
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
      if (selectedLabel.value.shouldDelete) {
        const status = labelStore.deleteLabel(key);
        if (status) {
          toast.add({ severity: 'success', summary: 'Succes', detail: `Eticheta ${selectedLabel.value.Name} a fost ștearsă cu succes!`, group: 'br', life: 3000 });
        } else {
          toast.add({ severity: 'error', summary: 'Eroare', detail: `Eticheta ${selectedLabel.value.Name}, nu a putut fi ștearsă! `, group: 'br', life: 3000 });
        }

        selectedLabel.value = {};
        return;
      }

      const status = labelStore.editLabel(key, selectedLabel.value);
      if (status) {
        toast.add({ severity: 'success', summary: 'Succes', detail: `Categoria ${selectedLabel.value.Name} a fost editată cu succes!`, group: 'br', life: 3000 });
      } else {
        toast.add({ severity: 'error', summary: 'Eroare', detail: `Categoria ${selectedLabel.value.Name}, nu a putut fi editată! `, group: 'br', life: 3000 });
      }

      selectedLabel.value = {};
    }
  });
};
</script>

<style>
.no-label-button {
  margin-top: 1rem;
}

.labels-table {
  height: 100%;

  & .p-treetable-table-container {
    height: calc(100% - 56px);
  }

  & .p-treetable-footer {
    border-bottom: 0;
  }
}

.labels-table-color-picker {
  & .p-disabled {
    opacity: 100%;
  }
}
</style>
