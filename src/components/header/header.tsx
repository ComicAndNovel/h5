import { PropType, defineComponent, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { Icon } from 'vant'
// import backSvg from "../../assets/icons/back.svg"
import './header.scss'

export interface HeaderProps {
  title?: string,
  shadow?: boolean
  background?: string
}

export const Header = defineComponent({
  props: {
    title: String as PropType<string>,
    shadow: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    background: String as PropType<string>
  },
  setup (props: HeaderProps, ctx) {
    const router = useRouter()
    const title = ref(props.title)

    watch(() => props.title, val => {
      title.value = val
    }, { immediate: true })

    console.log(props)
    return () => {
      return (
        <ul class="b-header-container" style={{
          background: props.background,
          boxShadow: props.shadow ? '0 2px 8px 0 rgba(0, 35, 144, 10%)' : 'none'
        }}>
          <li onClick={() => {
            router.go(-1)
          }}>
            <Icon name="arrow-left"></Icon>
          </li>
          <li class="title">{title.value}</li>
          <li>{ctx.slots.default?.()}</li>
        </ul>
      )
    }
  }
})