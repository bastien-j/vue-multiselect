import type { App } from 'vue'
import VueMultiselect from './components/VueMultiselect.vue'

export function createMultiselect() {
  return (app: App) => {
    app.component('VueMultiselect', VueMultiselect)
  }
}