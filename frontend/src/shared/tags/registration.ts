import { onMounted, onBeforeUnmount, onServerPrefetch,
  ref, inject, watch } from "vue"
import type { InjectionKey, App, Ref } from "vue"
import { makeScriptTag, addTagToHead } from '@client/dynElements.js'
import { isRef } from "vue"

import type { Manager } from "./types.js"

const key = Symbol() as InjectionKey<Manager>

export function createTagManager(nonce?: string)
{

  const data: Manager = { tagData: new Map(), mountedScripts: new Map(), nonce }
  return {
    install: (app: App) =>
    {
      app.provide(key, data)
    },
    data
  }
}

function addEvent(tags: Manager, key: string, data: Ref<any>)
{
  let element = <HTMLScriptElement | null>document.getElementById(key)
  if (!element)
  {
    element = makeScriptTag(key, "application/ld+json", JSON.stringify(data.value), tags.nonce)
    addTagToHead(element)
  }
  tags.mountedScripts.set(key, element)

  watch(data, (newData) =>
  {
    //TODO::test; Maybe invalid key here?
    element!.innerHTML = JSON.stringify(newData)
  })
}

export function useTags()
{
  let isClient = true

  const tags = inject(key)
  if (!tags)
  {
    console.error("Injecting tags failed")
  }
  else
  {
    onMounted(() =>
    {
      tags.tagData.forEach((data, key) =>
      {
        addEvent(tags, key, data)
      })
    })
    onBeforeUnmount(() =>
    {
      tags.mountedScripts.forEach((el) =>
      {
        el.remove()
      })
    })
    onServerPrefetch(() =>
    {
      isClient = false
    })
  }

  return {
    try_emplace: (tags) ? function<T>(key: string, data: T | Ref<T>)
    {
      if (tags.tagData.has(key))
        return

      const wrappedData = isRef(data) ? data : ref(data)

      tags.tagData.set(key, wrappedData)

      if (isClient)
        addEvent(tags, key, wrappedData)
    } : function ()
    {}
  }
}