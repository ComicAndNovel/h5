import { defineComponent, ref, watch, onMounted } from "vue"
import type { PropType } from 'vue'
import { useRouter } from "vue-router"
import './container.scss'
import { Header, HeaderProps } from "../../components/header/header"
import Footer from "../footer/footer"


export default defineComponent({
  props: {
    headerProps: Object as PropType<HeaderProps>,
    headerSlots: Object,
    footer: Boolean,
    marginTop: {
      type: Number,
      default: 60
    }
  },
  emits: ['click'],
  setup (props, ctx) {

    const headerRef = ref()
    const footerRef = ref()
    const marginTop = ref(0)
    const marginBottom = ref(0)

    // onMounted(() => {
    //   if (headerRef.value) {
    //     marginTop.value = headerRef.value.$el.offsetHeight || 60
    //     marginBottom.value = footerRef.value.$el.offsetHeight || 0
    //   }
    // })

    return () => {
      return (
        <section class="b-container">
          <Header 
            {...props.headerProps} 
            v-slots={props.headerSlots}
            ref={headerRef}
            onClick={(id) => {
              ctx.emit('click', id)
            }}></Header>
          <main class="b-main" style={{
            marginTop: props.marginTop + 'px',
            marginBottom: props.footer ? '60px' : '0px',
            overflow: 'auto'
          }}>
          { ctx.slots.default?.()}
          </main>
          <section >
            {props.footer ? <Footer ref={footerRef}></Footer> : null}
          </section>
        </section>
      )
    }
  }
})
