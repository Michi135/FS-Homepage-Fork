import { watch, ref } from 'vue'
import type { Ref, WatchStopHandle, WritableComputedRef } from 'vue'

export interface RegisteredTranslationFunction 
{
    result: Ref<string>
    w: WatchStopHandle
}

export interface RegisteredTranslationFixed {
    result: Ref<string>
}

export type RegisteredTranslation = RegisteredTranslationFunction | RegisteredTranslationFixed

export function registerTranslation(f: () => string, locale: WritableComputedRef<string>): RegisteredTranslation
{
    const result = ref<string>(f());

    const w = watch(locale, () => {
        result.value = f();
    })

    return {
        result,
        w
    }
}

/*export function registerTranslation(value: string): RegisteredTranslationFixed
{
    const result = ref<string>(value);

    return {
        result
    }
}*/

export const rT = registerTranslation;