import { Build } from './runtimeConfig'

const build = new Build(false).build().catch((e: any) =>
{
  console.error(e)
})