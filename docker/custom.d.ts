declare module "*.vue" {
  import { defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent>;
  export default component;
}

declare module '*.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.less' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module "*.jpg" {
  const value: any;
  export = value;
}

declare module "*.svg" {
  const value: any;
  export default value
}

declare module "*.pdf" {
  const value: any;
  export default value
}

declare module "*.html" {
  const value: any;
  export default value
}

declare module "*.module.css" {
  const value: any;
  export default value
}

//import { createDefaultStore } from './shared/store'

/*
declare module "vuex" {
  type DefaultStore = ReturnType<typeof createDefaultStore>;
  type Inner<T> = T extends Store<infer I> ? I : never;
  type sth = Inner<DefaultStore>
  function useStore<T = DefaultStore>(key = {}): T;
  function useStore<S = sth>(): Store<S>;
}*/