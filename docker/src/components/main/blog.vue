<template>
    <div id="block">
        <div class="tw-m-3.5">
            <div style="max-width: 1100px; margin: 0 auto">
                <doc v-if="mok !== undefined" :document="mok"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { Ref } from 'vue'

import { GenericDocumentRenderer, Element } from '../document-renderer'

import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { useQuerySSR } from '@shared/vue-apollo-ssr'

interface Result {
    posts: Array<{
        content: {
            document: Array<Element>
        }
    }>
}

export default defineComponent({
    components: {
        doc: GenericDocumentRenderer()//DocumentRenderer()
    },
    setup() {

        const mok: Ref<undefined | Array<Element>> = ref(undefined);

        const res = useQuery<Result>(gql`
        {
            posts{
                content
                {
                document
                }
            }
        }`)

        useQuerySSR(() => 
        { 
            mok.value = res.result.value!.posts[0].content.document
        }, res)

        return {
            mok
        }
    },
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
    li, ul {
        margin-left: 20px;
        color: #f1f1f1;
    }
    p {
        text-align: justify;
        color: #f1f1f1;
    }
}
</style>