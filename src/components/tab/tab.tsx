import { defineComponent, provide, watch, ref, Ref } from 'vue'
import { TabsItem } from './tabsItem'
import type { PropType } from 'vue'
import './tab.scss'

export interface ProvideOptions {
  active: Ref<string | number>
}
export const Tabs = defineComponent({
  props: {
    modelValue: {
      type: [Number, String] as PropType<number | string>,
      required: true
    },
  },
  emits: ['onChange'],
  setup (props, ctx) {
    const id = ref(props.modelValue)

    watch(
      () => props.modelValue, 
      (val) => {
        id.value = val
        console.log(id.value)
      })

    provide('tab', {
      active: id
    })

    const tabClick = (e: any) => {
    }

    return () => {
      const children = ctx.slots.default?.()

      return (
        <section class="b-tab-container">
          <ul class="b-tab-header" onClick={(e) => tabClick(e)}>
            {
              children?.map((item, index) => {
                return item
              })
            }
          </ul>
          <div class="b-tab-border"></div>
          <section class="b-tab-content">
          {
              children?.map((item, index) => {
                const vnode = (item.children as any)?.[index]
                return vnode?.children?.default()
              })
            }
          </section>
        </section>
        
      )
    }
  }
})


export * from './tabsItem'