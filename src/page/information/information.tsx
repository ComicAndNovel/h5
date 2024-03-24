import {defineComponent, reactive, ref} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon, Space, Image, PullRefresh, Button, Tag } from 'vant'
import Container from '../../components/container/container'
import { useRequest } from '../../hooks'
import './information.scss'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const data = ref<any>({})
    const novel = ref<any>({})
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
          url: '/books/detail',
          method: 'get',
          params: {
            id: res.data.booksId
          }
        }).then((res: any) => {
          novel.value = res.data
        })
      })
    }

    getData()

    return () => {
      return (
        <Container
          class='books-information-container'
          headerProps={{
            title: data.value.name,
          }}>
          <ul class="information">
            <li>
              <span class="label">书名：</span>
              <span>{data.value.name}</span>
            </li>
            <li>
              <span class="label">原名：</span>
              <span>{data.value.originalName}</span>
            </li>
            <li>
              <span class="label">作者：</span>
              {
                  novel.value.authors?.map((item: { name: string }) => {
                    return <Tag round type='primary'>{item.name}</Tag>
                  })
                }
            </li>
            <li>
              <span class="label">语言：</span>
              <span>{novel.value.language?.name}</span>
            </li>
            <li>
              <span class="label">出版地区：</span>
              <span>{novel.value.country?.name}</span>
            </li>
            <li>
              <span class="label">出版社：</span>
              <span>
                {
                  novel.value.publishers?.map((item: { name: string }) => {
                    return <Tag round  type='primary'>{item.name}</Tag>
                  })
                }
              </span>
            </li>
            <li>
              <span class="label">当前卷：</span>
              <span>第{data.value.volumeNumber}卷</span>
            </li>

            
            <li>
              <span class="label">发售时间：</span>
              <span>{data.value.releaseTime}</span>
            </li>
            <li>
              <span class="label">总页数：</span>
              <span>{data.value.totalPage}</span>
            </li>
            <li>
              <span class="label">ISBN：</span>
              <span>{data.value.ISBN}</span>
            </li>
            <li class="desc">
              <span class="label">简介：</span>
              <span>{data.value.description}</span>
            </li>
          </ul>
        </Container>
      )
    }
  },
})
