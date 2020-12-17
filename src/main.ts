import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueFinalModal from 'vue-final-modal'

const VueApp = createApp(App)

VueApp.use(VueFinalModal())
VueApp.use(router)
VueApp.mount('#app')
