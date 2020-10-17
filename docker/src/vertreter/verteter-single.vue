<script lang="ts">
import { CreateElement, VNode } from "vue"
import { pickBy, isEmpty, emitEvent, identity } from "@factor/api"
import { applyFilters } from "@factor/api/hooks"
export default {
  props: {
    image: { type: Image, default: null },
    properties: { type: [Array, String], default: null },
    size: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },

  render: function (createElement: CreateElement): VNode {
    let path = this.path
    let text: string | VNode | VNode[] = (this.text || this.$slots.default) ?? ""
    let el = "span"
    let attrs = {}
    let props = {}
    const route = this.$route ?? {}
    const routePath = route.path ?? ""
    const routeMeta = route.meta ?? {}
    // Remove any 'falsy' values from query
    // https://stackoverflow.com/questions/30812765/how-to-remove-undefined-and-null-values-from-an-object-using-lodash
    // Removing empty values ensures a reduction in any potential "duplicate content" issues with the default state

    const query = pickBy(this.query, identity) || {}

    if (!path && !isEmpty(query) && route) {
      path = route.path
    }

    // Allow for global customization
    path = applyFilters("link-path", path.trim(), { query })

    const classes: Record<string, boolean> = {}

    classes["factor-link"] = true

    if (this.btn) {
      classes[`btn-link`] = true

      const passed = {
        btn: this.btn,
        disabled: this.disabled,
        size: this.size,
        loading: this.loading,
      }

      text = createElement(
        {
          props: passed,
        },
        [text]
      )
    }

    if (this.disabled) {
      classes["disabled"] = true
    }

    if (routePath == this.path || routeMeta.activePath == this.path) {
      classes["active-path"] = true
    }

    const on = this.event
      ? {
          click: (e: Event) => {
            e.preventDefault()

            emitEvent(this.event, query)

            return false
          },
        }
      : this.$listeners

    // Native only valid on components.
    const nativeEvents = el == "a" || el == "span" ? {} : { nativeOn: on }

    //const on = this.$listeners
    return createElement(
      el,
      {
        class: classes,
        attrs,
        props,
        on,
        ...nativeEvents,
      },
      [text]
    )
  },
}
</script>

<style lang="less">
.factor-link {
  cursor: pointer;
  &.disabled {
    cursor: not-allowed;
    pointer-events: none; // Future-proof disabling of clicks
  }
  &.btn-link {
    color: inherit;
    display: inline-block;
    line-height: 1;
  }
}
</style>
