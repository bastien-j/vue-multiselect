<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, onMounted, ref, watch } from 'vue'
import { onClickOutside, useWindowSize } from '@vueuse/core'
import CheckedIcon from './icons/CheckedIcon.vue'
import ClearIcon from './icons/ClearIcon.vue'
import ExpandIcon from './icons/ExpandIcon.vue'
import UncheckedIcon from './icons/UncheckedIcon.vue'

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'remove', value: T | T[]): void
  (e: 'select', value: T | T[]): void
  (e: 'search', value: string): void
  (e: 'update:model-value', value?: T | T[]): void
}>()
const props = withDefaults(
  defineProps<{
    adjustPosition?: boolean
    align?: 'left' | 'right'
    allowEmpty?: boolean
    clearOnSelect?: boolean
    closeOnSelect?: boolean
    hideSelected?: boolean
    max?: number
    maxHeight?: string
    modelValue?: T | T[]
    multiple?: boolean
    openOnClear?: boolean
    options: T[]
    labelField?: keyof T
    placeholder?: string
    position?: 'bottom' | 'top'
    searchable?: boolean
    customSearch?: (search: string, option: T) => boolean
    valueField?: keyof T
  }>(),
  {
    adjustPosition: true,
    align: 'left',
    closeOnSelect: undefined,
    labelField: 'label',
    maxHeight: '250px',
    multiple: false,
    placeholder: 'Sélectionner une option',
    position: 'bottom',
    searchable: false,
    valueField: 'value',
  }
)
defineSlots<{
  chip?(props: { option: T; remove: () => void }): any
  multiple?(props: { options: T[]; remove: (option: T) => void }): any
  option?(props: { option: T; selected: boolean }): any
  search?(props: { search: (value: string) => void; value: string }): any
  single?(props: { option: T }): any
}>()

const menuEl = ref<HTMLLIElement>()
const buttonEl = ref<HTMLButtonElement>()
const search = ref('')
const showMenu = ref(false)

const { height } = useWindowSize({ includeScrollbar: false })

const filteredOptions = computed(() => {
  let options = props.options.concat()
  const s = search.value.toLowerCase().trim()
  if (props.searchable && s) {
    options = options.filter((o) =>
      props.customSearch ? props.customSearch(s, o) : o[props.valueField].toLowerCase().includes(s)
    )
  }
  if (props.hideSelected) {
    options = options.filter((o) => !isSelected(o))
  }
  return options
})
const internalValue = computed(() => {
  if (!props.modelValue) return []
  if (!Array.isArray(props.modelValue)) return [props.modelValue]
  return props.modelValue
})
const adjustedPosition = computed(() => {
  const bRect = buttonEl.value?.getBoundingClientRect()
  const mRect = menuEl.value?.getBoundingClientRect()

  if (!props.adjustPosition || !bRect || !mRect) return props.position

  const bottomHeight = height.value - (bRect.top + bRect.height + 4)
  const topHeight = bRect.top - 4

  if (
    props.position === 'top'
    && topHeight < mRect.height
    && bottomHeight >= mRect.height
  ) return 'bottom'

  if (
    props.position === 'bottom'
    && bottomHeight < mRect.height
    && topHeight >= mRect.height
  ) return 'top'

  return props.position
})
const menuPosition = computed(() => ({
  [adjustedPosition.value === 'top' ? 'bottom' : 'top']: 'calc(100% + 4px)'
}))
const valueKeys = computed(() => internalValue.value.map((option) => option[props.valueField]))

function getLabel(option: T) {
  return option[props.labelField]
}

function isSelected(option: T) {
  const value = option[props.valueField]
  return valueKeys.value.indexOf(value) > -1
}

function select(option: T) {
  if (props.max && props.multiple && internalValue.value.length === props.max) return

  const selected = isSelected(option)

  if (selected) return remove(option)

  if (props.multiple) emits('update:model-value', internalValue.value.concat([option]))
  else emits('update:model-value', option)

  emits('select', option)

  if (props.clearOnSelect) search.value = ''

  if (props.closeOnSelect || (props.closeOnSelect === undefined && !props.multiple)) {
    showMenu.value = false
  }
}

function remove(option: T, close?: boolean) {
  if (!props.allowEmpty && internalValue.value.length <= 1) return

  const index = valueKeys.value.indexOf(option[props.valueField])
  const newValue = internalValue.value.slice(0, index).concat(internalValue.value.slice(index + 1))

  if (props.multiple) emits('update:model-value', newValue)
  else emits('update:model-value', undefined)

  emits('remove', option)

  if (props.closeOnSelect || close || (props.closeOnSelect === undefined && !props.multiple)) {
    showMenu.value = false
  }
}

function removeFromChip(option: T) {
  remove(option)

  if (props.openOnClear) showMenu.value = true
}

function reset(option?: T) {
  showMenu.value = props.openOnClear
  if (props.multiple) {
    if (props.allowEmpty) emits('update:model-value', option ? [option] : [])
    else emits('update:model-value', option ? [option] : [props.options[0]])
  } else {
    if (props.allowEmpty) emits('update:model-value', option)
    else emits('update:model-value', option ?? props.options[0])
  }
}

watch(
  () => props.allowEmpty,
  (n, o) => {
    if (o && !n && !internalValue.value.length) select(props.options[0])
  }
)
watch(
  () => props.multiple,
  () => {
    if (internalValue.value.length) reset(internalValue.value[0])
  }
)
watch(search, (v) => emits('search', v))
watch(showMenu, (v) => v ? null : emits('close'))

onClickOutside(
  menuEl,
  () => {
    showMenu.value = false
  },
  {
    ignore: [buttonEl],
  }
)

onMounted(() => {
  if (!props.allowEmpty && !internalValue.value.length && filteredOptions.value.length) {
    select(filteredOptions.value[0])
  }
})
</script>

<template>
  <div class="vue-multiselect">
    <button
      ref="buttonEl"
      class="vue-multiselect__toggle"
      type="button"
      :data-menu-shown="showMenu || undefined"
      @click.stop="showMenu = !showMenu"
    >
      <span v-if="!internalValue.length" class="vue-multiselect__placeholder">
        {{ placeholder }}
      </span>
      <span v-else-if="!multiple">
        <slot name="single" :option="internalValue[0]">{{ getLabel(internalValue[0]) }}</slot>
      </span>
      <template v-else>
        <slot name="multiple" :options="internalValue" :remove="removeFromChip">
          <div class="vue-multiselect__chips">
            <template v-for="o in internalValue">
              <slot name="chip" :option="o" :remove="() => removeFromChip(o)">
                <span class="vue-multiselect__chip">
                  {{ getLabel(o) }}
                  <button class="vue-multiselect__remove-btn" type="button" @click.stop="removeFromChip(o)">
                    <ClearIcon />
                  </button>
                </span>
              </slot>
            </template>
          </div>
        </slot>
      </template>
      <button
        v-if="multiple && internalValue.length"
        class="vue-multiselect__clear-btn"
        type="button"
        @click.stop="reset()"
      >
        <ClearIcon />
      </button>
      <ExpandIcon />
    </button>
    <ul
      v-if="showMenu"
      ref="menuEl"
      class="vue-multiselect__menu"
      :style="{ ...menuPosition, [align]: '0', maxHeight }"
    >
      <li v-if="searchable" class="vue-multiselect__search">
        <slot name="search" :value="search" :search="(value: string) => search = value">
          <input v-model="search" type="text" placeholder="Search" name="vue-multiselect__search" />
        </slot>
      </li>
      <li
        v-for="{ o, selected } in filteredOptions.map((o) => ({ o, selected: isSelected(o) }))"
        :data-selected="selected || undefined"
        tabindex="0"
        @click="select(o)"
        @keypress.enter.space="select(o)"
      >
        <slot name="option" :option="o" :selected="selected">
          <div class="vue-multiselect__option">
            {{ o.label }}
            <template v-if="multiple">
              <CheckedIcon v-if="selected" />
              <UncheckedIcon v-else />
            </template>
          </div>
        </slot>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.vue-multiselect {
  position: relative;

  svg {
    pointer-events: none;
  }

  .vue-multiselect__toggle {
    align-items: center;
    background-color: hsl(0, 0%, 100%);
    border: 1px solid hsl(220, 17%, 93%);
    border-radius: 8px;
    color: hsl(220, 43%, 11%);
    display: inline-flex;
    gap: 4px;
    padding: 8px;
    transition: 0.15s background-color;

    &:not(:disabled):hover {
      cursor: pointer;
    }

    &:hover,
    &[data-menu-shown] {
      background-color: hsl(192, 33%, 97%);
    }

    .vue-multiselect__placeholder {
      color: gray;
    }

    .vue-multiselect__chips {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      .vue-multiselect__chip {
        align-items: center;
        background-color: hsl(195, 54%, 27%);
        border-radius: 99px;
        color: hsl(0, 0%, 95%);
        display: inline-flex;
        font-size: 12px;
        gap: 4px;
        padding: 0 0 0 8px;

        .vue-multiselect__remove-btn {
          background-color: transparent;
          border: none;
          border-radius: 99px;
          color: currentColor;
          display: inline-grid;
          padding: 4px;

          &:hover {
            background-color: hsl(195, 54%, 17%);
            cursor: pointer;
          }
        }
      }
    }

    .vue-multiselect__clear-btn {
      background-color: transparent;
      border: none;
      border-radius: 99px;
      color: hsl(0, 0%, 30%);
      display: inline-grid;
      margin-left: 4px;
      padding: 2px;
      transition-duration: 0.15s;
      transition-property: background-color, color;

      &:hover {
        background-color: hsl(0, 90%, 62%);
        color: hsl(0, 0%, 100%);
        cursor: pointer;
      }
    }

    > svg {
      min-height: 24px;
      min-width: 24px;
    }
  }

  .vue-multiselect__menu {
    background-color: hsl(0, 0%, 100%);
    border: 1px solid hsl(220, 17%, 93%);
    border-radius: 8px;
    list-style: none;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 8px 0;
    position: absolute;
    white-space: nowrap;
    z-index: 2023;

    .vue-multiselect__search {
      position: sticky;
      top: 0px;

      input[type='text'] {
        border: 1px solid hsl(0, 0%, 85%);
        border-radius: 4px;
        margin: 0px 8px 8px;
        padding: 8px;
      }
    }

    > li {
      > .vue-multiselect__option {
        align-items: center;
        display: inline-flex;
        height: 100%;
        justify-content: space-between;
        padding: 8px 16px;
        text-align: start;
        transition: 0.15s background-color;
        width: 100%;

        &:hover {
          background-color: hsl(0, 0%, 95%);
          cursor: pointer;
        }

        > svg {
          margin-left: 16px;
        }
      }

      &[data-selected] > .vue-multiselect__option {
        font-weight: bold;
      }
    }
  }
}
</style>
