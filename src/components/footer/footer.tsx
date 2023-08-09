import { defineComponent, Fragment } from "vue"
import { useRoute, useRouter } from "vue-router"
import homeSvg from '../../assets/icons/home.svg'
import classSvg from '../../assets/icons/class.svg'
import mySvg from '../../assets/icons/my.svg'
import homeSelectSvg from '../../assets/icons/home-selected.svg'
import classSelectSvg from '../../assets/icons/class-selected.svg'
import mySelectSvg from '../../assets/icons/my-selected.svg'
import './footer.scss'


const icon = [
  {
    router: '/',
    icon: homeSvg,
    selected: homeSelectSvg
  },
  {
    router: '/index',
    icon: classSvg,
    selected: classSelectSvg
  },
  {
    router: '/my',
    icon: mySvg,
    selected: mySelectSvg
  },
]
export default defineComponent({
  setup () {
    const route = useRoute()
    const router = useRouter()

    return () => {
      return (
        <Fragment>
          <ul class="b-footer">
            {
              icon.map((item, index) => {
                return (
                  <li key={index} class="b-grid-list-item" onClick={() => {
                    router.push(item.router)
                  }}>
                    <img src={route.path === item.router ? item.selected : item.icon as string}></img>
                  </li>
                )
              })
            }
          </ul>
        </Fragment>
        
      )
    }
  }
})