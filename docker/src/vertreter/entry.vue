<script lang="ts">
import { CreateElement, VNode } from "vue"
export default {
  props: {
    property: { type: String, default: "Property" },
    value: { type: String, default: "Value" },
    size: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },

  render: function (createElement: CreateElement): VNode {
    let text: string | VNode | VNode[] = (this.text || this.$slots.default) ?? ""
    let el = "span"
    let attrs = {}
    let props = {}
    // Remove any 'falsy' values from query
    // https://stackoverflow.com/questions/30812765/how-to-remove-undefined-and-null-values-from-an-object-using-lodash
    // Removing empty values ensures a reduction in any potential "duplicate content" issues with the default state

    const classes: Record<string, boolean> = {}

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

    //const on = this.$listeners
    return createElement(
      el,
      {
        class: classes,
        attrs,
        props,
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
