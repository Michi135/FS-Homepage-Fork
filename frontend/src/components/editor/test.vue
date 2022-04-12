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
        @beforeinput.prevent="abc"
      >
        <component
          v-for="[k, v] in store.components"
          :key="k"
          :is="v.component"
          v-bind="{...v.props}"
        >
        </component>

        <!--template
          v-for="(render, i) in renders"
          :key="i"
        >

          <render :renderer="render"></render>
        </template-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable vue/no-unused-components */


import { ComponentOptions, defineComponent, getCurrentInstance, onMounted, onServerPrefetch, ref, watch, resolveComponent } from 'vue'
import { faBold } from '@fortawesome/free-solid-svg-icons/faBold'
import { faItalic } from '@fortawesome/free-solid-svg-icons/faItalic'
import { faUnderline } from '@fortawesome/free-solid-svg-icons/faUnderline'
import { faHeading } from '@fortawesome/free-solid-svg-icons/faHeading'
import { faListUl } from '@fortawesome/free-solid-svg-icons/faListUl'
import { faListOl } from '@fortawesome/free-solid-svg-icons/faListOl'
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo'
import { faRedo } from '@fortawesome/free-solid-svg-icons/faRedo'
import comp from './comp.vue'
//import { basename as pathBasename } from 'path'
//import { div } from './renderer'
import render, { CompWrapper } from './renders.vue'
import { useStore, Effects, EffectString, Elements, ComponentTree } from './store'

import type { Ref } from "vue"
import { storeToRefs } from 'pinia'

import para from './paragraph.vue'

import { randomUUID as nodeRandomUUID } from 'crypto'
import { textNode } from './renderer'

function randomUUID()
{
  return (__IS_SERVER__) ? nodeRandomUUID() : crypto.randomUUID()
}

//https://dev.to/thormeier/build-your-own-wysiwyg-markdown-editor-for-vue-318j
export default defineComponent({
  components: {
    comp,
    render,
    "paragraph": para,
    "textnode": textNode
  },
  setup()
  {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Example '
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'bold'
                }
              ],
              text: 'Text'
            }
          ]
        },
        {
          type: 'vueComponent',
          count: 200
        }
      ]
    }

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

    function traverseRange(range: Range, f: (node: Node) => boolean)
    {
      const start = (range.startContainer.nodeType === Node.TEXT_NODE) ? range.startContainer : range.startContainer.childNodes[range.startOffset]
      const end = (range.endContainer.nodeType === Node.TEXT_NODE) ? range.endContainer : range.endContainer.childNodes[range.endOffset - 1]

      let container: Node | null = start
      let tlContainer = range.startContainer

      if (f(container))
        return true

      while (container !== end)
      {
        const trav = traverseNode(container!, range.endContainer, f)
        if (trav.result)
          return true
        if (trav.abort)
          return false

        container = container!.nextSibling

        if (container === null)
        {
          tlContainer = tlContainer.parentNode!
          container = tlContainer
        }
        else if (f(container))
          return true
      }
      return false
    }

    interface traverse {
      result: boolean,
      abort: boolean
    }

    function traverseNode(node: Node, target: Node, f: (node: Node) => boolean): traverse
    {
      for (let child of node.childNodes)
      {
        if (child === target)
          return { result: false, abort: true }
        if (f(child))
          return { result: true, abort: false }
        const trav = traverseNode(child, target, f)
        if (trav.result || trav.abort)
          return trav
      }
      return { result: false, abort: false }
    }

    function adjustLeftSide(range: Range)
    {
      if (range.collapsed && range.startOffset === 0)
      {
        const prev = range.startContainer.previousSibling

        if (prev)
        {
          if (prev.nodeType === Node.TEXT_NODE)
            range.setStart(prev, 0)
          else
          {
            let node = prev
            while (node.lastChild)
              node = node.lastChild

            range.setStart(node, 0)
          }
        }
        else
        {
          let newParent = range.startContainer.parentElement!
          while (!newParent.previousSibling && newParent !== editor.value)
            newParent = newParent.parentElement!

          if (newParent !== editor.value)
          {
            let node: Node = newParent.previousSibling!
            while (node.lastChild)
              node = node.lastChild

            if (node.nodeType === Node.TEXT_NODE)
            {
              range.setStart(node, (<CharacterData>node).length)
              range.setEnd(node, (<CharacterData>node).length)
            }
            else
              range.setStart(node, 0)
          }
          else
            return false
        }
      }
      return true
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
      //console.log(editor.value)
      //console.log(getCurrentInstance()!.subTree!.children?.at(1).children.at(0)) //HTMLElement of editor content
      //console.log(getCurrentInstance())

      /*const instance = getCurrentInstance()

      if (typeof instance?.type.name === 'undefined')
      {
        const filestring = <string>instance!.type!.__file
        console.log(filestring.substring(filestring.lastIndexOf('/') + 1, filestring.indexOf('.vue')))
      }
      else
      {
        console.log(instance.type.name)
      }*/

      document.addEventListener('selectionchange', (ev) =>
      {


        const selection = window.getSelection()
        if (!selection)
          return

        //might be caret
        const range = selection.getRangeAt(0)

        updateEffect(range, new Map<Elements, Effects>([
          ['STRONG', 'strong'],
          ['EM', 'italic'],
          ['U', 'underlined']
        ]))
      })
    })

    const renders: Ref<CompWrapper[]> = ref(new Array<CompWrapper>())

    /*interface Wrapper {
        comp: ComponentOptions<any>,
        uuid: string,
        props?: Record<any, any> //ComponentPropsOptions
    }*/

    //const firstlevel: Ref<Wrapper[]> = ref(new Array<Wrapper>())

    onServerPrefetch(() =>
    {
      const uuid = randomUUID()
      const textNodeUUID = randomUUID()

      //const sub = store.components.set(textNodeUUID, { component: "textnode", children: new Map() })
      const subTree = ref<Map<string, ComponentTree>>(new Map<string, ComponentTree>([[textNodeUUID, { component: "textnode", children: new Map() }]]))

      store.compValues.set(uuid, {
        'text': ref('Hello, World!'),
        'subTree': subTree
      })

      store.components.set(uuid, { component: "paragraph", children: subTree.value, props: {
        'uuid': uuid
      } })

      /*      firstlevel.value.push({ comp: para, uuid, props: {
        'uuid': uuid
      } })*/
    })

    function applyElementEffect(tag: string)
    {
      const selection = window.getSelection()
      if (selection === null)
        return false

      //amount of ranges is always 1 per definition
      const range = selection.getRangeAt(0)
      //const oldSelection = range.commonAncestorContainer

      const element = document.createElement(tag)
      range.surroundContents(element)

      let content: Node = element
      while (content.firstChild)
        content = content.firstChild

      element.normalize()

      //range.selectNodeContents(content)
      //range.startContainer.parentElement?.parentElement?.normalize()
      /*.childNodes?.forEach((el) =>
      {
        if (el.nodeType === Node.TEXT_NODE && el.textContent === '')
          el.remove()
      })*/

      return true
    }

    function abc(evt: Event)
    {
      console.log('-----------------------------')
      console.log('captured')
      console.log(evt)
      console.log('=============================')
    }

    /*function applyElementEffect(tag: string)
    {
      //TODO edge cases where to multiple effects are overlapping
      //TODO edge cases where partialy effects exist
      //TODO edge cases where partial effects are overlapping

      const nodeTag = tag.toUpperCase()
      const selection = window.getSelection()

      if (selection === null)
        return

      //amount of ranges is always 1 per definition
      const range = selection.getRangeAt(0)

      const strongParent = range.commonAncestorContainer.parentElement!.nodeName === nodeTag

      if (range.startContainer === range.endContainer && (strongParent || (<HTMLElement>range.commonAncestorContainer).nodeName === nodeTag))
      {
        //if (range.commonAncestorContainer.nodeName === '#text' && )
        if (strongParent)
          range.selectNodeContents(range.commonAncestorContainer.parentElement!)

        const strongElement = <HTMLElement>range.commonAncestorContainer
        const point = strongElement.previousSibling
        const content = range.extractContents()

        if (point) //add to after previous sibling
        {
          if (strongElement.nextSibling?.nodeName === '#text')
          {
            content.textContent += strongElement.nextSibling.textContent!
            strongElement.nextSibling.remove()
          }

          if (point.nodeName === '#text') //join with prev sibling text
            point.textContent! += content.textContent!
          else //insert text after sibling node
            point.after(content)
        }
        else //add to parent
          strongElement.parentElement!.prepend(content)
        strongElement.remove()
      }
      else
      {
        const element = document.createElement(nodeTag)
        range.surroundContents(element)
        range.selectNodeContents(element)
      }
    }*/

    function applyBold()
    {
      if(applyElementEffect('strong'))
        effects.value.add('strong')

      /*const selection = window.getSelection()

      if (selection === null)
        return

      //amount of ranges is always 1 per definition
      const range = selection.getRangeAt(0)

      const strongParent = range.commonAncestorContainer.parentElement!.tagName === 'STRONG'

      if (range.startContainer === range.endContainer && (strongParent || (<HTMLElement>range.commonAncestorContainer).tagName === 'STRONG'))
      {
        //if (range.commonAncestorContainer.nodeName === '#text' && )
        if (strongParent)
          range.selectNodeContents(range.commonAncestorContainer.parentElement!)

        const strongElement = <HTMLElement>range.commonAncestorContainer
        const point = strongElement.previousSibling
        const content = range.extractContents()

        if (point) //add to after previous sibling
        {
          if (strongElement.nextSibling?.nodeName === '#text')
          {
            content.textContent += strongElement.nextSibling.textContent!
            strongElement.nextSibling.remove()
          }

          if (point.nodeName === '#text') //join with prev sibling text
            point.textContent! += content.textContent!
          else //insert text after sibling node
            point.after(content)
        }
        else //add to parent
          strongElement.parentElement!.prepend(content)
        strongElement.remove()
      }
      else
      {
        const element = document.createElement('strong')
        range.surroundContents(element)
        range.selectNodeContents(element)
      }*/
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
      console.log('############################')
      console.log(editor.value)
      console.log('****************************')
      renders.value.push({ comp: comp, to: editor.value!, props: { say: "Bye, World!" } })
    }

    const content = ref('Hello, World!')


    return {
      faBold, faItalic, faUnderline, faHeading, faListUl, faListOl, faUndo, faRedo,
      applyBold, applyItalic, applyUnderline, applyHeading, applyUl, applyOl, undo, redo,
      addC, renders, editor,
      content,
      effects,
      abc, store
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