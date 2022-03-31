<template>
  <div id="block">
    <div class="tw-m-3.5">
      <div style="max-width: 1100px; margin: 0 auto">
        <doc
          v-if="mok !== undefined"
          :document="mok"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
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

export default defineComponent({
  components: {
    doc: GenericDocumentRenderer()
  },
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

    useQuerySSR(() =>
    {
      //console.log(res.result.value)

      if (res.result.value!.post)
        mok.value = res.result.value!.post.content.document
      else
        router.replace('/404')
    }, res)

    return {
      mok
    }
  }
})
</script>

<style lang="less">
#block {
  h3 {
    font-size: 2rem;
    color: var(--color-primary-header);
  }
  h2 {
    font-size: 1.5rem;
    color: var(--color-primary-header);
  }
  h1 {
    font-size: 1.2rem;
    color: var(--color-secondary-header);
  }
  .a {
    color: lightblue;
  }
  .a:hover {
    color: var(--color-primary);
  }
  li,
  ul {
    margin-left: 20px;
    color: #f1f1f1;
  }
  p {
    text-align: justify;
    color: #f1f1f1;
  }
}
</style>
