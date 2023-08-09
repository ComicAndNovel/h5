import { defineComponent, ref } from "vue"
import type { PropType } from 'vue'
import { useRouter } from "vue-router"
import './container.scss'
import { Header, HeaderProps } from "../../components/header/header"


export default defineComponent({
  props: {
    headerProps: Object as PropType<HeaderProps>
  },
  setup (props, ctx) {
    const { headerProps } = props

    return () => {
      return (
        <section class="b-container">
          <Header {...headerProps}></Header>
          <main class="b-main">
          { ctx.slots.default?.()}
          </main>
         
        </section>
      )
    }
  }
})
