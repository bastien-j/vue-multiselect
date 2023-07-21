<script setup lang="ts">
import { ref } from 'vue'
import VueMultiselect from './components/VueMultiselect.vue'

const options = [
  {
    label: 'First item',
    value: 'first',
  },
  {
    label: 'Second item',
    value: 'second',
  },
  {
    label: 'Third item',
    value: 'third',
  },
  {
    label: 'Fourth item',
    value: 'fourth',
  },
]

const value = ref()

const allowEmpty = ref(true)
const clearOnSelect = ref(true)
const closeOnSelect = ref(false)
const hideSelected = ref(false)
const multiple = ref(true)
const searchable = ref(true)
</script>

<template>
  <div class="container">
    <div class="checkbox">
      <label for="allowEmpty">allowEmpty</label>
      <input v-model="allowEmpty" type="checkbox" name="allowEmpty" id="allowEmpty" />
    </div>
    <div class="checkbox">
      <label for="clearOnSelect">clearOnSelect</label>
      <input v-model="clearOnSelect" type="checkbox" name="clearOnSelect" id="clearOnSelect" />
    </div>
    <div class="checkbox">
      <label for="closeOnSelect">closeOnSelect</label>
      <input v-model="closeOnSelect" type="checkbox" name="closeOnSelect" id="closeOnSelect" />
    </div>
    <div class="checkbox">
      <label for="hideSelected">hideSelected</label>
      <input v-model="hideSelected" type="checkbox" name="hideSelected" id="hideSelected" />
    </div>
    <div class="checkbox">
      <label for="multiple">multiple</label>
      <input v-model="multiple" type="checkbox" name="multiple" id="multiple" />
    </div>
    <div class="checkbox">
      <label for="searchable">searchable</label>
      <input v-model="searchable" type="checkbox" name="searchable" id="searchable" />
    </div>
    <VueMultiselect
      v-model="value"
      :options="options"
      :allow-empty="allowEmpty"
      :clear-on-select="clearOnSelect"
      :close-on-select="closeOnSelect"
      :hide-selected="hideSelected"
      :multiple="multiple"
      :searchable="searchable"
    >
      <template #option="{ option, selected }">{{ option.label }} - {{ selected }}</template>
    </VueMultiselect>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 64px;

  .checkbox {
    align-items: center;
    display: flex;
    gap: 8px;
  }
}
</style>
