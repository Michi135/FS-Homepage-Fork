import type { Ref } from 'vue'
import type { JSDOM } from 'jsdom'

function addEvents(dom: JSDOM, events: Map<string, Ref<any>>, nonce?: string)
{
  const doc = dom.window.document
  const head = doc.head

  events.forEach((value, key) => {
    const node = doc.createElement('script')
    node.id = key
    node.type = "application/ld+json"
    node.innerHTML = JSON.stringify(value.value)

    if (nonce)
      node.nonce = nonce
    head.append(node)
  })
}

export {
    addEvents as default,
    addEvents
}