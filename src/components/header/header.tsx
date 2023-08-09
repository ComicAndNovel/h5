import { defineComponent } from "vue"
import { useRouter } from "vue-router"
// import backSvg from "../../assets/icons/back.svg"
import './header.scss'

export interface HeaderProps {
  title?: string
}

export const Header = defineComponent({
  props: {
    title: String
  },
  setup (props, ctx) {
    const router = useRouter()

    console.log(props)
    return () => {
      return (
        <ul class="b-header-container">
          <li onClick={() => {
            router.go(-1)
            // setTimeout(() => {
            //   location.reload()
            // })
          }}>
          </li>
          <li class="title">{props.title}</li>
          <li>{ctx.slots.default?.()}</li>
        </ul>
      )
    }
  }
})