<template>
  <div id="finish">
    <img src="../../../assets/img/创建成功_1.png" alt />
    <p>创建成功</p>
    <div class="btn">
      <nut-button
        block
        shape="circle"
        @click="$router.replace({name:'saleinfo',params:{id:id}})"
      >查看销售单</nut-button>
    </div>
    <div class="btn">
      <nut-button
        @click="$router.push({name:'newsale'})"
        block
        shape="circle"
        type="light"
        color="#3986EF"
      >继续开单</nut-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "newfin",
  data() {
    return {
      id: this.$route.params.id,
    }
  }
}
</script>

<style scoped lang="scss">
#finish {
  padding-top: 2rem;
  text-align: center;
  img {
    width: 1.46rem;
    height: 1.46rem;
  }
  p {
    font-size: 0.28rem;
    text-align: center;
    margin: 0.2rem 0 0.3rem;
  }
  .btn {
    width: 3rem;
    margin: 0 auto;
    padding-top: 0.2rem;
  }
}
</style>
