import {defineComponent, reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import { List, Space, Image, PullRefresh, Search, Swipe, SwipeItem } from 'vant'
import Container from '../../components/container/container'
import http from '../../api'
import './books.scss'
import Footer from '../../components/footer/footer'
import { repeat } from '../../utils'

type name = 'novel' | 'comic'
export default defineComponent({
  setup() {
    const router = useRouter()
    const tab = reactive<any>({
      name: 'novel' as name,
      comic: {
        page: 1,
        finished: false,
        refreshing: false,
        loading: false,
        data: []
      },
      novel: {
        page: 1,
        finished: false,
        refreshing: false,
        loading: false,
        data: []
      }
    })
    const tabs = [
      {
        id: 'novel',
        name: '轻小说'
      },
      {
        id: 'comic',
        name: '漫画'
      }
    ]

    const getData = (page = 1) => {
      tab[tab.name].loading = true
      http({
        url: `/books/${tab.name}List`,
        method: 'post',
        data: {
          page: page,
          pageSize: 10,
        },
      })
        .then((res) => {
          if (page === 1) {
            tab[tab.name].data = res.data.list
          } else {
            tab[tab.name].data = [...tab[tab.name].data, ...res.data.list]
          }
          if (tab[tab.name].data.length >= res.data.total) {
            tab[tab.name].finished = true
          }
          tab[tab.name].page = page
        })
        .finally(() => {
          tab[tab.name].refreshing = false
          tab[tab.name].loading = false
        })
    }

    getData()

    const onLoad = () => {
      // getData(currentPage + 1)
    }

    const refresh = () => {
      tab[tab.name].refreshing = true
      getData()
    }

    return () => {
      return (
        <Container
          class='b-index-container'
          footer={false}
          marginTop={90}
          onClick={(id: string) => {
            console.log(id)
            tab.name = id
            getData()
          }}
          headerProps={{
            title: <Search shape="round" placeholder='随便搜点什么'></Search>,
            back: false,
            // shadow: false,
            tab: true,
            active: tab.name,
            tabs
          }}>
          <Swipe showIndicators={false} lazyRender onChange={(index) => {
            tab.name = tabs[index].id as name
            getData()
          }}>
            {
              tabs.map((tabItem) => {
                return (
                  <SwipeItem key={tabItem.id}>
                    <PullRefresh model-value={tab[tab.name].refreshing} onRefresh={refresh}>
                    <List
                      loading={tab[tab.name].loading}
                      finished={tab[tab.name].finished}
                      finished-text='没有更多了'
                      onLoad={onLoad}
                      immediate-check={false}>
                      <ul class='b-grid-list'>
                        {tab[tab.name].data.map((item: any, index: number) => {
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
                </SwipeItem>
                )
              })
            }
          </Swipe>
        </Container>
      )
    }
  }
})
