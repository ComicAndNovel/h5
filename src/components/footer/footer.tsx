import { defineComponent, Fragment } from "vue"
import { useRoute, useRouter } from "vue-router"
import './footer.scss'


const icon = [
  {
    router: '/',
    name: '书籍'
  },
  {
    router: '/bookcase',
    name: '书架'

  },
  {
    router: '/my',
    name: '我的'
  },
]
export default defineComponent({
  setup () {
    const route = useRoute()
    const router = useRouter()

    return () => {
      return (
        <ul class="b-footer">
          {
            icon.map((item, index) => {
              return (
                <li key={index} class="b-grid-list-item" onClick={() => {
                  router.push(item.router)
                }}>
                  <span>{item.name}</span>
                </li>
              )
            })
          }
        </ul>
      )
    }
  }
})