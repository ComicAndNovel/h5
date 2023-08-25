import home from '../page/home/home'

export default [
  
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/reader',
    name: 'reader',
    component: () => import('../page/reader/reader')
  },
]