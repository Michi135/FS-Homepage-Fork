<template>
  <div v-html="html"></div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import { Component, createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { DocumentRenderer } from '@keystone-6/document-renderer'

import { useRoute, useRouter } from 'vue-router'

import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'

import { useQuerySSR } from '@shared/vue-apollo-ssr'
import { GenericDocumentRenderer } from '../document-renderer'

import type { Ref } from 'vue'
import type { Element } from '../document-renderer'

interface Result {
  posts: Array<{
    content: {
      document: Array<Element>
    }
  }>,
  post: {
    content: {
      document: Array<Element>
    }
  } | null
}

class Editor extends Component
{
  render()
  {
    //@ts-ignore
    //return createElement(DocumentRenderer, {document: ''})
    return createElement('div')
    //(<DocumentRenderer document={document} />)
  }
}

export default defineComponent({
  setup()
  {
    const mok: Ref<undefined | Array<Element>> = ref(undefined)
    const router = useRouter()
    const res = useQuery<Result>(gql`
      query getPost($id: ID!)
      {
        post(where: {id: $id})
        {
          content {document}
        }
      }
    `, { id: useRoute().params.id }, { errorPolicy: 'all' })

    let html = ref<string>("")

    useQuerySSR(() =>
    {
      //console.log(res.result.value)

      if (res.result.value!.post)
      {
        mok.value = res.result.value!.post.content.document
        console.log(mok.value)
        //@ts-ignore
        html.value = renderToString(createElement(DocumentRenderer, { document: mok.value }))
      }
      else
        router.replace('/404')
    }, res)

    //html = renderToString(createElement('div'))

    return { html }
  }
})
</script>