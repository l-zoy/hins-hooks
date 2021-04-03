import { createApp } from 'vue'
import App from './app'
import { useRequestGlobal } from '../hooks/useRequest'

useRequestGlobal({})

createApp(App).mount('#root')
