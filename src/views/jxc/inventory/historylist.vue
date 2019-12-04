<template>
  <div class="history">
    <div class="content">
      <load ref="load">
        <ul slot="slot_list">
          <li class="content_li" v-for="i in keys" :key="i">
            <div
              style="height: 0.44rem;line-height:0.44rem;background-color: #F5F5F5"
            >
              <p class="date">{{ i }}</p>
            </div>
            <div class="content-it borBom" v-for="v in data[i]" :key="v.id">
              <div class="it">
                <i class="iconfont iconyou"></i>
                <p>
                  <span class="s3">
                    <span class="ss">{{ v.fullName }}</span>
                    <span class="sa">共计{{ v.orderPackages }}件</span>
                  </span>
                  <span class="s1">
                    <span class="s2">共计：</span>
                    ¥{{ v.orderAmount }}
                  </span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </load>
    </div>
  </div>
</template>

<script>
import load from '../../../components/loading'
export default {
  components: {
    load
  },
  data() {
    return {
      data: {},
      keys: [],
      id: this.$route.params.id,
      list: [1, 2, 3]
    }
  },
  created() {
    this.getHistory()
  },
  methods: {
    async getHistory() {
      const res = await this.$axios.get(
        'http://192.168.0.199:7077/sell/showCustomerSell',
        {
          params: {
            contactId: this.id
          }
        }
      )
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
      console.log(this.data)
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
.history {
  height: 100%;
  overflow: hidden;
  .content {
    height: 100%;
    ul {
      .content_li {
        .date {
          font-size: 0.24rem;
          color: #999;
          padding-left: 0.3rem;
        }
        .it {
          height: 1rem;
          line-height: 1rem;
          font-size: 0.24rem;
          box-sizing: border-box;
          text-align: right;
          position: relative;
          i {
            position: absolute;
            right: 0.3rem;
          }
          p {
            text-align: left;
            color: #999999;
            display: flex;
            padding-right: 0.3rem;
            span {
              color: #333333;
            }
          }
          .s3 {
            flex: 1;
            padding-left: 0.4rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .ss {
              flex: 1;
              line-height: 50%;
              padding-top: 0.28rem;
            }
            .sa {
              flex: 1;
              line-height: 50%;
              color: #999999;
            }
          }
          .s2 {
            font-size: 0.28rem;
          }
          .s1 {
            text-align: right;
            flex: 1;
            color: #ed273a;
            font-size: 0.28rem;
            padding-right: 0.4rem;
          }
        }
      }
    }
  }
}
</style>
