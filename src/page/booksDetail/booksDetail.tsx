import {defineComponent, reactive, ref} from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { Icon, Space, Image, PullRefresh, Tag } from 'vant'
import Container from '../../components/container/container'
import http from '../../api'
import './booksDetail.scss'
import { useRequest } from '../../hooks'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const data = ref<any>({})
    const series = ref([])
    const loading = ref(false)

    const getData = () => {
      useRequest({
        url: '/books/detail',
        method: 'get',
        params: {
          id: route.query.id
        },
      }).then((res: any) => {
        loading.value = res.loading
        data.value = res.data
        console.log(res)
      })
      useRequest({
        url: '/volume/list',
        method: 'post',
        data: {
          page: 1,
          pageSize: 3,
          novel_id: route.query.id
        }
      }).then((res: any) => {
        // loading.value = res.loading
        series.value = res.data.list
        console.log(res)
      })
    }

    onBeforeRouteUpdate((to, from, next) => {
      console.log(to, from)
      next()
    })

    getData()

    return () => {
      return (
        <Container
          class='books-detail-container'
          headerProps={{
            title: data.value.name
          }}>
          <PullRefresh onRefresh={getData}>
            <Space direction='vertical' size={10}>
              <Space direction='horizontal' size={10} align="start">
                <Image src={data.value.cover} radius={5} width={140}></Image>
                <ul class="books-information">
                  <li>原名：{data.value.originalName}</li>
                  <li>作者：{
                    data.value.authors?.map((item: { name: string }) => {
                      return item.name
                    })
                  }</li>
                  <li>语言：{data.value.language?.name}</li>
                  <li>当前状态：{data.value.updateStatus}</li>
                  <li>当前卷数：{data.value.totalVolume}</li>
                </ul>
              </Space>
              <section class="books-description">
                <p>{data.value.description}</p>
              </section>
              <section class="books-series">
                <section>
                  <span>系列</span>
                  <div class="more" onClick={() => router.push(`/volumeList?id=${data.value.id}`)}>
                    <span>更多</span>
                    <Icon name="arrow" color='#999999'/>
                  </div>
                </section>
                <ul class='b-grid-list'>
                  {series.value.map((item: any) => {
                    return (
                      <li
                        key={item.id}
                        class='b-grid-list-item'
                        onClick={() => {
                          router.push(`/volumeDetail?id=${item.id}`)
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
              </section>
            </Space>
          </PullRefresh>
        </Container>
      )
    }
  },
})
