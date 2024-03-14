import {defineComponent, ref, reactive, onUpdated, onMounted } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {Tree} from '../../components/tree/tree'
import http from '../../api'
// 防止覆盖 html 富文本的样式
import styles from './style.module.scss'
import { Popup, Popover, Icon, Loading, Image, Swipe, SwipeItem } from 'vant'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const html = ref()
    const show = ref(false)
    const showSetting = ref(false)
    const showMore = ref(false)
    const data = reactive<any>({
      loading: false,
      page: 1,
      total: 0,
      book: {
        toc: [],
        data: [],
        current: 1,
        pageSize: 5
      },
      comic: {
        data: [],
        // 当前阅读进度
        current: 1,
        pageSize: 5
      }
    })

    const themeConfig = reactive({
      sheepskinWhite: {
        background: '#f4dbb0',
        color: 'black'
      },
      black: {
        background: 'black',
        color: 'white'
      }
    })
    const image = route.query.contentType === 'image'
    const theme = ref(image ? themeConfig.black : themeConfig.sheepskinWhite)
    const comic = ref<any>([])

    const getBookData = (page = 1) => {
      data.loading = true
      http({
        url: '/volume/content',
        method: 'get',
        params: {
          id: route.query.id,
          page,
          pageSize: data.book.pageSize,
        },
      }).then((res) => {
        data.book.data = data.book.data.concat(res.data.list)
        data.page = res.data.page
        data.total = res.data.total
        data.loading = false
      })
    }

    const getComicData = (page = 1) => {
      data.loading = true
      http({
        url: '/volume/content',
        method: 'get',
        params: {
          id: route.query.id,
          page,
          pageSize: data.comic.pageSize,
        },
      }).then((res: any) => {
        comic.value = res.data.list
        data.comic.data = data.comic.data.concat(res.data.list)
        data.page = res.data.page
        data.total = res.data.total
        data.loading = false
        console.log(data.comic.data)
      })
    }

    switch (route.query.contentType) {
      case 'html':
          getBookData()
        break
      case 'image':
          getComicData()
        break
    }
    
    return () => {
      return (
        <>
          <ul class={styles["books-reader-header"]} style={{
            background: theme.value.background,
            color: theme.value.color,
            display: show.value ? 'flex' : 'none'
          }}>
            <li onClick={() => {
              router.go(-1)
            }}>
              <Icon name="arrow-left"></Icon>
            </li>
            <li class={styles["header-title"]}></li>
            <li style={{
              display: 'flex',
              gap: '10px'
            }} class={styles['header-action']}>
              <Popover show={showSetting.value} placement='left-start'>
                {{
                  default () {
                    return (
                      <section class={styles['header-action-setting']}>
                        <div>背景</div>
                        <ul>
                          {
                            Object.values(themeConfig).map(item => {
                              return (
                                <li 
                                  style={{
                                    background: item.background
                                  }}
                                  onClick={() => {
                                    theme.value = item
                                    showSetting.value = false
                                  }}>
                                  {
                                    theme.value.background === item.background ? <Icon name='success' size={20}></Icon> : null
                                  }
                                </li>
                              )
                            })
                          }
                        </ul>
                      </section>
                    )
                  },
                  reference () {
                    return <Icon name="setting-o" size={24}></Icon>
                  }
                }}
              </Popover>
              <Popover 
                show={showMore.value} 
                placement='left'
                actions={[
                  {
                    text: '图书信息'
                  }
                ]}
                onSelect={(item) => {
                  switch (item.text) {
                    case '图书信息':
                      showMore.value = false
                      if (image) {
                        router.push(`/booksDetail?id=${data.comic.data[0]?.novelVolumeId}`)
                      } else {
                        router.push(`/booksDetail?id=${data.book.data[0]?.novelVolumeId}`)
                      }
                      break
                  }
                }}>
                {{
                  reference () {
                    return <Icon name="ellipsis" size={24} style={{
                      transform: 'rotate(90deg)'
                    }}></Icon>
                  }
                }}
              </Popover>
            </li>
          </ul>
          <section 
            class={styles["reader-container"]} 
            style={{
              backgroundColor: theme.value.background,
              color: theme.value.color
            }}
            onClick={() => {
              console.log(1)
              show.value = !show.value
            }}>
            {
              image ? (
                <section class={styles["comic-reader"]}>
                  <Swipe 
                    showIndicators={false} 
                    loop={false} 
                    lazyRender={true}
                    onChange={(index: number) => {
                      const max = data.comic.pageSize * data.page
                      data.comic.current = index + 1

                      if (index >= max - 2 && index < max) {
                        getComicData(data.page + 1)
                      }
                    }}>
                    {
                      data.comic.data.map((item: any) => {
                        const slots = {
                          loading () {
                            return (
                              <section class={styles["books-center"]}>
                                <Loading type="spinner" size={40}></Loading>
                              </section>
                            )
                          },
                          error () {
                            return (
                              <section class={styles["books-center"]}>
                                <span>加载失败</span>
                              </section>
                            )
                          }
                        }
                        return (
                          <SwipeItem key={item.id}>
                            <Image src={item.content} lazyLoad v-slots={slots} width="100%" height="100%"></Image>
                          </SwipeItem>
                        )
                      })
                    }
                     <SwipeItem>
                      {
                        data.comic.current === data.total + 1 ? (
                          <section class={styles["books-center last-comic-page"]}>
                            最后一页
                          </section>
                        ) : null
                      }
                    </SwipeItem>
                  </Swipe>
                  {
                    !data.loading ? (
                      <span style={{
                        color: theme.value.color,
                        margin: '10px 0'
                      }}> {data.comic.current}/{data.total}</span>
                    ) : null
                  }
                </section>
              ) : (
                <section class={styles["book-container"]}>
                   {
                    !data.loading ? (
                      <span style={{
                        color: theme.value.color,
                        margin: '10px 0'
                      }}> {data.book.current}/{data.total}</span>
                    ) : null
                  }
                  {/* {
                    data.book.current === data.total + 1 ? (
                      <section class={styles["books-center last-comic-page"]}>
                        最后一页
                      </section>
                    ) : null
                  } */}
                  <section class={styles["book"]}>
                    <Swipe 
                      showIndicators={false} 
                      loop={false} 
                      lazyRender={true}
                      onChange={(index: number) => {
                        data.book.current = index + 1
                        const max = data.comic.pageSize * data.page
                        
                        if (index >= max - 2 && index < max) {
                          getBookData(data.page + 1)
                        }
                        
                      }}>
                      {
                        data.book.data.map((item: any) => {
                          return (
                            <SwipeItem key={item.id}>
                              <section class={styles["page"]} data-density='soft' v-html={item.content}></section>
                            </SwipeItem>
                          )
                        })
                      }
                      <SwipeItem>
                        {
                          data.book.current === data.total + 1 ? (
                            <section class={styles["books-center last-comic-page"]}>
                              最后一页
                            </section>
                          ) : null
                        }
                      </SwipeItem>
                    </Swipe>
                  </section>
                </section>
              )
            }
          </section>
         {/* <Popup
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
              <Tree data={data.book.toc}></Tree>
            </section>
          </Popup> */}
        </>
      )
    }
  },
})
