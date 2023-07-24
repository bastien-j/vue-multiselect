import VueMultiselect from './components/VueMultiselect.vue'
import { createMultiselect } from './multiselect'

export {
  VueMultiselect,
  createMultiselect
}

declare module 'vue' {
  export interface GlobalComponents {
    VueMultiselect: typeof VueMultiselect
  }
}