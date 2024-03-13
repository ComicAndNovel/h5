import books from '../page/books/books'

export default [
  
  {
    path: '/',
    name: 'books',
    component: books
  },
  {
    path: '/booksDetail',
    name: 'booksDetail',
    component: () => import('../page/booksDetail/booksDetail')
  },
  {
    path: '/volumeDetail',
    name: 'volumeDetail',
    component: () => import('../page/volumeDetail/volumeDetail')
  },
  {
    path: '/information',
    name: 'information',
    component: () => import('../page/information/information')
  },
  {
    path: '/reader',
    name: 'reader',
    component: () => import('../page/reader/reader')
  },
]