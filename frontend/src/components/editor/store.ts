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

type ExtractComponentProps<T> = T extends new (...args: any) => { $props: infer P } ? P : {};

export type Component<T = any> = {
  uuid: string
  parent?: {
    uuid: string,
    component: Component
  }
  component: string
  children: Array<Component>
  props?: Record<any, any>
  attributes: Record<string, string>
  proxy?: ComponentPublicInstance,
  values: Record<any, any>
}

/*export interface NextNode extends ComponentTree {

}*/

const defaultState: {
  effects: Set<Effects>
  pending: Elements | null
  //compValues: Map<string, Record<any, any>>
  topLevelComponents: Array<Component>
  components: Map<string, Component>
  nodes: Map<Node, Component>
} = {
  effects: new Set<Effects>(),
  pending: null,
  //compValues: new Map<string, {}>(),
  topLevelComponents: new Array<Component>(),
  components: new Map<string, Component>(),
  nodes: new Map<Node, Component>()
}

export type State = typeof defaultState;

interface AddComponentParamsOptional {
  parentUUID: string
  values: Record<any, any>
  props: Record<any, any>
  attributes: Record<string, string>
  index: number //check index
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

      const tree: Component =
      {
        uuid: uuid,
        component: component,
        parent: (params.parentUUID) ? {
          uuid: params.parentUUID,
          component: this.components.get(params.parentUUID)!
        } : undefined,
        children: [],
        props: { uuid: uuid, ...params?.props },
        attributes: { ['id']: uuid, ...params.attributes },
        values: { ...params.values }
      }

      /*if (params.values)
      {
        this.compValues.set(uuid, params.values)
        //console.log(params.values)
      }*/

      if (params.parentUUID)
      {
        const parent = this.getComponentByID(params.parentUUID)!
        if (!params.index)
          parent.children.push(tree)
        else
          parent.children.splice(params.index, 0, tree)
      }
      else
      {
        if (!params.index)
          this.topLevelComponents.push(tree)
        else
          this.topLevelComponents.splice(params.index, 0, tree)
      }
      this.components.set(uuid, tree)

      return uuid
    }
  },
  getters: {
    getComponentTextNode(state)
    {
      return (node: Node) =>
      {
        return this.nodes.get(node)
      }
    },
    /*getTextNode(state)
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
    },*/
    /*getValuesByID(state)
    {
      return (id: string) =>
      {
        return state.compValues.get(id)
      }
    },*/
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