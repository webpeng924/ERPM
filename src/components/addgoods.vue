<template>
  <div id="addgoods" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <!-- <div class="search">
      <div class="search_warp">
        <i class="iconfont iconsousuo"></i>
        <input type="text" placeholder="品名\品牌\包号" />
      </div>
    </div>-->
    <!-- 商品列表 -->
    <div class="main" v-if="!visible.lookgoods">
      <div class="borBom title">
        <div class="top">
          <div class="left">
            <span class="textover" @click="visible.category=true">
              {{nowCategory.value}}
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
        <!-- 条件 -->
        <div class="checkInfo textover">
          <div class="content">
            <div class="item" v-show="aa!=''">{{aa.name}}</div>
            <div v-for="i in cate" :key="i" class="item">{{i}}</div>
          </div>
        </div>
        <div class="tongInfo">
          <p>
            仓储合计：
            <span>{{numAll}}</span>件，
            <span>{{cubicAll}}</span>m³
          </p>
        </div>
      </div>
      <!-- 列表主体 -->
      <div class="data_content" v-if="data && data.length !== 0">
        <load ref="dataLoad" :callback="getData">
          <ul slot="slot_list">
            <li class="list_item borBom" v-for="k in data" :key="k.id">
              <div v-show="k.number" class="num">{{k.number}}</div>
              <i class="more iconfont iconyou" @click="openAddgoods(k)"></i>
              <div class="left">
                <div class="tag">
                  <span>{{k.树种}}</span>
                  <span>{{k.品类}}</span>
                  <span>{{k.等级}}</span>
                </div>
                <div class="info">
                  <p class="size">
                    <span class="pr">规格：{{k.厚度}}*{{k.宽度}}*{{k.长度*1000}}</span>
                    <span>{{k.片数}}根/{{k.amount}}m³</span>
                  </p>
                  <p>
                    <span class="adress pr">
                      <i class="iconfont icondizhi"></i>
                      {{k.warestoreName}}
                    </span>
                    数量：
                    <span
                      style="color: rgba(39, 137, 237, 1);"
                    >{{k.packageNumber-k.lockedNumber}}</span>
                    /
                    {{k.packageNumber}}件
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </load>
      </div>
      <div v-else class="data_content">
        <p class="null">未查询到该记录</p>
      </div>
    </div>
    <!-- 已选商品 -->
    <div class="main" v-if="visible.lookgoods">
      <div class="borBom title">
        <div class="top" style="color:#2789ed">已选商品</div>
      </div>
      <div class="data_content look">
        <ul slot="slot_list">
          <li class="list_item borBom" v-for="k in chooseList" :key="k.id">
            <div class="num">{{k.number}}</div>
            <i class="more iconfont iconyou" @click="openAddgoods(k)"></i>
            <div class="left">
              <div class="tag">
                <span>{{k.树种}}</span>
                <span>{{k.品类}}</span>
                <span>{{k.等级}}</span>
              </div>
              <div class="info">
                <p class="size">
                  <span class="pr">规格：{{k.厚度}}*{{k.宽度}}*{{k.长度*1000}}</span>
                  <span>{{k.片数}}根/{{k.立方数}}m³</span>
                </p>
                <p>
                  <span class="adress pr">
                    <i class="iconfont icondizhi"></i>
                    {{k.warestoreName}}
                  </span>
                  数量：{{k.packageNumber-k.lockedNumber}}/
                  <span
                    style="color: rgba(39, 137, 237, 1);"
                  >{{k.packageNumber}}件</span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="foot" v-if="!visible.lookgoods">
      <div class="left">
        <p>
          总价:
          <span>￥{{totalPrice}}</span>
        </p>
      </div>
      <div class="right">
        <button class="lf" @click="visible.lookgoods=true">已选{{chooseList.length}}件</button>
        <button class="ri" @click="closeAdd">选好了</button>
      </div>
    </div>
    <div class="foot" v-if="visible.lookgoods">
      <div class="left">
        <p>
          总价:
          <span>￥{{totalPrice}}</span>
        </p>
      </div>
      <div class="right">
        <button class="lf" @click="visible.lookgoods=false">继续添加</button>
        <button class="ri" @click="closeAdd">选好了</button>
      </div>
    </div>
    <!-- 类目 -->
    <nut-actionsheet
      :is-visible="visible.category"
      :menu-items="category"
      optionTag="value"
      @choose="chooseCategory"
      :chooseTagValue="nowCategory.value"
      @close="visible.category=false"
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
                :class="{ active: aa.id==v.id}"
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
                :class="{ active: cate.includes(v)}"
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
                  >{{v}}</option>
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
                  >{{v}}</option>
                </select>
              </div>
              <div style="display:flex;width:100%;background-color:#fff">
                <span style="flex:1">长度：</span>
                <select class="selBox" v-model="value3" @change="handleChange">
                  <option value disabled selected style="display:none;">请选择</option>
                  <option
                    style="background-color:#fff;border: none;"
                    :value="v"
                    v-for="v in  list3"
                    :key="v"
                  >{{v}}</option>
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
    <!-- 选择商品 -->
    <nut-actionsheet :is-visible="visible.addgoods" @close="visible.addgoods=false">
      <div slot="custom" class="addgoods_warp">
        <div class="goodsInfo">
          <p class="p1">
            {{choose.品类}}
            <i @click="visible.addgoods=false" class="iconfont iconguanbi"></i>
          </p>
          <p class="p2">
            <span>{{choose.品牌}}</span>
            <span>{{choose.树种}}</span>
            <span>{{choose.等级}}</span>
          </p>
          <p class="p3">
            <span>规格：{{ choose.厚度 }}*{{ choose.宽度 }}*{{ choose.长度*1000 }}</span>
            <span>{{ choose.片数 }}支/{{ choose.amount }}m³</span>
            <span>库存：{{ choose.packageNumber }}件</span>
            <span>可售件数：{{ choose.packageNumber - choose.lockedNumber }}件</span>
          </p>
        </div>
        <div class="np">
          <span>价格</span>
          <input type="text" placeholder="¥0.00" v-model="price" />
        </div>
        <div class="np">
          <span>数量</span>
          <nut-stepper
            style="display: inline-flex;vertical-align: middle"
            :simple="false"
            :value.sync="number"
            :min="0"
            :max="choose.packageNumber - choose.lockedNumber"
          ></nut-stepper>
        </div>
        <div class="addbtn">
          <nut-button block shape="circle" @click="addGoods">添加商品</nut-button>
        </div>
      </div>
    </nut-actionsheet>
  </div>
</template>

<script>
import load from './loading'
import sidebar from './sidebar'
export default {
  name: "addgoods",
  props: ['chooseL'],
  data() {
    return {
      price: '',
      number: 0,
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
      sideInfo: [],
      visible: {
        category: false,
        sidebar: false,
        addgoods: false,
        lookgoods: false,
      },
      nowCategory: { id: 2, value: '实木板材' },
      pageNum: 1,
      ismoreobj: [],
      data: [0, 1, 2, 3, 4, 5, 6],
      startX: null,
      disX: 0,
      choose: {},
      chooseList: this.chooseL ? this.chooseL : []
    }
  },
  computed: {
    // 库存合计
    category() {
      let data = this.$store.state.data
      console.log(data)
      if (!data || data.length === 0) {
        this.$getCategory(this.getStoreDate, val => {
          this.$store.commit('setCategory', val)
        })
      }
      return this.$store.state.category
    },
    numAll() {
      let sum = 0
      if (this.data) {
        this.data.forEach(item => {
          sum += item.packageNumber
        })
      }
      return sum
    },
    cubicAll() {
      let sum = 0
      if (this.data) {
        this.data.forEach(item => {
          if (item.hasOwnProperty('amount'))
            sum += Number(item.amount * item.packageNumber)
        })
      }
      var reg = /\d{1,3}(?=(\d{3})+$)/g
      return (sum.toFixed(3) + '').replace(reg, '$&,')
    },
    totalPrice() {
      let sum = 0
      if (this.chooseList.length > 0) {
        this.chooseList.forEach(item => {
          sum += (item.price * Number(item.number) * item.amount)
        })
      }
      return sum.toFixed(2)
    }
  },
  methods: {
    //选择类目
    chooseCategory(data) {
      this.nowCategory = data;
      this.visible.category = false;
    },
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
      this.getStoreDate()
    },
    // 筛选选择
    showSelect(k, v) {
      if (this.cate.includes(v)) {
        delete (this.active[k.key]);
        this.cate = Object.values(this.active)
        this.getStoreDate()
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
      this.getStoreDate()
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
      this.getStoreDate()
    },
    async getStoreDate() {
      let activeInfo = JSON.stringify(this.active) == "{}" ? '' : JSON.stringify(this.active)
      activeInfo = "," + activeInfo.replace(/\{|}|"/g, "")
      const res = await this.$axios.get(
        'http://192.168.0.199:8066/goodsWarestoreTable/showGoodListPage',
        {
          params: {
            tenantId: this.GLOBAL.token.tenantId,
            attribute: '品类:' + this.nowCategory.value + this.size + activeInfo,
            warestoreId: this.aa.id,
            numberState: 1
          }
        }
      )
      if (res.data && res.data.data) {
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

        // 对比已选项
        if (this.chooseList.length > 0) {
          this.chooseList.forEach(v => {
            this.data.forEach(item => {
              if (item.id == v.id) {
                this.$set(item, 'number', v.number)
                this.$set(item, 'price', v.price)
              }
            })
          })
        }
      } else {
        this.data = []
      }

    },
    //获取更多数据
    getData() {
      setTimeout(() => {
        this.data.push(this.data.length);
        this.data.push(this.data.length);
        this.data.push(this.data.length);
        this.data.push(this.data.length);
        if (this.data.length > 20) {
          this.$refs.dataLoad.closeUp();
        } else {
          this.$refs.dataLoad.fin();
        }
      }, 1000)
    },
    //打开筛选
    openSidebar() {
      for (let i = 0; i < 20; i++) {
        this.ismoreobj.push(true);
      }
      this.visible.sidebar = true;
    },
    //打开添加商品
    openAddgoods(k) {
      this.visible.addgoods = true
      this.choose = k
      this.price = k.price ? k.price : ''
      this.number = k.number ? k.number : 0
    },
    // 确认添加
    addGoods() {
      if (!this.price) return this.$toast.text('请输入价格')
      this.visible.addgoods = false
      if (Number(this.number) != 0) {
        if (this.chooseList.length > 0) {
          this.chooseList = this.chooseList.filter(item => item.id != this.choose.id)
          this.chooseList.push({ ...this.choose, number: Number(this.number), price: this.price })
        } else {
          this.chooseList.push({ ...this.choose, number: Number(this.number), price: this.price })
        }
      } else {
        this.chooseList = this.chooseList.filter(item => item.id != this.choose.id)
        this.getStoreDate()
      }
      // console.log(this.chooseList)
      this.chooseList.forEach(v => {
        this.data.forEach(item => {
          if (item.id == v.id) {
            this.$set(item, 'number', v.number)
            this.$set(item, 'price', v.price)
          }
        })
      })
    },
    //选好了
    closeAdd() {
      this.$emit('next', this.chooseList)
    },
    //检测左右滑动
    touchStart(e) {
      e = e || event
      if (e.touches.length === 1) {
        this.startX = e.touches[0].clientX // 记录开始位置
        this.disX = 0
      }
    },
    touchMove(e) {
      e = e || event
      if (e.touches.length === 1) {
        this.disX = e.touches[0].clientX - this.startX
      }
    },
    touchEnd(e) {
      e = e || event
      this.Einfo = this.disX;
      this.move(this.disX)
    },
    move(data) {
      if (data < 100) return
      this.$emit('next', this.chooseList)
    }
  },
  components: {
    load, sidebar
  }
}
</script>

<style scoped lang="scss">
#addgoods {
  height: 100%;
  .search {
    padding: 0.3rem 0.5rem;
    height: 0.6rem;
  }
  .main {
    height: calc(100% - 1rem);
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
    box-shadow: 0px -2px 6px 0px rgba(51, 51, 51, 0.12);
    overflow: hidden;
    .title {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      .top {
        font-size: 0.24rem;
        padding: 0 0.3rem;
        line-height: 0.5rem;
        text-align: center;
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
          width: 65%;
          height: 0.5rem;
          color: #2789ed;
          span {
            display: inline-block;
            width: 50%;
            text-align: center;
            i {
              font-size: 0.24rem;
            }
          }
        }
        .right {
          float: right;
          width: 33%;
          box-sizing: border-box;
          color: #333333;
          font-size: 0.24rem;
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
      }
      .checkInfo {
        overflow: auto;
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
      height: calc(100% - 2rem);
      li {
        position: relative;
        width: 100%;
        height: 1.94rem /* 97/50 */;
        background: rgba(255, 255, 255, 1);
        padding: 0.3rem;
        box-sizing: border-box;
        .num {
          position: absolute;
          top: 0.8rem;
          right: 0.9rem;
          padding: 0 0.15rem;
          height: 0.36rem;
          line-height: 0.36rem;
          background: #65b2ff;
          color: #fff;
          border-radius: 9px;
        }
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
            margin: 0 0.1rem;
            color: #666666;
          }
        }
        .info {
          .pr {
            padding-right: 0.5rem;
          }
          .size {
            padding: 0.2rem 0;
            font-family: Source Han Sans CN;
          }
          .adress {
            i {
              vertical-align: middle;
            }
            font-size: 0.24rem;
            font-weight: 500;
            color: rgba(39, 137, 237, 1);
          }
        }
      }
    }
    .data_content.look {
      height: calc(100% - 1rem);
      overflow: auto;
    }
  }
  .foot {
    height: 1rem;
    .right {
      float: right;
      height: 100%;
      line-height: 1rem;
      padding-right: 0.3rem;
      button {
        width: 2.2rem;
        height: 0.76rem;
      }
      .lf {
        border: 1px solid #3482ee;
        background: #ffffff;
        color: #3482ee;
        border-radius: 19px 0px 0px 19px;
      }
      .ri {
        background: linear-gradient(
          90deg,
          rgba(52, 130, 238, 1) 0%,
          rgba(93, 159, 243, 1) 100%
        );
        border-radius: 0px 19px 19px 0px;
        color: #fff;
      }
    }
    .left {
      float: left;
      height: 100%;
      overflow: hidden;
      p {
        padding-left: 0.3rem;
        font-size: 0.24rem;
        margin-top: 0.36rem;
        color: #333333;
        span {
          color: #ed273a;
        }
      }
    }
    .left:last-child {
      width: 40%;
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
.addgoods_warp {
  height: 5.5rem;
  background-color: #ffffff;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  .goodsInfo {
    width: 5.9rem;
    height: 2.2rem;
    padding: 0.4rem 0.5rem;
    border-radius: 0.3rem;
    background-color: #ffffff;
    margin: 0 auto;
    transform: translateY(-50%);
    box-shadow: 0px 8px 20px 0px rgba(51, 51, 51, 0.12);
    .p1 {
      color: #3986ef;
      font-size: 0.32rem;
      line-height: 0.5rem;
      i {
        float: right;
        color: #333333;
        font-weight: 700;
      }
    }
    .p2 {
      margin-top: 0.2rem;
      margin-bottom: 0.1rem;
      span {
        padding: 0 0.2rem;
        line-height: 0.4rem;
        border-radius: 0.4rem;
        background-color: #f5f5f5;
        color: #999999;
        margin-right: 0.2rem;
      }
    }
    .p3 {
      span {
        margin-right: 0.5rem;
        font-size: 0.28rem;
        color: #333333;
        line-height: 0.5rem;
        display: inline-block;
      }
    }
  }
  .np {
    transform: translateY(-1rem);
    height: 0.56rem;
    margin-bottom: 0.3rem;
    padding: 0 0.6rem;
    color: #333333;
    font-size: 0.28rem;
    span {
      margin-right: 0.3rem;
    }
    input {
      width: 3rem;
      height: 100%;
      background-color: #f5f5f5;
      border-radius: 1rem;
      text-indent: 1em;
      font-size: 0.28rem;
    }
  }
  .addbtn {
    transform: translateY(-1rem);
    padding: 0 0.6rem;
    margin-top: 0.6rem;
  }
}
.goods-enter,
.goods-leave-to {
  transform: translateX(100%);
}
.goods-enter-active,
.goods-leave-active {
  transition: 5s;
}
.goods-enter-to,
.goods-leave {
  transform: translateX(0);
}
</style>
