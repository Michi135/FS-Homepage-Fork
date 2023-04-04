import { useSSRContext } from "@shared/ssrContext.js"
import { onMounted, onBeforeUnmount, onServerPrefetch, watch, isRef, unref } from "vue"
import type { Ref, UnwrapRef } from 'vue'

type MaybeWatchSource<T> = T | Ref<T>

function trySetWatch<T>(data: T | Ref<T>, element: HTMLElement, fn?: (val: UnwrapRef<typeof data>) => string)
{
  if (!isRef(data))
    return

  watch(data, (val) =>
  {
    element!.innerHTML = (fn) ? fn(val) : <string><unknown>val
  })
}

export function makeScriptTag(id: string, type: string, content: string, nonce?: string)
{
  let element = document.createElement('script')

  element.id = id
  element.type = type

  if (nonce)
    element.nonce = nonce

  element.innerHTML = content
  return element
}

export function addTagToHead(element: HTMLElement)
{
  const head = document.querySelector('head')!
  head.appendChild(element)
}

function cleanup(element: HTMLElement)
{
  onBeforeUnmount(() =>
  {
    element.remove()
  })
}

export function registerStyle(id: string, data: MaybeWatchSource<string>)
{
  let element: HTMLStyleElement | null

  onMounted(() =>
  {
    element = <HTMLStyleElement | null>document.getElementById(id)

    if (!element)
    {
      element = document.createElement('style')
      element.id = id
      element.innerHTML = unref(data)

      addTagToHead(element)
    }
    trySetWatch(data, element)
  })
  onBeforeUnmount(() =>
  {
    element!.remove()
  })
  onServerPrefetch(() =>
  {
    const ctx = useSSRContext()
    const val = unref(data)

    //if (ctx.styles[id])
    //ctx.styles[id].push(data)
    //else
    ctx.styles[id] = val
  })
}