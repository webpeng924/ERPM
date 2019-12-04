<template>
	<div class="wrapper" ref="wrapper">
		<div class="content">
			<slot name="slot_list"></slot>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	export default {
		name: "loading",
		props:['callback'],
		data(){
			return{
			
			}
		},
		methods:{
			BS(){
				if(!this.$refs.wrapper){
					console.log('没有获取DOM');
					return
				}
				this.scroll = new BScroll(this.$refs.wrapper,{
					scrollY:true,
					pullUpLoad:{
						threshold:-100
					},
					click:true,
				});
				this.scroll.on('pullingUp',this.callback);
			},
			//加载完成
			fin(){
				this.scroll.finishPullUp();
			},
			//关闭上拉加载
			closeUp(){
				this.scroll.closePullUp();
			}
		},
		mounted() {
			setTimeout(()=>{
				this.BS()
			})
		}
		
	}
</script>

<style scoped lang="scss">
	.wrapper {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>
