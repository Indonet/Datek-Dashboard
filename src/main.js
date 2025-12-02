/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Routers
import router from './router';

// Pinia State Management
import { createPinia } from 'pinia';

// Directive permission
import permissionDirective from "./directives/permission";

import "./styles/main.css"; 

const app = createApp(App)

app.use(router)

app.use(createPinia())

app.directive("permission", permissionDirective)

registerPlugins(app)

app.mount('#app')
