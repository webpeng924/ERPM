<template>
  <div id="inrold">
    <div class="search">
      <div class="search_warp">
        <i class="iconfont iconsousuo"></i>
        <input type="text" v-model="likeName" @keyup.enter="match" placeholder="包号\柜号\合同号\提单号" />
      </div>
    </div>
    <div class="main">
      <div class="title borBom">
        <div class="top clearfix">
          <div class="left">
            <span @click="visible.category = true">
              {{ nowCategory.value }}
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
            <div v-for="i in cate" :key="i" class="item">{{ i }}</div>
          </div>
        </div>
        <div class="tongInfo">
          <span class="exp">
            <i class="iconfont icondaochufffpx"></i>
            导出
          </span>
          <p>
            合计：
            <span>{{data?data.length:0}}</span>件
            <span>{{cubicAll}}</span>m³
          </p>
        </div>
      </div>
      <div class="content">
        <!-- 货物明细 -->
        <div class="content_data" v-if="data && data.length !== 0">
          <div v-for="k in list" :key="k.packageNo" class="data_li borBom">
            <div class="bian">
              <span class="textover">包号：{{ k.packageNo }}</span>
              <span class="textover">提单号：{{ k.orderSn }}</span>
            </div>
            <div class="guiInfo">
              <span class="item">{{ k.品类 }}</span>
              <span class="item">{{ k.树种 }}</span>
              <span class="item">{{ k.等级 }}</span>
            </div>
            <div class="ds">
              <span>规格：{{ k.厚度 }}*{{ k.宽度 }}*{{ k.长度 * 1000 }}</span>
              <span>{{ k.片数 }}支/{{ k.立方数 }}m³</span>
            </div>
          </div>
          <infinite-loading spinner="waveDots" :identifier="infiniteId" @infinite="infiniteHandler">
            <span style="height:1rem" slot="no-more">到底啦~</span>
          </infinite-loading>
        </div>
        <div v-else class="content_data">
          <p class="null">未查询到该记录</p>
        </div>
      </div>
    </div>
    <!-- 类目选择 -->
    <nut-actionsheet
      :is-visible="visible.category"
      :menu-items="category"
      optionTag="value"
      @choose="chooseCategory"
      :chooseTagValue="nowCategory.value"
      @close="visible.category = false"
    ></nut-actionsheet>
    <!-- 侧边栏 -->
    <sidebar :is-visible="visible.sidebar" @close="visible.sidebar = false">
      <div slot class="sidebar_content">
        <div class="item_box">
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
  name: 'inroad',
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
      sideInfo: [],
      wareHouse: [{ id: 945, name: '太仓仓库' }],
      active: {},
      visible: {
        category: false,
        sidebar: false
      },
      nowCategory: { id: 2, value: '实木板材' },
      ismoreobj: [],
      data: [1],
      list: [],
      pageNum: 1,
      infiniteId: +new Date(),
      likeName: ''
    }
  },
  computed: {
    category: function () {
      let data = []
      console.log(data)
      if (!data || data.length === 0) {
        this.$getCategory(this.getCate, val => {
          this.$store.commit('setCategory', val)
        })
      }
      return this.$store.state.category
    },
    cubicAll() {
      let sum = 0
      if (this.data) {
        this.data.forEach(item => {
          if (item.hasOwnProperty('amount'))
            sum += Number(item.amount)
        })
      }
      var reg = /\d{1,3}(?=(\d{3})+$)/g
      return (sum.toFixed(3) + '').replace(reg, '$&,')
    },
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
    // 清空筛选
    delAll() {
      this.active = {}
      this.cate = []
      this.size = ''
      this.value1 = ''
      this.value2 = ''
      this.value3 = ''
    },
    // 分页加载
    infiniteHandler($state) {
      let activeInfo =
        JSON.stringify(this.active) == '{}' ? '' : JSON.stringify(this.active)
      activeInfo = ',' + activeInfo.replace(/\{|}|"/g, '')
      this.$axios
        .get('http://192.168.0.199:8066/storePackage/showStoreOnPassageInfo', {
          params: {
            tenantId: this.GLOBAL.token.tenantId,
            array: '品类:' + this.nowCategory.value + this.size + activeInfo,
            pageNum: this.pageNum,
            pageSize: 20,
            packageNo: this.likeName
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
    // 全部数据
    async getCate() {
      this.pageNum = 1
      this.list = []
      this.infiniteId += 1
      let activeInfo =
        JSON.stringify(this.active) == '{}' ? '' : JSON.stringify(this.active)
      activeInfo = ',' + activeInfo.replace(/\{|}|"/g, '')
      const res = await this.$axios.get(
        'http://192.168.0.199:8066/storePackage/showStoreOnPassageInfo',
        {
          params: {
            tenantId: this.GLOBAL.token.tenantId,
            array: '品类:' + this.nowCategory.value + this.size + activeInfo,
          }
        }
      )
      if (res.data.code === 200) {
        this.data = res.data.data
        console.log(this.data)
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
      } else {
        this.data = []
      }
    },

    // 搜索信息
    async match() {
      this.pageNum = 1
      this.list = []
      this.infiniteId += 1
      let activeInfo =
        JSON.stringify(this.active) == '{}' ? '' : JSON.stringify(this.active)
      activeInfo = ',' + activeInfo.replace(/\{|}|"/g, '')
      const res = await this.$axios.get(
        'http://192.168.0.199:8066/storePackage/showStoreOnPassageInfo',
        {
          params: {
            tenantId: this.GLOBAL.token.tenantId,
            array: '品类:' + this.nowCategory.value + this.size + activeInfo,
            packageNo: this.likeName
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
    //打开侧边栏
    openSidebar() {
      for (let i = 0; i < 50; i++) {
        this.ismoreobj.push(true)
      }
      this.visible.sidebar = true
    },
    //跳转明细
    jump(id) {
      this.$router.push({
        name: 'roldInfo',
        params: { id: id }
      })
    }
  },
  components: {
    sidebar,
    InfiniteLoading
  }
}
</script>

<style scoped lang="scss">
#inrold {
  height: 100%;
  .search {
    padding: 0.2rem 0.5rem 0.3rem;
    height: 0.6rem;
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
      text-align: center;
      font-size: 0.24rem;
      .top {
        padding: 0 0.3rem;
        line-height: 0.5rem;
      }
      .left {
        float: left;
        width: 65%;
        height: 0.5rem;
        span {
          display: inline-block;
          width: 50%;
          text-align: center;
          color: #333333;
          i {
            font-size: 0.24rem;
          }
        }
        span.active {
          color: #2789ed;
        }
      }
      .right {
        float: right;
        width: 33%;
        color: #333333;
        text-align: center;
        vertical-align: middle;
        i {
          vertical-align: middle;
          margin-left: 5px;
        }
      }
      .checkInfo {
        overflow: auto;
        text-align: left;
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
      .tongInfo {
        padding: 0.2rem 0.28rem 0;
        color: #999999;
        font-size: 0.24rem;
        text-align: left;
        span {
          color: #333333;
          &:last-child {
            padding-left: 0.28rem;
          }
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
    }
    .content {
      height: calc(100% - 2rem);
    }
    .content_data {
      height: 100%;
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
      .data_li {
        padding: 0.2rem 0.35rem;
      }
      .bian {
        padding-bottom: 0.14rem;
        span {
          display: inline-block;
          max-width: 2.8rem;
          line-height: 0.32rem;
          padding-left: 0.2rem;
          padding-right: 0.2rem;
          background: linear-gradient(
            90deg,
            rgba(52, 130, 238, 1) 0%,
            rgba(93, 159, 243, 1) 100%
          );
          color: #ffffff;
          border-radius: 0.4rem;
          margin-right: 0.2rem;
          font-size: 0.24rem;
        }
      }
      .guiInfo {
        margin-bottom: 0.2rem;
        .item {
          padding-left: 0.2rem;
          padding-right: 0.2rem;
          line-height: 0.4rem;
          border-radius: 0.4rem;
          background-color: #f5f5f5;
          color: #999999;
          font-size: 0.28rem;
          margin-right: 0.2rem;
        }
      }
      .ds {
        span {
          display: inline-block;
          width: 55%;
          font-size: 0.28rem;
          color: #333333;
          margin-right: 5%;
        }
        span:last-child {
          width: 40%;
          margin-right: 0;
        }
      }
      .date {
        font-size: 0.24rem;
        color: #2789ed;
      }
      .left {
        float: left;
        width: 45%;
        margin-right: 2%;
        p {
          color: #999999;
          font-size: 0.24rem;
          margin-bottom: 0.1rem;
          margin-top: 0.2rem;
          span {
            color: #333333;
          }
        }
      }
      .right {
        float: left;
        width: 4%;
        margin-top: 0.5rem;
      }
    }
  }
}
</style>
