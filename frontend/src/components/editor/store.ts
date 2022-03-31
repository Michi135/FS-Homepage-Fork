import { defineStore } from 'pinia'
import { ComponentPublicInstance } from 'vue'
import { randomUUID as nodeRandomUUID } from 'crypto'

function randomUUID()
{
  return (__IS_SERVER__) ? nodeRandomUUID() : crypto.randomUUID()
}

export type HEADER_LEVEL = 1 | 2 | 3 | 4 | 5 | 6
export type HEADING = `H${HEADER_LEVEL}`

export type Effects = 'strong' | 'italic' | 'underlined'
export type Elements = 'STRONG' | 'EM' | 'U' | 'H1'
export interface EffectString extends Record<string, Effects> {
  'STRONG': 'strong',
  'EM': 'italic',
  'U': 'underlined'
}

export type ComponentTree = {
  parent?: string
  component: string
  children: Map<string, ComponentTree>
  props?: Record<any, any>
  attributes: Record<string, string>
  proxy?: ComponentPublicInstance
}

const defaultState: {
  effects: Set<Effects>
  pending: Elements | null
  compValues: Map<string, Record<any, any>>
  componentTree: Map<string, ComponentTree>
  components: Map<string, ComponentTree>
} = {
  effects: new Set<Effects>(),
  pending: null,
  compValues: new Map<string, {}>(),
  componentTree: new Map<string, ComponentTree>(),
  components: new Map<string, ComponentTree>()
}

export type State = typeof defaultState;

interface AddComponentParamsOptional {
  parentUUID: string,
  values: Record<any, any>,
  props: Record<any, any>
  attributes: Record<string, string>
}


export const useStore = defineStore('editor', {
  state: () => defaultState,
  actions: {
    //TODO:: infer types based on component
    addComponent(component: string, params?: Partial<AddComponentParamsOptional>)
    {
      const uuid = randomUUID()

      if (!params)
        params = {}

      const tree: ComponentTree =
      {
        component: component,
        parent: params.parentUUID,
        children: new Map<string, ComponentTree>(),
        props: { uuid: uuid, ...params?.props },
        attributes: { ['id']: uuid, ...params.attributes }
      }

      if (params.values)
      {
        this.compValues.set(uuid, params.values)
        //console.log(params.values)
      }

      if (params.parentUUID)
      {
        const parent = this.getComponentByID(params.parentUUID)!
        parent.children.set(uuid, tree)
      }
      else
      {
        this.componentTree.set(uuid, tree)
      }
      this.components.set(uuid, tree)

      return uuid
    }
  },
  getters: {
    getTextNode(state)
    {
      return (node: Node) =>
      {
        const children = state.components.get(node.parentElement!.id!)?.children
        if (!children)
          return

        const child = Array.from(children).find((el) =>
        {
          return el[1].proxy!.$el === node
        })
        if (!child)
          return

        return {
          id: child[0],
          child: child[1]
        }
      }
    },
    getValuesByID(state)
    {
      return (id: string) =>
      {
        return state.compValues.get(id)
      }
    },
    getComponentByID(state)
    {
      return (id: string) =>
      {
        return state.components.get(id)
      }
    }
  }
})

//export type DefaultStoreType = ReturnType<typeof createDefaultStore>;
export type DefaultStateType = State;