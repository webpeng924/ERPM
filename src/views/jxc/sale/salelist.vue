<template>
  <div class="salelist">
    <div class="search">
      <div class="search_warp">
        <i class="iconfont iconsousuo"></i>
        <input type="text" placeholder="销售单号" v-model="likeNo" @keyup.enter="getSaleList" />
      </div>
      <div class="right">
        <span @click="visible.state = !visible.state">
          筛选
          <i class="iconfont iconshaixuan"></i>
        </span>
      </div>
    </div>
    <!-- 筛选框 -->
    <div class="title">
      <transition name="state">
        <div class="state_main" v-if="visible.state" @click.self="visible.state = false">
          <div class="sc">
            <ul class="cl">
              <li
                class="item"
                v-for="(item, index) in tabs"
                :key="index"
                :class="{ active: index == num }"
                @click="tab(index)"
              >{{ item }}</li>
            </ul>
            <div class="cr">
              <div v-for="(itemCon, index) in tabs" v-show="index == num" :key="index" class="item">
                <div
                  class="item"
                  @click="showSelect(itemCon, v)"
                  :class="{ active: cate.includes(v.name) }"
                  v-for="v in tabContents[itemCon]"
                  :key="v.id"
                >
                  {{ v.name }}
                  <i class="iconfont iconhuaban1" v-show="cate.includes(v.name)"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- 列表主体 -->
    <div class="main">
      <div v-if="list.length > 0" class="content">
        <load ref="load">
          <ul slot="slot_list">
            <div style="height: 0.1rem;line-height:0.1rem;background-color: #F5F5F5"></div>
            <li class="content_li" v-for="i in keys" :key="i">
              <div style="background-color: #F5F5F5">
                <p class="date">{{ i }}</p>
              </div>
              <div class="content-it" v-for="v in data[i]" :key="v.id">
                <div style="height: 0.1rem;line-height:0.1rem;background-color: #F5F5F5"></div>
                <div class="it borBom">
                  <i class="iconfont iconyou" @click="jump(v.id)"></i>
                  <p style="color: #2789ED">
                    {{ v.orderNo }}
                    <span v-if="v.isTax == 1" class="ricon">税</span>
                  </p>
                  <p>
                    <span>{{ v.contactName }}</span>
                    <span class="s1">¥{{ v.orderAmount }}</span>
                  </p>
                  <p>
                    <span class="s2">{{ v.carNo }}</span>
                    <span class="s3">{{ v.orderPackages }}件</span>
                  </p>
                </div>
                <div class="it-bom">
                  <span class="name">{{ v.creatorName }}</span>
                  <span class="bumen">{{ v.deptName }}</span>
                  <nut-button type="red" shape="circle" small>
                    {{
                    v.state | State
                    }}
                  </nut-button>
                </div>
                <div style="height: 0.1rem;line-height:0.1rem;background-color: #F5F5F5"></div>
              </div>
            </li>
          </ul>
        </load>
      </div>
      <div v-else class="null">未查询到销售单</div>
    </div>
    <!-- 底部按钮 -->
    <div>
      <nut-button class="fixd-bom" block @click="$router.push({ name: 'newsale' })">新增销售开单</nut-button>
    </div>
  </div>
</template>

<script>
import load from '../../../components/loading'
export default {
  name: 'salelist',
  components: {
    load
  },
  data() {
    return {
      tabs: ['销售员', '客户名称', '是否含税', '审核状态', '理货状态'],
      tabContents: {},
      num: 0,
      data: {},
      keys: [],
      visible: {
        state: false
      },
      list: [],
      likeNo: '',
      cate: [],
      active: {}
    }
  },
  created() {
    this.getSaleList()
  },
  filters: {
    // 状态显示
    State(value) {
      if (value == 0) {
        return '已取消'
      } else if (value == 1) {
        return '待审核'
      } else if (value == 2) {
        return '已审核'
      } else if (value == 3) {
        return '待出库'
      } else if (value == 6) {
        return '出库中'
      } else if (value == 7) {
        return '已出库'
      } else if (value == 9) {
        return '已完成'
      }
    }
  },
  methods: {
    tab(index) {
      this.num = index
    },
    // 筛选选择
    showSelect(k, v) {
      if (this.cate.includes(v.name)) {
        delete this.active[k]
        this.cate = Object.values(this.active).map(item => item.name)
      } else {
        this.$set(this.active, k, v)
        this.cate = Object.values(this.active).map(item => item.name)
      }
      this.getSaleList()
      console.log(this.active)
      console.log(this.cate)
    },
    // 获取页面数据
    async getSaleList() {
      this.list = []
      this.data = {}
      const res = await this.$axios.get(
        'http://192.168.0.199:7077/sell/showSellsList',
        {
          params: {
            tenantId:this.GLOBAL.token.tenantId,
            orderNo: Number(this.likeNo),
            openApproveState: this.active['审核状态'] ? this.active['审核状态'].id : '',
            checkApproveState: this.active['理货状态'] ? this.active['理货状态'].id : '',
            contactId: this.active['客户名称'] ? this.active['客户名称'].id : '',
            creatorId: this.active['销售员'] ? this.active['销售员'].id : '',
            isTax: this.active['是否含税'] ? this.active['是否含税'].id : '',
          }
        }
      )
      console.log(res)
      if (res.data && res.data.data && res.data.data.length > 0) {
        this.list = res.data.data
        let fp = this.list.map(item => item.sellTime.split('T')[0])
        for (let i in fp) {
          if (!this.data[fp[i]]) {
            this.data[fp[i]] = [this.list[i]]
          } else {
            this.data[fp[i]].push(this.list[i])
          }
        }
        this.keys = Object.keys(this.data)

        let arr1 = this.list.map(item => {
          return { name: item.creatorName, id: item.creatorId }
        })
        let arr2 = this.list.map(item => {
          return { name: item.contactName, id: item.contactId }
        })

        let creatorName = []
        let obj1 = {}
        for (let i = 0; i < arr1.length; i++) {
          if (!obj1[arr1[i].id]) {
            creatorName.push(arr1[i])
            obj1[arr1[i].id] = true
          }
        }
        let contactName = []
        let obj2 = {}
        for (let i = 0; i < arr2.length; i++) {
          if (!obj2[arr2[i].id]) {
            contactName.push(arr2[i])
            obj2[arr2[i].id] = true
          }
        }
        this.tabContents = {
          销售员: creatorName,
          客户名称: contactName,
          是否含税: [
            { name: '含税', id: 1 },
            { name: '不含税', id: 2 }
          ],
          审核状态: [
            { name: '未审核', id: 1 },
            { name: '已审核', id: 2 }
          ],
          理货状态: [
            { name: '未理货', id: 1 },
            { name: '已理货', id: 2 }
          ]
        }
      }
      console.log(this.tabContents)
    },
    //跳转详情
    jump(id) {
      this.$router.push({
        name: 'saleinfo',
        params: { id: id }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.salelist {
  height: 100%;
  .search {
    padding: 0.2rem 0.5rem;
    height: 0.6rem;
    margin-right: 1rem;
    font-size: 0.24rem;
    position: relative;
    .right {
      position: absolute;
      top: 0.38rem;
      right: -0.7rem;
      i {
        vertical-align: middle;
      }
    }
  }
  .main {
    height: calc(100% - 1.1rem);
    overflow: hidden;
    .content {
      height: 100%;
      ul {
        padding-bottom: 0.8rem;
        .content_li {
          .date {
            font-size: 0.24rem;
            color: #999;
            padding-left: 0.3rem;
          }
          .it {
            height: 1.56rem;
            font-size: 0.24rem;
            margin: 0.3rem 0.3rem 0 0.3rem;
            // padding-bottom: 0.2rem;
            box-sizing: border-box;
            text-align: right;
            position: relative;
            i {
              position: absolute;
              right: 0;
              top: 0.5rem;
            }
            p {
              text-align: left;
              margin-top: 0.24rem;
              color: #999999;
              .ricon {
                display: inline-block;
                width: 0.28rem;
                height: 0.28rem;
                line-height: 0.28rem;
                text-align: center;
                background: #f5f5f5;
                border-radius: 50%;
                font-size: 0.2rem;
                color: #ed273a;
                margin-left: 0.1rem;
              }
              span {
                color: #333333;
              }
            }
            .s3 {
              text-align: right;
              padding-left: 0.4rem;
              box-sizing: border-box;
            }
            .s1 {
              float: right;
              color: #ed273a;
              font-size: 0.28rem;
              padding-right: 0.4rem;
            }
          }
          .it-bom {
            padding: 0.14rem 0.3rem;
            height: 0.7rem;
            box-sizing: border-box;
            .name {
              text-align: center;
              line-height: 0.44rem;
              height: 0.44rem;
              background: rgba(245, 245, 245, 1);
              border-radius: 11px;
              color: #333333;
              font-size: 0.24rem;
              float: left;
              padding: 0 0.2rem;
            }
            .bumen {
              line-height: 0.44rem;
              font-size: 0.2rem;
              color: #999;
              padding-left: 0.12rem;
              float: left;
            }
            .nut-button {
              float: right;
              width: 1.3rem;
              height: 0.44rem;
              padding: 0;
            }
          }
        }
      }
    }
    .null {
      text-align: center;
      height: 0.24rem;
      font-size: 0.24rem;
      color: rgba(102, 102, 102, 1);
      padding-top: 0.4rem;
    }
  }
  .state_main {
    position: fixed;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    top: 1rem;
    left: 0;
    width: 100%;
    z-index: 1;
    overflow: hidden;
    .sc {
      overflow: hidden;
      background-color: #ffffff;
      .cl {
        width: 30%;
        float: left;
        background-color: #f5f5f5;
        text-align: center;
      }
      .cr {
        width: 70%;
        float: left;
      }
      .item {
        padding: 0 0.3rem;
        height: 0.9rem;
        line-height: 0.9rem;
        font-size: 0.28rem;
        color: #333333;
        i {
          float: right;
          font-size: 0.4rem;
        }
      }
      .item.active {
        background-color: #ffffff;
        color: #2789ed;
      }
    }
  }
  .state-enter,
  .state-leave-to {
    opacity: 0;
  }
  .state-enter-active,
  .state-leave-active {
    transition: opacity 0.5s;
  }
  .state-enter-to,
  .state-leave {
    opacity: 1;
  }
  .fixd-bom {
    position: fixed;
    bottom: 0;
  }
}
</style>
