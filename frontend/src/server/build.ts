import { Build } from './runtimeConfig'

const build = new Build(true).build().catch((e: any) =>
{
  console.error(e)
})