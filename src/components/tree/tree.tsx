import { defineComponent } from "vue"
import { useRouter } from "vue-router"
// import backSvg from "../../assets/icons/back.svg"
import './tree.scss'

export interface HeaderProps {
  title?: any[]
}

export const Tree = defineComponent({
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  setup (props, ctx) {
    const router = useRouter()

    const renderTree = (arr: any[], depth = 0) => {
      return (
        <ul class="b-tree" style={{
          marginLeft: depth * 15 + 'px'
        }}>
          {
            arr.map(item => {
              if (Array.isArray(item.children) && item.children.length !== 0) {
                return (
                  <ul class="b-tree" style={{
                    marginLeft: depth * 15 + 'px'
                  }}>
                    <li class="b-tree-item">{item.name}</li>
                    {renderTree(item.children, depth + 1)}
                  </ul>
                )
              } else {
                return (
                  <li class="b-tree-item">{item.name}</li>
                )
              }
            })
          }
        </ul>
      )
    }
    return () => {
      return (
        renderTree(props.data)
      )
    }
  }
})