import { defineComponent, getCurrentInstance, onBeforeUpdate, onUpdated } from 'vue'
import { useStore } from './store'

/*const div = (props: { children: JSX.Element[]}) => {
    const { children } = props

    return <div>{ children.map((element, i) => (h(element))) }</div>
}

const paragraph = (props: { children: JSX.Element[], textAlign?: 'center' | 'end' }) => {
    const { children, textAlign } = props
    if (textAlign)
        return <p style={ 'text-align: ' + textAlign }>{ children }</p>;
    return <p>{ children }</p>;
}

const renderer = (props: { children: JSX.Element[] | ComponentOptions | ComponentOptions[] | JSX.Element }) => {
    const { children } = props

    if (Array.isArray(children))
    {
        return <>{ children.map((element, i) => (h(element))) }</>
    }
    else return <>{ h(children) }</>
}*/

const textNode = defineComponent({
    props: {
        uuid: {
            type: String,
            required: true
        }
    },
    setup(props){

        let oldRange: { startContainer: Node, start: number } | null = null

        onBeforeUpdate(() => {
            const range = document.getSelection()!.getRangeAt(0)
            if (range.startContainer.parentNode !== document.getElementById(getCurrentInstance()!.parent!.attrs.id as string))
                return
            
            oldRange = { startContainer: range.startContainer, start: range.startOffset}
            console.log('before:' + oldRange)
        })
        onUpdated(() => {
            if (!oldRange)
                return
            console.log('after:' + oldRange)
            const range = document.getSelection()!.getRangeAt(0)
            range.setStart(oldRange.startContainer, oldRange.start)
            range.setEnd(oldRange.startContainer, oldRange.start)

            oldRange = null
        })


        const store = useStore()
    
        //TODO:: secure ! assertion in store
        const compValues = store.compValues.get(props.uuid)!

        if (!compValues.text)
            compValues.text = ''
            
        return () => <>{compValues.text}</>
    }
})

export { textNode }