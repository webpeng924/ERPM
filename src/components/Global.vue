<script>
const token = JSON.parse(sessionStorage.getItem('youmuUser'))
const role = JSON.parse(sessionStorage.getItem('role'))
export default
  {
    token,//用户信息
    role //用户权限
  }
</script>