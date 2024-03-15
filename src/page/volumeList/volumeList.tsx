import {defineComponent, reactive, ref} from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import {List, Space, Image, PullRefresh} from 'vant'
import Container from '../../components/container/container'
import http from '../../api'
import './volumeList.scss'
import Footer from '../../components/footer/footer'
import { useRequest } from '../../hooks'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const data = ref<any[]>([])
    const refreshing = ref(false)
    const loading = ref(false)
    const finished = ref(false)
    const currentPage = ref(1)

    const getData = (page = 1) => {
      loading.value = true
      useRequest({
        url: '/volume/list',
        method: 'post',
        data: {
          page: 1,
          pageSize: 20,
          novel_id: route.query.id
        }
      })
        .then((res: any) => {
          if (page === 1) {
            data.value = res.data.list
          } else {
            data.value.push(...res.data.list)
          }
          if (data.value.length >= res.data.total) {
            finished.value = true
          }
          currentPage.value = page
        })
        .finally(() => {
          if (refreshing.value) {
            refreshing.value = false
          }
          loading.value = false
        })
    }

    getData()

    onBeforeRouteUpdate((to, from, next) => {
      console.log(to, from)
      next()
    })

    const onLoad = () => {
      // getData(currentPage.value + 1)
    }

    const refresh = () => {
      refreshing.value = true
      getData()
    }

    return () => {
      return (
        <Container
          class='b-index-container'
          headerProps={{
            title: '卷列表'
          }}>
          <PullRefresh model-value={refreshing.value} onRefresh={refresh}>
            <List
              loading={loading.value}
              finished={finished.value}
              finished-text='没有更多了'
              onLoad={onLoad}
              immediate-check={false}>
              <ul class='b-grid-list'>
                {data.value.map((item, index) => {
                  return (
                    <li
                      key={index}
                      class='b-grid-list-item'
                      onClick={() => {
                        router.push(`/booksDetail?id=${item.id}`)
                      }}>
                      <Space direction='vertical' size={0}>
                       
                        <Image
                          src={item.cover}
                          radius={4}
                          class='novel-poster'></Image>
                        <span>{item.name}</span>
                      </Space>
                    </li>
                  )
                })}
              </ul>
            </List>
          </PullRefresh>
        </Container>
      )
    }
  }
})
