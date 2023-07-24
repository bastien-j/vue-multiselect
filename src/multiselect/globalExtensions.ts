import VueMultiselect from './components/VueMultiselect.vue'

/**
 * Allows customizing existing types of the multiselect that are used globally like `<VueMultiselect>`.
 *
 * @internal
 */
interface TypesConfig {}

declare module 'vue' {
  export interface GlobalComponents {
    VueMultiselect: typeof VueMultiselect
  }
}