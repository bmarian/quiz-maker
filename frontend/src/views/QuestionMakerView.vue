<template>
  <Toast position="bottom-right" group="br" />
  <div class="question-maker-container">
    <div class="question-maker-title-container">
      <h3 class="title">Întrebare:</h3>
      <div class="one-answer-checkbox">
        <Checkbox v-model="selectedQuestion.HasOneAnswer" inputId="hasOneAnswer" binary />
        <label for="hasOneAnswer">Întrebarea are un singur răspuns corect</label>
      </div>
    </div>
    <Textarea v-model="selectedQuestion.Description" autoResize fluid rows="3" />
    <div class="question-maker-tags">
      <FloatLabel variant="on">
        <AutoComplete inputId="category" multiple fluid dataKey="Key" :optionLabel="getCategoryLabel"
          v-model="selectedQuestion.Categories" :suggestions="searchCategories" @complete="searchCategory" />
        <label for="category">Categorii</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <AutoComplete inputId="label" multiple fluid :optionLabel="getLabelLabel" v-model="selectedQuestion.Labels"
          :suggestions="searchLabels" @complete="searchLabel" />
        <label for="label">Etichete</label>
      </FloatLabel>
    </div>
    <div class="question-maker-answer-container">
      <h3 class="title">Raspunsuri:</h3>
      <div class="answer" v-for="Answer in selectedQuestion.Answers">
        <Checkbox v-model="Answer.IsCorrect" binary />
        <Textarea v-model="Answer.Description" autoResize fluid rows="2" />
        <Button class="delete-answer" variant="outlined" severity="danger" size="small" icon="pi pi-trash"
          @click="deleteAnswer(Answer.Key)" />
      </div>
      <Button class="add-answer" label="Adaugă un răspuns" variant="outlined" severity="secondary" size="small"
        icon="pi pi-plus" @click="addAnswer" />
    </div>
  </div>
  <div class="question-maker-footer">
    <div class="start">
      <Button v-if="selectedQuestion.Key" label="Editează întrebarea" variant="outlined" severity="success" size="small"
        icon="pi pi-pencil" @click="editQuestion" />
      <Button v-else label="Salvează întrebarea" variant="outlined" severity="success" size="small" icon="pi pi-save"
        @click="saveQuestion" />
    </div>
    <div class="end">
      <Button label="Curăță pagina" variant="outlined" severity="warn" size="small" icon="pi pi-eraser"
        @click="clearQuestion" />
      <Button v-if="selectedQuestion.Key" label="Șterge întrebarea" variant="outlined" severity="danger" size="small"
        icon="pi pi-trash" @click="deleteQuestion" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuestionsStore } from "../stores/questions";
import { useLabelsStore } from "../stores/labels";
import { useCategoriesStore } from "../stores/categories";
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { v4 as uuidv4 } from 'uuid';

const toast = useToast();
const questionsStore = useQuestionsStore();
const { selectedQuestion } = storeToRefs(questionsStore);

const labelsStore = useLabelsStore();
const { labels } = storeToRefs(labelsStore);

const categoriesStore = useCategoriesStore();
const { categories } = storeToRefs(categoriesStore);
const flatCategories = computed(() => {
  if (!categories.value.length) return [];
  return categories.value.reduce((acc, c) => {
    if (!c.Children) return [...acc, c];

    const { Children, ...cat } = c;
    const children = Children.map((child) => ({ ...child, Name: `${c.Name} - ${child.Name}`, ParentKey: c.Key }));
    return [...acc, cat, ...children];
  }, []);
});

const searchLabels = ref([]);
const searchLabel = ({ query }) => {
  if (!labels.value.length || !query) {
    searchLabels.value = [];
    return;
  }

  searchLabels.value = labels.value
    .filter((l) => (l.Name || '').toLowerCase().includes(query.toLowerCase()))
    .map((l) => l.Key);
};
const getLabelLabel = (key) => {
  return labels.value.find((l) => l.Key === key)?.Name || '';
};

const searchCategories = ref([]);
const searchCategory = ({ query }) => {
  if (!flatCategories.value.length || !query) {
    searchCategories.value = [];
    return;
  }

  searchCategories.value = flatCategories.value
    .filter((c) => (c.Name || '').toLowerCase().includes(query.toLowerCase()))
    .map((c) => ({ Key: c.Key, ParentKey: c.ParentKey }));
};
const getCategoryLabel = ({ Key: key }) => {
  return flatCategories.value.find((c) => c.Key === key)?.Name || '';
};

const addAnswer = () => {
  const newAnswer = { Key: uuidv4(), IsCorrect: false, Description: '' };

  if (!Array.isArray(selectedQuestion.value.Answers)) selectedQuestion.value.Answers = [newAnswer];
  else selectedQuestion.value.Answers.push(newAnswer);
};
const deleteAnswer = (key) => {
  selectedQuestion.value.Answers = selectedQuestion.value.Answers.filter((a) => a.Key !== key);
}
const clearQuestion = () => {
  const newAnswer = { Key: uuidv4(), IsCorrect: false, Description: '' };
  selectedQuestion.value = { Description: '', Answers: [newAnswer] };
};
const saveQuestion = async () => {
  const { added, saved, message } = await questionsStore.addQuestion(selectedQuestion.value);
  if (added && saved) {
    toast.add({ severity: 'success', summary: 'Succes', detail: message, group: 'br', life: 3000 });
    clearQuestion();
  } else {
    toast.add({ severity: 'error', summary: 'Eroare', detail: message, group: 'br', life: 10000 });
  }
};
const editQuestion = () => {
};
const deleteQuestion = () => {
};

onMounted(() => {
  if (Array.isArray(selectedQuestion.value.Answers) && selectedQuestion.value.Answers.length) return;

  const newAnswer = { Key: uuidv4(), IsCorrect: false, Description: '' };
  selectedQuestion.value.Answers = [newAnswer];
});
</script>

<style lang="scss">
.question-maker-container {
  height: calc(100% - 35px);
  width: 100%;
  overflow: auto;

  & .question-maker-title-container {
    display: flex;
    align-items: baseline;
    justify-content: space-between;

    & .one-answer-checkbox {
      & .p-checkbox {
        margin-right: 0.5rem;
      }
    }
  }

  & .question-maker-tags {
    display: flex;
    gap: 2rem;
    justify-content: space-between;
    margin-top: 1rem;
    align-items: baseline;

    & .p-floatlabel {
      flex: 1;
    }
  }

  & .question-maker-answer-container {
    & .answer {
      margin-left: 0.5rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;

      & .p-checkbox {
        margin-right: 1rem;
      }

      & .p-textarea {
        flex: 1;
        max-height: 10rem;
        overflow: auto !important;
      }

      & .delete-answer {
        margin-right: 0.3rem;
        margin-left: 0.5rem;
      }
    }

    & .add-answer {
      margin-left: 0.5rem;
      margin-bottom: 0.5rem;
    }
  }
}

.question-maker-footer {
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;

  & .start,
  & .end {
    display: flex;
    gap: 1rem;
  }
}
</style>
