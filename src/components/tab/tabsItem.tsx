import { defineComponent, inject, watch } from 'vue'
import type { PropType } from 'vue'
import { ProvideOptions } from './tab'
import './tab.scss'

export const TabsItem = defineComponent({
  props: {
    id: {
      type: [Number, String] as PropType<number | string>,
      required: true
    },
    name: String
  },
  emits: ['tabClick'],
  setup (props, ctx) {
    const { emit } = ctx
    const tab = inject<ProvideOptions>('tab')

    watch(
      () => tab!.active, 
      (id) => {
       emit('tabClick', id.value)
      })

    const tabClick = () => {
      emit('tabClick', props.id)
    }

    return () => {
      return (
        <li class={['b-tab-item', {
          active: tab?.active.value === props.id
        }]} onClick={tabClick}>
          <span>{props.name}</span>
          {/* {ctx.slots.default?.()} */}
        </li>
      )
    }
  }
})
