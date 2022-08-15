import { WithContext, Event } from "schema-dts"
import { useSSRContext as useVueContext } from "vue"
import type { SSRContext as VueContext } from "@vue/server-renderer"

export type SSRContext =
{
    styles: Record<string, string>
    //id, event
    events: Record<string, WithContext<Event>>
    title?: string
    favicon?: string
    nonce: string
} & VueContext

export function ensureContext(context: any)
{
  if (!context)
    context = {}

  if (!context.styles)
    Object.assign(context, { styles: {} })
  if (!context.events)
    context.events = {}
  if (!context.nonce)
    Object.assign(context, { nonce: "" })

  return <SSRContext>context
}

export function useSSRContext()
{
  let context = useVueContext<Partial<SSRContext>>()
  return ensureContext(context)
}

export function registerEvent(id: string, event: WithContext<Event>)
{
  let context = useSSRContext()
  if (!context.events[id])
    context.events[id] = event
  else
    console.error("Event already registered with id: " + id)
}