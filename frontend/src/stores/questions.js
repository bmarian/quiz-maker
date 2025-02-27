import { browserMocks } from "../utils"
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
      let errorMessage = '';
      if (!question) errorMessage = 'întrebare nu poate fi adăugată!\n\n';

      if (!question?.Description) errorMessage += 'Lipsește cerința!\n';
      if (!question?.Categories?.length) errorMessage += 'Minim o categorie este necesară!\n';

      const filteredAnswers = (question?.Answers || []).filter((a) => a.Description);
      if (!filteredAnswers.length) errorMessage += 'Minim un răspuns este necesar!\n';
      if (filteredAnswers.length && !filteredAnswers.some((f) => f.IsCorrect)) errorMessage += 'Minim un răspuns trebuie să fie corect!\n';

      if (errorMessage) return { added: false, saved: false, message: `întrebare nu poate fi adăugată!\n\n${errorMessage}` };

      const Key = uuidv4();
      this.questions.push({ ...question, Key, Answers: filteredAnswers });

      const status = await this.saveQuestions();
      if (!status) return { added: true, saved: false, message: 'A apărut o eroare la salvarea întrebării, încearcă din nou!\n' };

      return { added: true, saved: true, message: 'Întrebarea a fost adăugată cu succes!' };
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