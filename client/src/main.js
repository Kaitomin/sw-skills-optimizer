import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "@/assets/global.css";
import "@/assets/theme_lily.css";

import store from './store/index'

createApp(App).use(router).use(store).mount('#app')
