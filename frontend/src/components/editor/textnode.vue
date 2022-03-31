<template :ref="parent">
  {{ compValues.text }}
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onBeforeUpdate, onUpdated, ref, Ref } from "vue"
import { useStore } from "./store"

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
    let parent: Ref<null | Node> = ref(null)
    let op: Operation = 'none'

    const instance = getCurrentInstance()

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
    const compValues = store.getValuesByID(props.uuid)!
    store.getComponentByID(props.uuid)!.proxy = instance!.proxy!

    if (!compValues.text)
      compValues.text = ''

    /*function setText(value: string)
    {
      compValues.text = value
    }*/

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

      if (!selection)
        return

      const range = selection.getRangeAt(0)
      if (!range.intersectsNode(instance!.vnode.el as Node))
        return

      const startOffset = (range.startOffset > 0) ? range.startOffset - 1 : 0

      op = 'remove'
      compValues.text = compValues.text.substring(0, startOffset) + compValues.text.substring(range.endOffset)
    }

    return { compValues, parent, insertText, removeText }
  }
})
</script>