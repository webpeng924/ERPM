<template>
  <div id="cuslist">
    <customer @next="checkCus"></customer>
  </div>
</template>

<script>
import customer from '../../../components/customer'
export default {
  name: 'customerlist',
  methods: {
    //选择客户
    checkCus(data) {
      if (data) {
        this.$router.push({
          name: 'customerinfo',
          params: { id: data.id }
        })
      }
    }
  },
  components: {
    customer
  }
}
</script>

<style scoped lang="scss">
#cuslist {
  height: 100%;
}
</style>
