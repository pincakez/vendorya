import { createApp } from 'vue'
import { createPinia } from 'pinia' // Import createPinia
import App from './App.vue'
import router from './router'
import './style.css'
import PhosphorIcons from "@phosphor-icons/vue"

const app = createApp(App)
const pinia = createPinia() // Create a Pinia instance

app.use(pinia) // Use Pinia
app.use(router)
app.use(PhosphorIcons)
app.mount('#app')
