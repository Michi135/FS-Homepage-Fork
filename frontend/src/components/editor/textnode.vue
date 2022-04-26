<template>
  {{ compValues.text }}
</template>

<script lang="ts">
//import { range } from "lodash"
import { defineComponent, getCurrentInstance, nextTick, onBeforeUpdate, onMounted, onUpdated, ref, Ref } from "vue"
import { useStore } from "./store"
import { getDocumentRange } from "./utils"

type Operation = 'none' | 'insert' | 'remove'

export default defineComponent({
  props: {
    uuid: {
      type: String,
      required: true
    }
  },
  setup(props)
  {
    let oldRange: { startContainer: Node, start: number } | null = null
    //let parent: Ref<null | Node> = ref(null)
    let op: Operation = 'none'

    const instance = getCurrentInstance()!
    //instance?.parent.el
    console.log(instance.parent)

    onBeforeUpdate(() =>
    {
      const range = document.getSelection()!.getRangeAt(0)
      if (!range.intersectsNode(instance!.vnode.el as Node))
        return

      oldRange = { startContainer: range.startContainer, start: range.startOffset }
    })
    onUpdated(() =>
    {
      if (!oldRange)
        return
      const range = document.getSelection()!.getRangeAt(0)

      switch (op)
      {
      case 'insert':
        {
          range.setStart(oldRange.startContainer, oldRange.start + 1)
          range.setEnd(oldRange.startContainer, oldRange.start + 1)
        }
        break
      case 'remove':
        {
          const newOffset = (oldRange.start > 0) ? oldRange.start - 1 : 0
          range.setStart(oldRange.startContainer, newOffset)
          range.setEnd(oldRange.startContainer, newOffset)
        }
        break
      }
      oldRange = null
      op = 'none'
    })

    const store = useStore()
    const component = store.getComponentByID(props.uuid)!
    const compValues = component.values
    component.proxy = instance!.proxy!

    if (!compValues.text)
      compValues.text = ''

    /*function setText(value: string)
    {
      compValues.text = value
    }*/

    function onKey(evt: KeyboardEvent)
    {
      const range = getDocumentRange()
      console.log(instance.vnode.el)

      if (!range || !range.intersectsNode((<Node>instance.vnode.el!)))
        return

      if (/^.$/u.test(evt.key))
      {
        compValues.text = compValues.text.substring(0, range.startOffset) + evt.key + compValues.text.substring(range.endOffset)

        const index = range.startOffset
        nextTick(() =>
        {
          range.setStart(<Node>instance.vnode.el!, index + 1)
          range.setEnd(<Node>instance.vnode.el!, index + 1);
          (<HTMLElement>instance.parent!.vnode.el!).focus()
        })
      }
      else if (evt.key === 'Enter')
      {
        console.log(evt.key)
      }
      else if (evt.key === 'Backspace')
      {
        const startOffset = (range.startOffset > 0) ? range.startOffset - 1 : 0
        compValues.text = compValues.text.substring(0, startOffset) + compValues.text.substring(range.endOffset)
        if (compValues.text === '')
        {
          store.removeComponent(props.uuid)
          return
        }

        nextTick(() =>
        {
          range.setStart(<Node>instance.vnode.el!, startOffset)
          range.setEnd(<Node>instance.vnode.el!, startOffset);
          (<HTMLElement>instance.parent!.vnode.el!).focus()
        })
      }
      else if(evt.key === 'Delete')
      {
        const startOffset = range.startOffset
        compValues.text = compValues.text.substring(0, startOffset) + compValues.text.substring(range.endOffset + 1)
        if (compValues.text === '')
        {
          store.removeComponent(props.uuid)
          return
        }

        nextTick(() =>
        {
          range.setStart(<Node>instance.vnode.el!, startOffset)
          range.setEnd(<Node>instance.vnode.el!, startOffset);
          (<HTMLElement>instance.parent!.vnode.el!).focus()
        })
      }
      else
      {
        console.log(evt.key)
      }
    }

    onMounted(() =>
    {
      //store.nodes.set(instance.proxy!.$el, component);
      (<HTMLElement>instance.parent!.vnode.el).addEventListener('keydown', onKey)
    })

    function insertText(data: string)
    {
      const selection = document.getSelection()

      if (!selection)
        return

      const range = selection.getRangeAt(0)
      if (!range.intersectsNode(instance!.vnode.el as Node))
        return

      op = 'insert'
      compValues.text = compValues.text.substring(0, range.startOffset) + data + compValues.text.substring(range.endOffset)
    }

    function removeText()
    {
      const selection = document.getSelection()

      console.log('Pleb')

      if (!selection)
        return

      const range = selection.getRangeAt(0)
      if (!range.intersectsNode(instance!.vnode.el as Node))
        return

      const startOffset = (range.startOffset > 0) ? range.startOffset - 1 : 0

      op = 'remove'
      compValues.text = compValues.text.substring(0, startOffset) + compValues.text.substring(range.endOffset)
      if (compValues.text === '')
      {
        //remove this node
        const parent = component.parent!.component
        parent.children.splice(parent.children.indexOf(component), 1)
        store.components.delete(props.uuid)
        //store.nodes.delete(instance!.proxy!.$el)
        console.log("removed")
      }
    }

    return { compValues, insertText, removeText, onKey }
  }
})
</script>