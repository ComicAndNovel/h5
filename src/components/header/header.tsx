import { PropType, defineComponent, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { Icon, ConfigProvider } from 'vant'
// import backSvg from "../../assets/icons/back.svg"
import './header.scss'

export interface Tabs {
  id?: string | number
  name?: string | number
}

export interface HeaderProps {
  title?: any,
  shadow?: boolean
  background?: string
  back?: boolean
  tab?: boolean
  tabProps?: any
  active?: number | string
  tabs?: Tabs[]
  onClick?: (id?: string) => void
}

export const Header = defineComponent({
  props: {
    tabProps: {
      type: Object as PropType<any>
    },
    back: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    tab: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    tabs: {
      type: Array as PropType<Tabs[]>
    },
    shadow: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    active: [String, Number] as PropType<string | number>,
    title: [String, Object] as PropType<string | object>,
    background: String as PropType<string>
  },
  emits: ['click'],
  setup (props, ctx) {
    const router = useRouter()
    const title = ref(props.title)
    // const active = ref(props.active)

    watch(() => props.title, val => {
      title.value = val
    }, { immediate: true })

    return () => {
      return (
        <section class="b-header-container" style={{
          background: props.background,
          boxShadow: props.shadow ? '0 2px 8px 0 rgba(0, 35, 144, 10%)' : 'none'
        }}>
          <ul class="header">
            {
              props.back ? (
                <li onClick={() => {
                  router.go(-1)
                }}>
                  <Icon name="arrow-left"></Icon>
                </li>
              ) : <li></li>
            }
            <li class="title">{props.title}</li>
            <li>{ctx.slots.default?.()}</li>
          </ul>
          {
            props.tabs ? (
              <ul class="b-header-tabs">
                {
                  props.tabs?.map(item => {
                    return <li 
                      class={{
                        active: props.active === item.id
                      }}
                      onClick={() => {
                        props.onClick?.(item.id)
                        ctx.emit('click', item.id)
                      }}>
                        {item.name}
                      </li>
                  })
                }
            </ul>
            ) : null
          }
        </section>
       
      )
    }
  }
})