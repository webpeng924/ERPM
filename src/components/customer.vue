<template>
  <div id="cus" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <div class="search">
      <div class="search_warp">
        <i class="iconfont iconsousuo"></i>
        <input type="text" v-model="likeName" @keydown.enter="getData" placeholder="搜索" />
        <i class="iconfont iconjia" @click="addCustomer"></i>
      </div>
    </div>
    <div class="main">
      <div class="fbox" v-for="k in nameArr" :key="k">
        <div class="zim">{{ k }}</div>
        <div class="nitem borBom" v-for="(v, i) in nameObj[k]" :key="i" @click="check(v)">
          <div class="user">
            <img :src="v.logo | imgUrl" />
          </div>
          <div class="nm">
            <p>{{ v.fullName }}</p>
            <span style="color:#3482EE">联系人：{{ v.displayName }}</span>
            <span>应收：{{ v.orderReceivable?v.orderReceivable:0 }}</span>
          </div>
        </div>
      </div>
      <div class="sidebarbox">
        <div
          v-for="(v, k) in nameArr"
          :class="{
            active: scrollTop >= nameHei[k] && scrollTop < nameHei[k + 1]
          }"
          :key="k"
          @click.stop="runTo(k)"
        >{{ v }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import convert from '../assets/js/Convert_Pinyin'
export default {
  name: 'customer',
  data() {
    return {
      data: [],
      nameObj: {},
      nameArr: [],
      nameHei: [],
      scrollTop: 0,
      startX: null,
      disX: 0,
      likeName: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    addCustomer() {
      if (this.GLOBAL.role && this.GLOBAL.role.erp_customer_new) {
        this.$router.push({ name: 'addCustomer' })
      } else {
        this.$toast.fail('您没有新建客户的权限')
      }
    },
    // 获取客户信息
    async getData() {
      let code = this.GLOBAL.token.roleCompanyVoList.some(item => item.roleCode == 'ERP_SALEER')
      let params = {}
      if (code) {
        params = {
          tenantId: this.GLOBAL.token.tenantId,
          belongId: this.GLOBAL.token.id,
          contactType: 4,
          pageNum: 1,
          pageSize: 100,
          phone: this.likeName
        }
      } else {
        params = {
          tenantId: this.GLOBAL.token.tenantId,
          pageNum: 1,
          pageSize: 100,
          phone: this.likeName
        }
      }
      const res = await this.$axios.get(
        'http://192.168.0.199:7077/customerCompany/showCustomerCompanyPage',
        { params }
      )
      console.log(res.data.data.dataList)
      this.data = res.data.data.dataList
      this.proName()
    },
    //将姓名按首字母分组
    proName() {
      let firstName = []
      let data = {}
      this.data.forEach(val => {
        firstName.push(val.fullName.substring(0, 1))
      })
      // console.log(firstName)
      let fp = convert.getCamelChars(firstName.join('')).split('')
      // console.log(this.data)
      // console.log(fp)
      for (let i in fp) {
        if (!data[fp[i]]) {
          data[fp[i]] = [this.data[i]]
        } else {
          data[fp[i]].push(this.data[i])
        }
      }
      // console.log(data)
      this.nameArr = this.$utils.uniq(fp).sort(function (a, b) {
        if (a.toString().toLowerCase() > b.toString().toLowerCase()) return 1
        return -1
      })
      this.nameObj = data
      setTimeout(() => {
        this.getToFH()
      })
    },
    //获取每组数据到父元素的高度
    getToFH() {
      let Doms = document.getElementsByClassName('fbox')
      let temp = [0]
      let num = 0
      for (let i = 0, len = Doms.length; i < len; i++) {
        num = num + Doms[i].offsetHeight
        temp.push(num)
      }
      this.nameHei = temp
    },
    //设置滚动条距离
    runTo(index) {
      document
        .getElementsByClassName('main')[0]
        .scrollTo(0, this.nameHei[index])
    },
    //选择客户
    check(data) {
      this.$emit('next', data)
      console.log(data)
    },
    //后退
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
      // this.Einfo = this.disX;
      this.move(this.disX)
    },
    move(data) {
      if (data < 100) return
      this.$emit('next', null)
    }
  },
  mounted() {
    document
      .getElementsByClassName('main')[0]
      .addEventListener('scroll', () => {
        this.scrollTop = document.getElementsByClassName('main')[0].scrollTop
      })
  }
}
</script>

<style scoped lang="scss">
#cus {
  height: 100%;
  .search {
    padding: 0.2rem 0.3rem;
    height: 0.6rem;
    margin-right: 0.6rem;
    position: relative;
    .iconjia {
      position: absolute;
      top: 0.12rem;
      right: -0.6rem;
      font-size: 0.4rem;
      font-weight: 700;
    }
  }
  .main {
    height: calc(100% - 1rem);
    overflow: auto;
    .fbox {
      padding-top: 0.44rem;
      position: relative;
    }
    .nitem {
      height: 0.8rem;
      padding: 0.2rem 0.3rem;
      .user {
        float: left;
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 0.8rem;
        background-color: #999999;
        img {
          height: 0.8rem;
        }
      }
      .nm {
        float: left;
        width: calc(100% - 0.8rem);
        height: 100%;
        p {
          font-size: 0.32rem;
          color: #333333;
          padding-left: 0.3rem;
          line-height: 0.5rem;
        }
        span {
          padding-left: 0.3rem;
          font-size: 0.24rem;
          color: #999999;
        }
      }
    }
    .zim {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding-left: 0.3rem;
      line-height: 0.44rem;
      background-color: #f5f5f5;
      font-size: 0.24rem;
    }
    .sidebarbox {
      position: fixed;
      right: 0;
      top: 3rem;
      padding-right: 0.2rem;
      text-align: center;
      line-height: 0.4rem;
      font-size: 0.24rem;
      color: #333333;
      font-weight: 600;
      .active {
        color: #2789ed;
      }
    }
  }
}
</style>
