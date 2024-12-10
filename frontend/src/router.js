import { createMemoryHistory, createRouter } from 'vue-router';
import QuestionMakerView from './views/QuestionMakerView.vue'
import SettingsView from './views/SettingsView.vue'
import QuestionListView from './views/QuestionListView.vue'
import CategoryMakerView from './views/CategoryMakerView.vue'
import LabelMakerView from './views/LabelMakerView.vue'

const routes = [
  { path: '/', component: QuestionMakerView },
  { path: '/list', component: QuestionListView },
  { path: '/category', component: CategoryMakerView },
  { path: '/label', component: LabelMakerView },
  { path: '/settings', component: SettingsView },
];

export default createRouter({
  history: createMemoryHistory(),
  routes,
});
