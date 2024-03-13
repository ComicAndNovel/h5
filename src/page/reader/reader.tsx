import {defineComponent, ref, reactive, onMounted } from 'vue'
import {PageFlip} from 'page-flip'
import {useRoute, useRouter} from 'vue-router'
import {Tree} from '../../components/tree/tree'
import http from '../../api'
import './style.scss'
import { Popup, Icon, Loading } from 'vant'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const html = ref()
    const show = ref(false)
    const data = reactive({
      toc: [],
      content: '',
      page: 1,
      total: 0,
      loading: false
    })

    const getData = (page = 1) => {
      data.loading = true
      http({
        url: '/volume/content',
        method: 'get',
        params: {
          id: route.query.id,
          page,
          pageSize: 1,
        },
      }).then((res) => {
        data.content = res.data.list?.[0]?.content
        data.page = res.data.page
        data.total = res.data.total
        data.loading = false
        // html.value = res.data[0].content
        console.log(res.data.page, data.page)
      })
    }

    getData()
    const pagination = (type: 'prev' | 'next') => {
      switch (type) {
        case 'prev':

            if (data.page > 0) {
              getData(data.page - 1)
            }
          break
        case 'next':
            if (data.page < data.total) {
              getData(data.page + 1)
            }
          break
      }
    }
    // onMounted(() => {
    //     const el = document.querySelector('.book') as HTMLElement
    //     console.log(el.offsetHeight)
    //     const pageFlip = new PageFlip(el, {
    //       width: el.offsetWidth,
    //       height: el.offsetHeight,
    //       // 阴影透明度
    //       maxShadowOpacity: 0.5,
    //       // 翻转动画过渡时间
    //       flippingTime: 300
    //     }).loadFromHTML(document.querySelectorAll('.page'))
    // })

    return () => {
      return (
        <>
          <section class="books-reader-container">
            {/* 目录 */}
            <ul class="books-reader-header">
              <li onClick={() => {
                router.go(-1)
              }}>
                <Icon name="arrow-left"></Icon>
              </li>
              <li class="header-title">阅读</li>
              <li></li>
            </ul>
            <section class="reader-container">
              <section class='book' ref={html}>
                {
                  data.loading ? (
                    <Loading size="24px" vertical></Loading>
                  ) : (
                    <section class='page' data-density='soft' v-html={data.content}></section>
                  )
                }
              </section>
            </section>
            <footer class='b-reader-footer'>
                <ul>
                  <li onClick={() => pagination('prev')}>上一页</li>
                  <li onClick={() => pagination('next')}>下一页</li>
                </ul>
              </footer>
          </section>
         <Popup
            show={show.value}
            onUpdate:show={() => {
              show.value = false
            }}
            onClickOverlay={() => {
              console.log(1)
              show.value = false
            }}
            position='left'
            style={{
              width: '75%',
              height: '100vh',
            }}>
            <section class='toc-container'>
              <Tree data={data.toc}></Tree>
            </section>
          </Popup>
        </>
      )
    }
  },
})
