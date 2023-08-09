import { defineComponent, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { List, Space, Image, PullRefresh } from 'vant'
import Container from "../../components/container/container"
import http from "../../api"
import './home.scss'

export default defineComponent({
  setup () {
    const router = useRouter()
    const data = ref<any[]>([])
    const refreshing = ref(false)
    const loading = ref(false)
    const finished = ref(false)
    const currentPage = ref(1)

    const getData = (page = 1) => {
      loading.value = true
      http({
        url: '/novel/novelList',
        method: 'post',
        data: {
          page: page        
        }
      }).then((res) => {
          if (page === 1) {
            data.value = res.data.list
          } else {
            data.value.push(
              ...res.data.list
            )
          }
          if (data.value.length >= res.data.total) {
            finished.value = true
          }
          currentPage.value = page
      }).finally(() => {
        if (refreshing) {
          refreshing.value = false
        }
        loading.value = false
      })
    }

    getData()

    const onLoad = () => {
      getData(currentPage.value + 1)
    }

    const refresh = () => {
      refreshing.value = true
      getData()
    }
    getData()

    return () => {
      return (
        <Container 
          class="b-index-container"
          headerProps={{
            title: '首页'
          }}>
          <PullRefresh model-value={refreshing.value} onRefresh={refresh}>
            <List
              loading={loading.value}
              finished={finished.value}
              finished-text="没有更多了"
              onLoad={onLoad}
              immediate-check={false}
            >
              <ul class="b-grid-list">
                {
                  data.value.map((item, index) => {
                    return (
                      <li key={index} class="b-grid-list-item" onClick={() => {
                        // router.push(`/bangumiDetail?id=${item.id}`)
                      }}>
                        <Space direction="vertical">
                          <Image src={item.cover} radius={4}></Image>
                          <span>{item.name}</span>
                        </Space>
                      </li>
                    )
                  })
                }
              </ul>
            </List>
          </PullRefresh>
        </Container>
      )
    }
  }
})