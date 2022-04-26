<template>
  <p
    v-if="children?.length"
    tabindex="1"
    @keydown="onKey"
  >
    <template
      v-for="v in children"
      :key="v.uuid"
    >
      <component
        :is="v.component"
        v-bind="{...v.props}"
      >
      </component>
    </template>
  </p>
  <div
    :style="divStyle"
    tabindex="1"
    @keydown="onKey"
    v-else
  ></div>
</template>

<script lang="ts">
//import { storeToRefs } from "pinia"
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
    //const { components } = storeToRefs(useStore())
    const instance = getCurrentInstance()!

    const store = useStore()
    //const compValues = store.getValuesByID(props.uuid)!
    const component = store.getComponentByID(props.uuid)!
    component.proxy = instance!.proxy!
    const children = component.children


    //console.log(component.proxy)
    //function insertText()

    onMounted(() =>
    {
      const node = (<HTMLElement>instance.vnode.el!)
      node.firstChild?.remove()
      node.lastChild?.remove()
    })

    function onKey(evt: KeyboardEvent)
    {
      const range = getDocumentRange()
      if (!range)
        return

      if (children.length === 0)
      {
        if (/^.$/u.test(evt.key))
        {
          store.addComponent('textnode', { parentUUID: props.uuid, values: { 'text': evt.key } })
          return
        }
      }

      if (evt.key === 'Enter')
      {
        const newParagraph = store.addComponent('paragraph', { parentUUID: component.parent?.uuid })
        //split text if possible

        //check if currently inside textnode
        if (children.length !== 0 && range.endContainer.nodeName === '#text')
        {
          //if ()
          console.log(range.endContainer)
          //store.addComponent('textnode', { parentUUID: newParagraph.uuid, values: { 'text': 'sth' } })
        }
      }

      return

      const isParent = range.commonAncestorContainer.parentNode === instance.vnode.el!
      const isNode = range.commonAncestorContainer === instance.vnode.el!

      //if (range.commonAncestorContainer )
      if (!isNode && !isParent)
        return


      if (/^.$/u.test(evt.key))
      {
        if (isNode) //create new textnode
        {
          const newNode = store.addComponent('textnode', { parentUUID: props.uuid, values: { 'text': evt.key } })
        }
        if (isParent)
        {
          const textnode = store.getComponentTextNode(range.commonAncestorContainer)!.proxy
          //@ts-ignore
          textnode!.insertText(evt.key)
        }

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
      children,
      divStyle
    }
  }
})
</script>