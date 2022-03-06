declare module "*.vue" {
  import type { ComponentOptions } from "vue"
  const component: ComponentOptions
  export default component
}

declare module '*.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames;
}

declare module '*.less' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames;
}

declare module "*.jpg" {
  const value: any
  export = value;
}

declare module "*.png" {
  const value: any
  export = value;
}

declare module "*.svg" {
  const value: any
  export default value
}

declare module "*.pdf" {
  const value: any
  export default value
}

declare module "*.html" {
  const value: any
  export default value
}

declare module "*.module.css" {
  const value: any
  export default value
}