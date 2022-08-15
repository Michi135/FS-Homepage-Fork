declare module '@vue/runtime-dom' {
	export interface GlobalComponents {
		component: <T>(props: { is: T } & ExtractComponentProps<T>) => JSX.Element
	}
}

type ExtractComponentProps<T> = T extends new (...args: any) => { $props: infer P } ? P : {};

import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    title?: string,
    favicon?: any
  }
}

export {}