<template>
  <div>
    <div class="tw-flex tw-flex-wrap">
      <button
        @click="applyBold"
        class="button"
        :class="{ active: effects.has('strong')}"
      >
        <font-awesome-icon :icon="faBold" />
      </button>
      <button
        @click="applyItalic"
        class="button"
        :class="{ active: effects.has('italic')}"
      >
        <font-awesome-icon :icon="faItalic" />
      </button>
      <button
        @click="applyUnderline"
        class="button"
        :class="{ active: effects.has('underlined')}"
      >
        <font-awesome-icon :icon="faUnderline" />
      </button>
      <button
        @click="applyHeading"
        class="button"
      >
        <font-awesome-icon :icon="faHeading" />
      </button>
      <button
        @click="applyUl"
        class="button"
      >
        <font-awesome-icon :icon="faListUl" />
      </button>
      <button
        @click="applyOl"
        class="button"
      >
        <font-awesome-icon :icon="faListOl" />
      </button>
      <button
        @click="undo"
        class="button"
      >
        <font-awesome-icon :icon="faUndo" />
      </button>
      <button
        @click="redo"
        class="button"
      >
        <font-awesome-icon :icon="faRedo" />
      </button>
      <button
        @click="addC"
        class="button"
      >
        Add Comp
      </button>
    </div>
    <div>
      <div
        class="wysiwyg-output tw-outline-none tw-border-2 tw-p-4 tw-rounded-lg tw-border-gray-300 focus:tw-border-green-300"
        contenteditable="true"
        ref="editor"
        id="editor"
        @beforeinput.prevent="onInput"
        @keydown="onKey"
      >
        <component
          v-for="v in store.topLevelComponents"
          :key="v.uuid"
          :is="v.component"
          v-bind="{...v.props, ...v.attributes}"
        >
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable vue/no-unused-components */


import { defineComponent, nextTick, onMounted, onServerPrefetch, ref, watch } from 'vue'
import { faBold } from '@fortawesome/free-solid-svg-icons/faBold'
import { faItalic } from '@fortawesome/free-solid-svg-icons/faItalic'
import { faUnderline } from '@fortawesome/free-solid-svg-icons/faUnderline'
import { faHeading } from '@fortawesome/free-solid-svg-icons/faHeading'
import { faListUl } from '@fortawesome/free-solid-svg-icons/faListUl'
import { faListOl } from '@fortawesome/free-solid-svg-icons/faListOl'
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo'
import { faRedo } from '@fortawesome/free-solid-svg-icons/faRedo'

import { useStore } from './store'
import { storeToRefs } from 'pinia'

import { getDocumentRange } from './utils'

import type { Ref } from "vue"
import type { Effects, EffectString, Elements } from './store'

import comp from './comp.vue'
import para from './paragraph.vue'
//import { textNode } from './renderer'
import textnode from './textnode.vue'

//https://dev.to/thormeier/build-your-own-wysiwyg-markdown-editor-for-vue-318j
export default defineComponent({
  components: {
    "paragraph": para,
    "textnode": textnode,
    "comp": comp
  },
  setup()
  {
    const store = useStore()
    const { effects } = storeToRefs(store)

    const editor: Ref<HTMLElement | null> = ref(null)

    function updateEffect(range: Range, elementEffect: Map<Elements, Effects>)
    {
      const found = findEffect(range, new Set<Elements>(Array.from(elementEffect.keys())))
      for (let [k, v] of elementEffect)
      {
        if (found.has(k))
          effects.value.add(v)
        else
          effects.value.delete(v)
      }
    }

    function findEffect(range: Range, tag: Set<Elements>): Set<Elements>
    {
      const nodeSet = new Set<Elements>()

      if(range.startContainer === editor.value ||
        !editor.value!.contains(range.startContainer))
        return nodeSet

      const tempRange = range.cloneRange()

      if (tempRange.collapsed && tempRange.startOffset === 0)
      {
        const newLineElements = new Set<string>(['P', 'BR', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'])

        const walker = document.createTreeWalker(editor.value!, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, { acceptNode: function(node)
        {
          if (newLineElements.has(node.nodeName))
            return NodeFilter.FILTER_REJECT
          else if (node.nodeType === Node.TEXT_NODE)
            return NodeFilter.FILTER_ACCEPT
          else
            return NodeFilter.FILTER_SKIP
        } })
        walker.currentNode = tempRange.commonAncestorContainer
        const node = walker.previousNode()
        if (node)
        {
          tempRange.setStart(node, (<CharacterData>node).length)
          tempRange.setEnd(node, (<CharacterData>node).length)
        }
        else
          return nodeSet
      }

      function acceptFn(node: Node)
      {
        if (tempRange.intersectsNode(node))
        {
          if (tag.has(<Elements>node.nodeName))
            return NodeFilter.FILTER_ACCEPT
          else
            return NodeFilter.FILTER_SKIP
        }
        else
          return NodeFilter.FILTER_REJECT
      }

      {
        const walker = document.createTreeWalker(
          tempRange.commonAncestorContainer,
          NodeFilter.SHOW_ELEMENT,
          { acceptNode: acceptFn }
        )
        let node: Node | null = null
        while (node = walker.nextNode())
        {
          nodeSet.add(<Elements>node.nodeName)
          if (nodeSet.size === tag.size)
            return nodeSet
        }
      }
      {
        const walker = document.createTreeWalker(editor.value!, NodeFilter.SHOW_ELEMENT, { acceptNode: acceptFn })
        walker.currentNode = tempRange.commonAncestorContainer

        let node: Node | null = null
        while (node = walker.parentNode())
        {
          nodeSet.add(<Elements>node.nodeName)
          if (nodeSet.size === tag.size)
            return nodeSet
        }
        return nodeSet
      }
    }

    onMounted(() =>
    {
      document.addEventListener('selectionchange', (ev) =>
      {
        const selection = window.getSelection()
        if (!selection)
          return

        //might be caret
        const range = selection.getRangeAt(0)

        /*updateEffect(range, new Map<Elements, Effects>([
          ['STRONG', 'strong'],
          ['EM', 'italic'],
          ['U', 'underlined']
        ]))*/
      })
    })

    onMounted(() =>
    {
      const paraId = store.addComponent('paragraph')
      const textId = store.addComponent('textnode', { parentUUID: paraId, values: { 'text': 'Hello, World!' } })
    })

    function applyElementEffect(tag: string)
    {
      const selection = window.getSelection()
      if (selection === null)
        return false

      //amount of ranges is always 1 per definition
      const range = selection.getRangeAt(0)
      //const oldSelection = range.commonAncestorContainer

      //const element = document.createElement(tag)
      //range.surroundContents(element)

      /*let content: Node = element
      while (content.firstChild)
        content = content.firstChild

      element.normalize()*/

      //range.selectNodeContents(content)
      //range.startContainer.parentElement?.parentElement?.normalize()
      /*.childNodes?.forEach((el) =>
      {
        if (el.nodeType === Node.TEXT_NODE && el.textContent === '')
          el.remove()
      })*/

      return true
    }

    function getTextNodesInRange(range: Range)
    {

    }

    function onInput(evt: InputEvent)
    {
      const range = getDocumentRange()
      if (!range)
        return

      if (!editor.value!.contains(range.commonAncestorContainer))
        return

      switch (evt.inputType)
      {
      /*case 'insertText':
      {
        //const node = store.getTextNode(range.startContainer)
        const node = store.getComponentTextNode(range.startContainer)
        if (!node)
          return
        //@ts-ignore
        node.proxy!.insertText(evt.data)

        break
      }*/
      case 'deleteContentBackward':
      {
        //const node = store.getTextNode(range.startContainer)
        const node = store.getComponentTextNode(range.startContainer)
        if (!node)
          return
        //@ts-ignore
        node.proxy!.removeText(evt.data)
        break
      }
      case 'insertParagraph':
      {
        //delete contents in-between range start and end
        //
        //get current text node or selection of text nodes
        //get surrounding effects
        //insert paragraph and split effects
        const node = store.getComponentTextNode(range.startContainer)
        if (!node)
          return

        const text = (<string>node.values.text);
        (<string>node.values.text) = text.substring(0, range.startOffset)

        const oldParagraph = node.parent!
        const parent = oldParagraph.component.parent

        let index = 0
        if (parent)
          index = parent.component.children.indexOf(oldParagraph.component) + 1
        else
          index = store.topLevelComponents.indexOf(oldParagraph.component) + 1

        //empty paragraph with <br> or <span>
        const newPara = store.addComponent('paragraph', { parentUUID: parent?.uuid, index: index })

        //console.log(index)
        const nextTextNode = store.addComponent('textnode', { parentUUID: newPara, values: { 'text': text.substring(range.endOffset) } })

        nextTick(() => //set cursor to begin of new line
        {
          const range = getDocumentRange()!
          const el = store.getComponentByID(newPara)!.proxy!.$el

          range.setStart(el, 0)
          range.setEnd(el, 0)
        })
        break
      }
      }
      //console.log('-----------------------------')
      console.log(evt)
      //console.log('=============================')
    }

    function applyBold()
    {
      if(applyElementEffect('strong'))
        effects.value.add('strong')
    }
    function applyItalic()
    {
      if(applyElementEffect('em'))
        effects.value.add('italic')
    }
    function applyHeading()
    {
      applyElementEffect('h1')
    }
    function applyUnderline()
    {
      if(applyElementEffect('u'))
        effects.value.add('underlined')
    }

    function applyUl()
    {
    }
    function applyOl()
    {}
    function undo()
    {}
    function redo()
    {}
    function addC()
    {
      //console.log('############################')
      store.addComponent('comp', { props: { say: 'Bye, World!' } })
      //console.log('****************************')
      //renders.value.push({ comp: comp, to: editor.value!, props: { say: "Bye, World!" } })
    }

    function onKey(evt: KeyboardEvent)
    {
      /*const range = getDocumentRange()
      if (!range)
        return

      if (/^.$/u.test(evt.key))
      {
        const node = store.getComponentTextNode(range.startContainer)
        if (!node)
          return
        //@ts-ignore
        node.proxy!.insertText(evt.key)
        evt.preventDefault()
      }*/
    }

    return {
      faBold, faItalic, faUnderline, faHeading, faListUl, faListOl, faUndo, faRedo,
      applyBold, applyItalic, applyUnderline, applyHeading, applyUl, applyOl, undo, redo, onKey,
      addC, editor,
      effects,
      onInput, store
    }
  }
})
</script>

<style lang="less">
.button {
  @apply tw-border-2;
  @apply tw-border-gray-300;
  @apply tw-rounded-lg;
  @apply tw-px-3 tw-py-1;
  @apply tw-mb-3 tw-mr-3;
}
.button:hover {
  @apply tw-border-green-300;
}

.active {
  color: lime;
}

</style>