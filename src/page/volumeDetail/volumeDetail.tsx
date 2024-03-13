import {defineComponent, reactive, ref} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon, Space, Image, PullRefresh, Button } from 'vant'
import Container from '../../components/container/container'
import { useRequest } from '../../hooks'
import './volumeDetail.scss'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const data = ref<any>({})
    const series = ref([])
    const loading = ref(false)

    const getData = () => {
      useRequest({
        url: '/volume/detail',
        method: 'get',
        params: {
          id: route.query.id
        },
      }).then((res: any) => {
        loading.value = res.loading
        data.value = res.data
        useRequest({
          url: '/volume/list',
          method: 'post',
          data: {
            page: 1,
            pageSize: 3,
            novel_id: res.data.novelId
          }
        }).then((res: any) => {
          series.value = res.data.list
        })
      })
    }

    getData()

    return () => {
      return (
        <Container
          class='books-detail-container'
          headerProps={{
            title: data.value.name,
          }}>
          <PullRefresh onRefresh={getData}>
            <Space direction='vertical' size={15}>
              <Space direction='horizontal' size={10} align="start">
                <Image src={data.value.cover} radius={10} width={140}></Image>
                <section class="column-space-between" style={{
                  height: '205px'
                }}>
                  <ul class="books-information">
                    {/* <li>{data.value.name}</li> */}
                    <li>原名：{data.value.originalName}</li>
                    <li>ISBN：{data.value.ISBN}</li>
                    <li>总页数：{data.value.totalPage}</li>
                    <li>发售时间：{data.value.releaseTime}</li>
                  </ul>
                  
                  <Space>
                    {/* <Button size="small" color="#e41382">
                      <Space>
                        <Icon name="like" color="white"/>
                        <span>加入书架</span>
                      </Space>
                    </Button> */}
                    <Button  size="small" type="primary" onClick={() => {
                      router.push({
                        name: 'reader',
                        query: {
                          id: data.value.id,
                          contentType: data.value.contentType
                        }
                      })
                    }}>开始阅读</Button>
                  </Space>
                </section>
                <Space>
              </Space>
              </Space>
              <button class="more-information" onClick={() => {
                router.push(`/information?id=${data.value.id}`)
              }}>查看更多信息</button>
              <section class="books-description">
                <p>{data.value.description}</p>
              </section>
              <section class="books-series">
                <section>
                  <span>系列</span>
                  <div class="more">
                    <span>更多</span>
                    <Icon name="arrow" color='#999999'/>
                  </div>
                  
                  {/* <span>更多</span> */}
                </section>
                <ul class='b-grid-list'>
                  {series.value.map((item: any) => {
                    return (
                      <li
                        key={item.id}
                        class='b-grid-list-item'
                        onClick={() => {
                          router.push(`volumeDetail?id=${item.id}`)
                          // location.reload()
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
