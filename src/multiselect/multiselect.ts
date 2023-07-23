import { defineAsyncComponent } from 'vue'
import type { App } from 'vue'

export function createMultiselect() {
  return (app: App) => {
    app.component(
      'VueMultiselect',
      defineAsyncComponent(() => import('./components/VueMultiselect.vue'))
    )
  }
}