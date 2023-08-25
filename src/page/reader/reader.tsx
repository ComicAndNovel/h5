import { defineComponent, ref, reactive, onMounted } from 'vue'
import { PageFlip } from 'page-flip'
import http from '../../api'
import './style.scss'

export default defineComponent({
  setup () {
    const html = ref()
    const data = reactive({
      data: []
    })

    const getData = () => {
      const fd = new FormData()
      
      fd.append('file', "1");
      http({
        url: '/reader/upload',
        method: 'post',
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
        data: fd
      }).then(res => {
        data.data = res.data.list
        // html.value = res.data[0].content
        console.log(res)
      })
    }

    getData()
    onMounted(() => {
        const el = document.querySelector('.book') as HTMLElement
        console.log(el.offsetHeight)
        const pageFlip = new PageFlip(el, {
          width: el.offsetWidth,
          height: el.offsetHeight,
          // 阴影透明度
          maxShadowOpacity: 0.5,
          // 翻转动画过渡时间
          flippingTime: 300
        }).loadFromHTML(document.querySelectorAll('.page'))
    })
  
    
    return () => {
      return (
        <section class="b-reader-container">
          <header class="b-reader-header"></header>
          <section class="book" ref={html}>
            {
              data.data.map((item: any, index) => {
                return (
                  <section class="page" data-density="soft" v-html={item.content}>
                    {index}
                    <br/>
                    {item.content}
                  </section>
                )
              })
            }        
          </section>
          <footer class="b-reader-footer">
            <ul>
              <li>目录</li>
              <li>夜间</li>
            </ul>
          </footer>
        </section>
      )
    }
  }
})
