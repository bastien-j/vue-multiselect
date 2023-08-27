<script setup lang="ts">
import { computed, ref } from 'vue'
import VueMultiselect from './multiselect/components/VueMultiselect.vue'

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

const value1 = ref()
const value2 = ref()
const value3 = ref()

const alignRight = ref(false)
const allowEmpty = ref(true)
const clearOnSelect = ref(true)
const closeOnSelect = ref(false)
const hideSelected = ref(false)
const multiple = ref(true)
const searchable = ref(true)
const openOnClear = ref(false)

const align = computed(() => alignRight.value ? 'right' : 'left')
</script>

<template>
  <div class="container">
    <div class="settings">
      <div class="checkbox">
        <label for="alignRight">alignRight</label>
        <input v-model="alignRight" type="checkbox" name="alignRight" id="alignRight" />
      </div>
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
      <div class="checkbox">
        <label for="openOnClear">openOnClear</label>
        <input v-model="openOnClear" type="checkbox" name="openOnClear" id="openOnClear" />
      </div>
    </div>
    <div class="selects">
      <div class="select">
        <p>Default</p>
        <VueMultiselect
          v-model="value1"
          :options="options"
          :align="align"
          :allow-empty="allowEmpty"
          :clear-on-select="clearOnSelect"
          :close-on-select="closeOnSelect"
          :hide-selected="hideSelected"
          :multiple="multiple"
          :searchable="searchable"
          :open-on-clear="openOnClear"
          @close="console.log('1 - closed')"
        />
      </div>
      <div class="select">
        <p>Custom slots</p>
        <VueMultiselect
          v-model="value2"
          :options="options"
          :adjust-position="false"
          :align="align"
          :allow-empty="allowEmpty"
          :clear-on-select="clearOnSelect"
          :close-on-select="closeOnSelect"
          :hide-selected="hideSelected"
          :multiple="multiple"
          :searchable="searchable"
          :open-on-clear="openOnClear"
          @close="console.log('2 - closed')"
        >
          <template #multiple="{ options, remove }">
            <span v-for="o in options">{{ o.label }}<button @click.stop="remove(o)">x</button></span>
          </template>
          <template #search="{ value, search }">
            <input placeholder="my custom input" type="text" :value="value" @input="search(($event.target as HTMLInputElement).value)">
          </template>
          <template #option="{ option, selected }">
            <div class="option" :class="{ selected }">
              {{ option.label }}
            </div>
          </template>
        </VueMultiselect>
      </div>
      <div class="select">
        <p>Custom chips</p>
        <VueMultiselect
          v-model="value3"
          :options="options"
          :align="align"
          :allow-empty="allowEmpty"
          :clear-on-select="clearOnSelect"
          :close-on-select="closeOnSelect"
          :hide-selected="hideSelected"
          :multiple="multiple"
          :position="'top'"
          :searchable="searchable"
          :open-on-clear="openOnClear"
          @search="console.log($event)"
          @close="console.log('3 - closed')"
        >
          <template #chip="{ option, remove }">
            <span class="custom-chip">{{ option.label }}<button @click.stop="remove()">x</button></span>
          </template>
        </VueMultiselect>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 64px;

  .settings {
    display: flex;
    gap: 2rem;
    padding: 2rem;
    flex-wrap: wrap;

    .checkbox {
      align-items: center;
      display: flex;
      gap: 8px;
    }
  }

  .selects {
    display: flex;
    gap: 2rem;
    padding: 2rem;
  }

  .select {
    p {
      margin-bottom: 1rem;
    }

    .custom-chip {
      background-color: rgb(252, 171, 171);
      padding: 4px;
      border-radius: 4px;
    }
  }

  .option {
    transition: .15s;
    user-select: none;
    padding: 8px 16px;
    margin: 8px 8px;
    border-radius: 99px;

    &.selected {
      background-color: hsl(120, 100%, 60%);
    }
  }
}
</style>
