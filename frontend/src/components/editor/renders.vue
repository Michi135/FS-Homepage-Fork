<template>
  <Teleport
    :to="renderer.to"
  >
    <component
      :is="renderer.comp"
      v-bind="{...renderer.props}"
    ></component>
  </Teleport>
</template>

<script lang="ts">
import { ComponentOptions, defineComponent, PropType, ComponentPropsOptions } from "vue"

export interface CompWrapper {
    comp: ComponentOptions,
    to: HTMLElement,
    props?: Record<any, any> //ComponentPropsOptions
}

export default defineComponent({
  props: {
    renderer: {
      type: Object as PropType<CompWrapper>,
      required: true
    }
  },
  setup(props)
  {
    return {  }
  }
})
</script>