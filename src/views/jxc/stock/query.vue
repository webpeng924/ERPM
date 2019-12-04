<template>
  <div id="query">
    <div class="search">
      <div class="search_warp">
        <i class="iconfont iconsousuo"></i>
        <input type="text" @keyup.enter="match" v-model="likeName" placeholder="包号" />
      </div>
    </div>
    <div class="main">
      <div class="borBom title">
        <div class="top">
          <div class="left">
            <span class="textover" @click="visible.category = true">
              {{ nowCategory.value }}
              <i class="iconfont iconshang-san"></i>
            </span>
            <span class="textover" @click="visible.store = true">
              {{ nowStore.value }}
              <i class="iconfont iconshang-san"></i>
            </span>
          </div>|
          <div class="right">
            <span @click="openSidebar">
              筛选
              <i class="iconfont iconshaixuan"></i>
            </span>
          </div>
        </div>
        <!-- 已选条件 -->
        <div class="checkInfo textover">
          <div class="content">
            <div v-show="aa" class="item">{{ aa.name }}</div>
            <div v-for="i in cate" :key="i" class="item">{{ i }}</div>
          </div>
        </div>
        <!-- 库存信息及导出 -->
        <div class="tongInfo">
          <span class="exp">
            <i class="iconfont icondaochufffpx"></i>
            导出
          </span>
          <p>
            库存合计：
            <span>{{ cubicAll }}</span>m³
          </p>
        </div>
      </div>
      <!-- 信息列表 -->
      <div v-if="data && data.constructor === Array" class="data_content">
        <div class="list_item borBom" @click="openInfo(k)" v-for="k in list" :key="k.id">
          <div class="left">
            <div class="tag">
              <span class="item">{{ k.树种 }}</span>
              <span class="item">{{ k.品牌 }}</span>
              <span class="item">{{ k.等级 }}</span>
            </div>
            <div class="info">
              <div class="size">
                <span class="pr">规格：{{ k.厚度 }}*{{ k.宽度 }}*{{ k.长度 * 1000 }}</span>
                <span>{{ k.片数 }}支/{{ k.立方数 }} m³</span>
              </div>
              <div>
                <span class="adress">
                  <i class="iconfont icondizhi"></i>
                  {{ k.warestoreName }}
                </span>
                <div style="width:70%;float:right;margin-top:1px">
                  <span class="num-t" style="float:left">包号：</span>
                  <p class="num textover">{{ k.packageNo }}</p>
                </div>
              </div>
            </div>
          </div>
          <i class="iconfont iconyou"></i>
        </div>
        <infinite-loading spinner="waveDots" :identifier="infiniteId" @infinite="infiniteHandler">
          <span style="height:1rem" slot="no-more">到底啦~</span>
        </infinite-loading>
      </div>
      <div v-else class="data_content">
        <p class="null">未查询到该库存信息</p>
      </div>
    </div>
    <!-- 分类 -->
    <nut-actionsheet
      :is-visible="visible.category"
      :menu-items="category"
      optionTag="value"
      @choose="chooseCategory"
      :chooseTagValue="nowCategory.value"
      @close="visible.category = false"
    ></nut-actionsheet>
    <!-- 仓库选择 -->
    <nut-actionsheet
      :is-visible="visible.store"
      :menu-items="store"
      optionTag="value"
      @choose="chooseStore"
      :chooseTagValue="nowStore.value"
      @close="visible.store = false"
    ></nut-actionsheet>
    <!-- 右侧筛选 -->
    <sidebar :is-visible="visible.sidebar" @close="visible.sidebar = false">
      <div slot class="sidebar_content">
        <div class="item_box">
          <div class="item">
            <div class="item_title">
              <span class="title">仓库</span>
              <span
                v-if="wareHouse.length > 6"
                @click="
                  ismoreobj.splice(
                    wareHouse.length - 1,
                    1,
                    !ismoreobj[wareHouse.length - 1]
                  )
                "
              >
                {{ ismoreobj[wareHouse.length - 1] ? '更多' : '收起' }}
                <i
                  v-if="ismoreobj[wareHouse.length - 1]"
                  class="iconfont iconxia"
                ></i>
                <i v-else class="iconfont iconshang"></i>
              </span>
            </div>
            <div class="content_item" :class="{ minH: ismoreobj[wareHouse.length - 1] }">
              <div
                @click="click(v)"
                class="textover"
                :class="{ active: aa.id == v.id }"
                v-for="v in wareHouse"
                :key="v.name"
              >{{ v.name }}</div>
            </div>
          </div>
          <div class="item" v-for="k in sideInfo" :key="k.key">
            <div class="item_title">
              <span class="title">{{ k.key }}</span>
              <span
                v-if="k.list.length > 6"
                @click="
                  ismoreobj.splice(
                    k.list.length - 1,
                    1,
                    !ismoreobj[k.list.length - 1]
                  )
                "
              >
                {{ ismoreobj[k.list.length - 1] ? '更多' : '收起' }}
                <i
                  v-if="ismoreobj[k.list.length - 1]"
                  class="iconfont iconxia"
                ></i>
                <i v-else class="iconfont iconshang"></i>
              </span>
            </div>
            <div class="content_item" :class="{ minH: ismoreobj[k.list.length - 1] }">
              <div
                @click="showSelect(k, v)"
                class="textover"
                :class="{ active: cate.includes(v) }"
                v-for="v in k.list"
                :key="v"
              >{{ v }}</div>
            </div>
          </div>
          <div class="item">
            <div class="item_title">
              <span class="title">规格</span>
            </div>
            <div class="content_item">
              <div style="display:flex;width:100%;background-color:#fff">
                <span style="flex:1">厚度：</span>
                <select class="selBox" v-model="value1" @change="handleChange">
                  <option value disabled selected style="display:none;">请选择</option>
                  <option
                    style="background-color:#fff;border: none;"
                    :value="v"
                    v-for="v in list1"
                    :key="v"
                  >{{ v }}</option>
                </select>
              </div>
              <div style="display:flex;width:100%;background-color:#fff">
                <span style="flex:1">宽度：</span>
                <select class="selBox" v-model="value2" @change="handleChange">
                  <option value disabled selected style="display:none;">请选择</option>
                  <option
                    style="background-color:#fff;border: none;"
                    :value="v"
                    v-for="v in list2"
                    :key="v"
                  >{{ v }}</option>
                </select>
              </div>
              <div style="display:flex;width:100%;background-color:#fff">
                <span style="flex:1">长度：</span>
                <select class="selBox" v-model="value3" @change="handleChange">
                  <option value disabled selected style="display:none;">请选择</option>
                  <option
                    style="background-color:#fff;border: none;"
                    :value="v"
                    v-for="v in list3"
                    :key="v"
                  >{{ v }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="content_btnGroup">
          <nut-buttongroup>
            <nut-button type="light" @click="delAll">重置</nut-button>
            <nut-button @click="visible.sidebar = false">确定</nut-button>
          </nut-buttongroup>
        </div>
      </div>
    </sidebar>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import sidebar from '../../../components/sidebar'
export default {
  name: 'query',
  data() {
    return {
      value1: '',
      value2: '',
      value3: '',
      list1: [],
      list2: [],
      list3: [],
      cate: [],
      size: '',
      wareHouse: [{ id: 945, name: '太仓仓库' }],
      active: {},
      aa: '',
      visible: {
        category: false,
        store: false,
        sidebar: false
      },
      nowCategory: { id: 2, value: '实木板材' },
      nowStore: { id: 0, value: '在库库存' },
      store: [
        { id: 0, value: '在库库存' },
        { id: 3, value: '已售商品' }
      ],
      pageNum: 1,
      storeList: [1, 2, 3, 4, 5, 6, 7],
      data: [0, 1, 2, 3, 4, 5, 6],
      list: [],
      infiniteId: +new Date(),
      ismoreobj: [],
      metaData: [],
      sideInfo: [],
      likeName: ''
    }
  },
  computed: {
    category() {
      let data = this.$store.state.data
      if (!data || data.length === 0) {
        this.$getCategory(this.getCate, val => {
          this.$store.commit('setCategory', val)
        })
      }
      return this.$store.state.category
    },
    cubicAll() {
      let sum = 0
      if (this.data.constructor === Array) {
        this.data.forEach(item => {
          if (item.hasOwnProperty('amount')) sum += Number(item.amount)
        })
      }
      var reg = /\d{1,3}(?=(\d{3})+$)/g
      console.log(sum)
      return (sum.toFixed(3) + '').replace(reg, '$&,')
    }
  },
  methods: {
    handleChange() {
      this.size = ''
      if (this.value1) {
        this.size += ',厚度:' + this.value1
      }
      if (this.value2) {
        this.size += ',宽度:' + this.value2
      }
      if (this.value3) {
        this.size += ',长度:' + this.value3
      }
      // this.getCate()
    },
    // 筛选选择
    showSelect(k, v) {
      if (this.cate.includes(v)) {
        delete this.active[k.key]
        this.cate = Object.values(this.active)
        this.getCate()
      } else {
        this.$set(this.active, k.key, v)
        this.cate = Object.values(this.active)
      }
    },
    click(v) {
      if (this.aa == v) {
        this.aa = ''
      } else {
        this.aa = v
      }
      console.log(this.aa)
      // this.getCate()
    },
    // 清空筛选
    delAll() {
      this.active = {}
      this.cate = []
      this.size = ''
      this.value1 = ''
      this.value2 = ''
      this.value3 = ''
      this.aa = ''
    },
    //选择客户
    openInfo(data) {
      console.log(data)
      if (data) {
        this.$router.push({
          name: 'queryDetail',
          params: { id: data.id }
        })
      }
    },
    // 分页加载
    infiniteHandler($state) {
      let activeInfo =
        JSON.stringify(this.active) == '{}' ? '' : JSON.stringify(this.active)
      activeInfo = ',' + activeInfo.replace(/\{|}|"/g, '')
      this.$axios
        .get('http://192.168.0.199:8066/storePackage/showWarehouseInventoryPackages', {
          params: {
            tenantId: this.GLOBAL.token.tenantId,
            attribute:
              '品类:' + this.nowCategory.value + this.size + activeInfo,
            state: this.nowStore.id === 0 ? null : this.nowStore.id,
            warestoreId: this.aa.id,
            pageNum: this.pageNum,
            pageSize: 20,
            likeName: this.likeName
          }
        })
        .then(({ data }) => {
          if (!data.data) return
          console.log(data)
          if (data.data.dataList) {
            this.pageNum += 1
            this.list.push(...data.data.dataList)
            this.list.forEach(item => {
              let arr = item.attributeValue.split(',')
              arr.forEach(i => {
                if (i !== '') {
                  item[i.split(':')[0]] = i.split(':')[1]
                }
              })
            })
            $state.loaded()
            console.log(this.list.length / 20, data.data.pages)
            if (this.list.length / 20 > data.data.pages - 1) {
              $state.complete()
            }
          } else {
            $state.complete()
          }
        })
    },
    // 获取库存明细数据
    async getCate() {
      this.pageNum = 1
      this.list = []
      this.infiniteId += 1
      let activeInfo =
        JSON.stringify(this.active) == '{}' ? '' : JSON.stringify(this.active)
      activeInfo = ',' + activeInfo.replace(/\{|}|"/g, '')
      console.log(activeInfo)
      const res = await this.$axios.get(
        'http://192.168.0.199:8066/storePackage/showWarehouseInventoryPackages',
        {
          params: {
            tenantId: this.GLOBAL.token.tenantId,
            attribute:
              '品类:' + this.nowCategory.value + this.size + activeInfo,
            state: this.nowStore.id === 0 ? null : this.nowStore.id,
            warestoreId: this.aa.id
          }
        }
      )
      this.data = res.data.data
      console.log(this.data)
      if (res.data.code === 200) {
        this.data.forEach(item => {
          let arr = item.attributeValue.split(',')
          arr.forEach(i => {
            if (i !== '') {
              item[i.split(':')[0]] = i.split(':')[1]
            }
          })
        })
        this.list1 = Array.from(new Set(this.data.map(item => item.厚度)))
        this.list2 = Array.from(new Set(this.data.map(item => item.宽度)))
        this.list3 = Array.from(new Set(this.data.map(item => item.长度)))

        let arr2 = Array.from(new Set(this.data.map(item => item.树种)))
        let arr3 = Array.from(new Set(this.data.map(item => item.品牌)))
        let arr4 = Array.from(new Set(this.data.map(item => item.等级)))
        let arr5 = Array.from(new Set(this.data.map(item => item.片数)))

        this.sideInfo = [
          { list: arr2, key: '树种' },
          { list: arr3, key: '品牌' },
          { list: arr4, key: '等级' },
          { list: arr5, key: '片数' }
        ]
        console.log(this.sideInfo)
      }
    },
    // 搜索信息
    async match() {
      this.pageNum = 1
      this.list = []
      this.infiniteId += 1
      const res = await this.$axios.get(
        'http://192.168.0.199:8066/storePackage/showWarehouseInventoryPackages',
        {
          params: {
            tenantId: this.GLOBAL.token.tenantId,
            attribute: '品类:实木板材',
            likeName: this.likeName
          }
        }
      )
      this.data = res.data.data
      this.data.forEach(item => {
        let arr = item.attributeValue.split(',')
        arr.forEach(i => {
          if (i !== '') {
            item[i.split(':')[0]] = i.split(':')[1]
          }
        })
      })
      console.log(this.data)
    },
    //选择类目
    chooseCategory(data) {
      this.nowCategory = data
      this.visible.category = false
    },
    // 库存选择
    chooseStore(val) {
      this.nowStore = val
      this.visible.store = false
    },
    //打开筛选
    openSidebar() {
      for (let i = 0; i < 20; i++) {
        this.ismoreobj.push(true)
      }
      this.visible.sidebar = true
    },
    //跳转详情
    jump(id) {
      this.$router.push({
        name: 'queryInfo',
        params: {
          id: id
        }
      })
    }
  },
  components: {
    InfiniteLoading,
    sidebar
  }
}
</script>

<style scoped lang="scss">
#query {
  height: 100%;
  .search {
    padding: 0.2rem 0.5rem 0.3rem;
    height: 0.6rem;
    font-size: 12px;
    color: rgba(153, 153, 153, 1);
  }
  .main {
    height: calc(100% - 1.1rem);
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
    box-shadow: 0px -2px 6px 0px rgba(51, 51, 51, 0.12);
    overflow: hidden;
    .title {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      .top {
        padding: 0 0.3rem;
        line-height: 0.5rem;
        font-size: 0.24rem;
        color: #cccccc;
        &:after {
          content: "";
          height: 0;
          display: block;
          overflow: hidden;
          clear: both;
        }
        .left {
          float: left;
          width: 73%;
          height: 0.5rem;
          color: #333333;
          span {
            display: inline-block;
            width: 50%;
            text-align: center;
            i {
              font-size: 10px;
            }
          }
        }
        .right {
          float: right;
          width: 26%;
          box-sizing: border-box;
          color: #333333;
          text-align: center;
          vertical-align: middle;
          i {
            vertical-align: middle;
          }
        }
      }
      .tongInfo {
        padding: 0.2rem 0.28rem 0;
        color: #999999;
        font-size: 0.24rem;
        span {
          color: rgba(51, 51, 51, 1);
        }
        .exp {
          font-size: 0.24rem;
          color: rgba(51, 51, 51, 1);
          float: right;
          .icondaochufffpx {
            color: #2789ed;
            vertical-align: middle;
            font-size: 0.28rem;
          }
        }
      }
      .checkInfo {
        overflow: auto;
        padding-bottom: 0.1rem;
        padding-top: 0.1rem;
        .content {
          display: inline;
        }
        .item {
          padding: 0 0.2rem;
          height: 0.44rem;
          line-height: 0.44rem;
          background-color: #f5f5f5;
          border-radius: 1rem;
          margin: 0 0.1rem;
          color: #666666;
          display: inline-table;
        }
      }
    }
    .data_content {
      height: calc(100% - 2.23rem);
      overflow: auto;
      .infinite-loading-container {
        line-height: 1rem;
      }
      .null {
        text-align: center;
        height: 0.24rem;
        font-size: 0.24rem;
        color: rgba(102, 102, 102, 1);
        padding-top: 0.4rem;
      }
      .list_item {
        position: relative;
        width: 100%;
        height: 1.94rem /* 97/50 */;
        background: rgba(255, 255, 255, 1);
        padding: 0.3rem;
        box-sizing: border-box;
        .iconyou {
          position: absolute;
          top: 0.8rem;
          right: 0.36rem;
        }
        .tag {
          span {
            padding: 0 0.2rem;
            height: 0.44rem;
            line-height: 0.44rem;
            background-color: #f5f5f5;
            border-radius: 1rem;
            margin-right: 0.2rem;
            color: #666666;
          }
        }
        .info {
          .size {
            padding: 0.2rem 0;
            font-family: Source Han Sans CN;
          }
          .pr {
            padding-right: 0.5rem;
          }
          .adress {
            font-size: 12px;
            font-weight: 500;
            color: rgba(39, 137, 237, 1);
          }
          .num-t {
            padding-left: 20px;
          }
          .num {
            font-size: 0.28rem;
            color: rgba(51, 51, 51, 1);
            width: 3rem;
          }
        }
      }
    }
  }
}
.actionsheet_warp {
  height: 50vh;
  background-color: #ffffff;
  .store_search {
    padding: 0.2rem 0.5rem 0.3rem;
    height: 0.6rem;
    border-bottom: 1px solid #c5c5c5;
  }
  .load {
    height: calc(100% - 1.1rem);
    ul li {
      height: 0.8rem;
      line-height: 0.8rem;
      padding: 0 20px;
      border-bottom: 1px solid #e5e5e5;
    }
  }
}
</style>
