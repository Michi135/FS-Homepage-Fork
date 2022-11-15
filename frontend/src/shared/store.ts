import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import defFav from '@static/favicon.svg'

export type State = ReturnType<typeof useStore>['$state']

export const useStore = defineStore('main', () =>
{
  const defaultFavicon = ref(defFav)
  const defaultTitle = ref("FSMPI")
  const initialTime = ref(new Date())
  const isUniNetwork = ref(false)
  const nonce = ref("")

  return {
    //vars
    defaultFavicon,
    defaultTitle,
    initialTime,
    isUniNetwork,
    nonce
    //computed
  }
})

//export type DefaultStoreType = ReturnType<typeof createDefaultStore>;
export type DefaultStateType = State;