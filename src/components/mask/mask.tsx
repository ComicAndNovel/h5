import { defineComponent } from 'vue'
import './mask.scss'

export const Mask = defineComponent({
  props: {
    show: Boolean
  },
  emits: ['close'],
  setup (props, ctx) {
    const { emit } = ctx

    const close = () => {
      console.log('1')
      emit('close')
    }

    return () => {
      return props.show ? (
        <section class="b-mask-container" onClick={close}>
          {ctx.slots.default?.()}
        </section>
      ) : null
    }
  }
})