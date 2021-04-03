import { createApp } from 'vue'
import App from './app'
import { useRequestGlobal } from '../hooks/useRequest'
import './index.css'

useRequestGlobal({})

createApp(App).mount('#root')
