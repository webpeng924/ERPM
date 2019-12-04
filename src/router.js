import Vue from 'vue'
import Router from 'vue-router'

import login from './views/login/login'
import index from './views/index'
import query from './views/jxc/stock/query'
import queryInfo from './views/jxc/stock/queryInfo'
import queryDetail from './views/jxc/stock/queryDetail'
import inventory from './views/jxc/inventory/inventory'
import rold from './views/jxc/rold/inroad'
import roldInfo from './views/jxc/rold/inroldinfo'
import saleTotal from './views/jxc/sale/saleTotal'
import saleList from './views/jxc/sale/salelist'
import saleinfo from './views/jxc/sale/saleinfo'
import newsale from './views/jxc/sale/newSale'
import newfinish from './views/jxc/sale/newfinish'
import addCustomer from './views/jxc/customer/addCustomer'
import historylist from './views/jxc/inventory/historylist'
import saleListById from './views/jxc/sale/salelistById'
import customer from './views/jxc/customer/customerlist'
import customerinfo from './views/jxc/customer/customerinfo'
import salemoney from './views/jxc/customer/saleMoney'
import colmoney from './views/jxc/customer/colmoney'
import colmoney2 from './views/jxc/customer/colmoney2'
import cusmoreinfo from './views/jxc/customer/cusmoreinfo'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: index,
      meta: { title: '首页' }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: { title: '登录' }
    },
    {
      path: '/query',
      name: 'query',
      component: query,
      meta: { title: '库存明细' }
    },
    {
      path: '/query/:id',
      name: 'queryDetail',
      component: queryDetail,
      meta: { title: '明细详情' }
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: inventory,
      meta: { title: '库存汇总' }
    },
    {
      path: '/inventory/info',
      name: 'queryInfo',
      component: queryInfo,
      meta: { title: '仓库详情' }
    },
    {
      path: '/rold',
      name: 'rold',
      component: rold,
      meta: { title: '在途查询' }
    },
    {
      path: '/rold/:id',
      name: 'roldInfo',
      component: roldInfo,
      meta: { title: '在途明细' }
    },
    {
      path: '/saletotal/:id',
      name: 'saletotal',
      component: saleTotal,
      meta: { title: '销售统计' }
    },
    {
      path: '/sale/:id',
      name: 'saleinfo',
      component: saleinfo,
      meta: { title: '销售单详情' }
    },
    {
      path: '/salelist',
      name: 'salelist',
      component: saleList,
      meta: { title: '销售列表' }
    },
    {
      path: '/salelist/:id',
      name: 'salelistById',
      component: saleListById,
      meta: { title: '我的销售' }
    },
    {
      path: '/newsale',
      name: 'newsale',
      component: newsale,
      meta: { title: '销售开单' }
    },
    {
      path: '/newfinish',
      name: 'newfinish',
      component: newfinish,
      meta: { title: '备注信息' }
    },
    {
      path: '/customer',
      name: 'customer',
      component: customer,
      meta: { title: '客户列表' }
    },
    {
      path: '/addcustomer',
      name: 'addCustomer',
      component: addCustomer,
      meta: { title: '新增客户' }
    },
    {
      path: '/customer/:id',
      name: 'customerinfo',
      component: customerinfo,
      meta: { title: '客户详情' }
    },
    {
      path: '/customer/:id/info',
      name: 'cusmoreinfo',
      component: cusmoreinfo,
      meta: { title: '客户详情' }
    },
    {
      path: '/customer/:id/sm',
      name: 'salemoney',
      component: salemoney,
      meta: { title: '订单应收' }
    },
    {
      path: '/customer/:id/sm/cm',
      name: 'colmoney',
      component: colmoney,
      meta: { title: '收款' }
    },
    {
      path: '/customer/:id/cm',
      name: 'colmoney2',
      component: colmoney2,
      meta: { title: '销售应收' }
    },
    {
      path: '/historylist/:id',
      name: 'historylist',
      component: historylist,
      meta: { title: '历史订单' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let user = JSON.parse(sessionStorage.getItem('youmuUser'))
  if (user || to.path == '/login') {
    //判断是否已经登录
    console.log('通过拦截', from)
    if (to.meta.title) {
      document.title = to.meta.title
    } else {
      document.title = 'ERP'
    }
    next()
  } else {
    console.log('未通过拦截', from)
    next({
      path: '/login'
    })
  }
})
export default router
