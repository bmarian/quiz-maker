import { createMemoryHistory, createRouter } from 'vue-router';
import QuestionMakerView from './views/QuestionMakerView.vue'
import SettingsView from './views/SettingsView.vue'

const routes = [
  { path: '/', component: QuestionMakerView },
  { path: '/settings', component: SettingsView },
];

export default createRouter({
  history: createMemoryHistory(),
  routes,
});
