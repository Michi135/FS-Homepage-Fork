<template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { registerEvent } from '@client/dynElements'

export default defineComponent({
    props: 
    {
        eventID: {
            type: String,
            required: true
        },
        value: {
            type: Object,
            required: true
        }
    },
    setup(props)
    {
        registerEvent(props.eventID, props.value)
    }
})
</script>