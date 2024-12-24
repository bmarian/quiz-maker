import { defineStore } from "pinia"
import { v4 as uuidv4 } from 'uuid';
import { LoadQuestions, SaveQuestions } from "../../wailsjs/go/main/App";

export const useQuestionsStore = defineStore('questions', {
  state: () => ({
    selectedQuestion: {},
    questions: [],
  }),
  getters: {
  },
  actions: {
    async loadQuestions() {
      if (Array.isArray(this.questions) && this.questions.length) return;

      try {
        const savedQuestions = await LoadQuestions();
        this.questions = savedQuestions || [];
      } catch (e) {
        console.error('Unable to retrive backend questions!\n', e);

        if (browserMocks.useMocks) this.questions = browserMocks.question;
      }
    },
    async saveQuestions() {
      try {
        return await SaveQuestions(JSON.stringify(this.questions));
      } catch (e) {
        console.error('Unable to send questions to the backend!\n', e);
        return false;
      }
    },
    async addQuestion(question) {
      // TODO Implement
    },
    async editQuestion(key, question) {
      // TODO Implement
    },
    async deleteQuestion(key) {
      if (!key) return false;

      const questionToModifyIndex = this.questions.findIndex((q) => q.Key === key);
      if (questionToModifyIndex === -1) return false;

      this.questions = this.questions.filter((q) => q.Key !== key);

      await this.saveQuestions();
      return true;
    },
  },
});