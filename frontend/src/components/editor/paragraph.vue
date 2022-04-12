<template>
  <p
    v-if="components.get(uuid)!.children?.length"
    tabindex="1"
    @keydown="onKey"
  >
    <component
      v-for="v in components.get(uuid)!.children"
      :key="v.uuid"
      :is="v.component"
      v-bind="{...v.props}"
    >
    </component>
  </p>
  <div
    :style="divStyle"
    v-else
  ></div>
</template>

<script lang="ts">
import { storeToRefs } from "pinia"
import { computed, defineComponent, getCurrentInstance, onMounted } from "vue"
import { useStore } from './store'

import textnode from './textnode.vue'
import { getDocumentRange } from "./utils"

export default defineComponent({
  components: {
    "textnode": textnode
  },
  props:{
    uuid: {
      type: String,
      required: true
    }
  },
  setup(props)
  {
    const { components } = storeToRefs(useStore())
    const instance = getCurrentInstance()

    const store = useStore()
    //const compValues = store.getValuesByID(props.uuid)!
    const component = store.getComponentByID(props.uuid)!
    component.proxy = instance!.proxy!


    //console.log(component.proxy)
    //function insertText()

    onMounted(() =>
    {
      const node = (<HTMLElement>getCurrentInstance()!.vnode.el!)
      node.firstChild?.remove()
      node.lastChild?.remove()
    })

    function onKey(evt: KeyboardEvent)
    {
      const range = getDocumentRange()
      if (!range)
        return

      //if (range.commonAncestorContainer )

      if (/^.$/u.test(evt.key))
      {
        /*const node = store.getComponentTextNode(range.startContainer)
        if (!node)
          return*/

        console.log(`paragraph: ${evt.key}`)
        //@ts-ignore
        //node.proxy!.insertText(evt.key)
        //evt.preventDefault()
      }
    }

    const divStyle = computed(() =>
    {
      return { height: '1.5em' }
    })

    return {
      onKey,
      components,
      divStyle
    }
  }
})
</script>