import type { Ref } from "vue"

export interface Manager
{
    tagData: Map<string, Ref<any>>
    //TODO:: maybe make client side only
    mountedScripts: Map<string, HTMLScriptElement>
    nonce?: string
}