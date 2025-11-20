import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import PhosphorIcons from "@phosphor-icons/vue"

const app = createApp(App)
app.use(router)
app.use(PhosphorIcons)
app.mount('#app')
