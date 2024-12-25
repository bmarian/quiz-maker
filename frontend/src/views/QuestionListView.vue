<template>
  <div v-for="question in questions">
    <h1>{{ question.Description }}</h1>
    <div v-for="answer in question.Answers">
      <span>{{ answer.Description }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuestionsStore } from "../stores/questions";

const questionsStore = useQuestionsStore();
const { questions } = storeToRefs(questionsStore);
</script>

<style lang="scss"></style>
