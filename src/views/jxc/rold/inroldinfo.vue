<template>
	<div id="inroldinfo">
		<div class="search">
			<div class="search_warp">
				<i class="iconfont icon-pingbi2"></i>
				<input type="text">
				<i class="iconfont icon-pingbi2"></i>
			</div>
		</div>
		<div class="main">
			<div class="title borBom">
				<div class="top clearfix">
					<div class="left">
						<span class="textover" @click="visible.category=true">{{nowCategory.value}}<i class="iconfont icon-pingbi2"></i></span>
					</div>|
					<div class="right">
						<span @click="openSidebar">筛选<i class="iconfont icon-pingbi2"></i></span>
					</div>
				</div>
				<div class="checkInfo textover">
					<div class="content">
						<div class="item">阿道夫</div><div class="item">开机</div><div class="item">DFOJLL</div>
						<div class="item">阿道夫</div><div class="item">开机</div><div class="item">DFOJLL</div>
						<div class="item">阿道夫</div><div class="item">开机</div><div class="item">DFOJLL</div>
					</div>
				</div>
				<div class="tongInfo">
					<p><span class="cb">提单号 <i>sdfsdfsddfgsd</i></span>仓储合计：<span>2233</span>件，<span>145,125</span>m³</p>
				</div>
			</div>
			<div class="content">
				<load ref="load" :callback="getData">
					<ul slot="slot_list">
						<li class="content_item borBom" v-for="k in data" :key="k">
							<div class="bian">
								<span>NO.556565768232</span>
								<span>GP:ERTY3462DVD</span>
							</div>
							<div class="guiInfo">
								<span class="item">{{k}}</span><span class="item">开机</span><span class="item">DFOJLL</span>
							</div>
							<div class="ds">
								<span>规格：200*200*200</span>
								<span>100支/2.154m³</span>
							</div>
							<p class="date">OCR:2018-12-25</p>
						</li>
						<li class="content_item borBom">
							正在加载
						</li>
					</ul>
				</load>
			</div>
		</div>
		<!-- 类目选择 -->
		<nut-actionsheet :is-visible="visible.category" :menu-items="category" optionTag="value" @choose="chooseCategory" :chooseTagValue="nowCategory.value" @close="visible.category=false"></nut-actionsheet>
		<!-- 侧边栏 -->
		<sidebar :is-visible="visible.sidebar" @close="visible.sidebar=false">
			<div slot class="sidebar_content">
				<div class="item_box">
					<div class="item" v-for="k in 10" :key="k">
						<div class="item_title">
							<span class="title">品名{{k}}</span>
							<span v-if="k>6" @click="ismoreobj.splice(k-1,1,!ismoreobj[k-1])">{{ismoreobj[k-1]?'更多':'收起'}}<i class="iconfont icon-pingbi2"></i></span>
						</div>
						<div class="content_item" :class="{minH:ismoreobj[k-1]}">
							<div class="textover" :class="{active:v%2===0}" v-for="v in k" :key="v">云杉{{v}}</div>
						</div>
					</div>
				</div>
				<div class="content_btnGroup">
					<nut-buttongroup>
						<nut-button type="light">重置</nut-button>
						<nut-button @click="visible.sidebar=false">确定</nut-button>
					</nut-buttongroup>
				</div>
			</div>
		</sidebar>
	</div>
</template>

<script>
	import sidebar from '../../../components/sidebar'
	import load from '../../../components/loading'
	export default {
		name: "inroldinfo",
		data(){
			return{
				visible:{
					category:false,
					sidebar:false
				},
				nowCategory:{id:0,value:'全部'},
				ismoreobj:[],
				data:[1,2,3,4,5,6,7,8,9],
				pageNum1:10
			}
		},
		computed:{
			category:function () {
				let data = this.$store.state.category;
				if(!data||data.length===0){
					this.$getCategory(this.$axios,(val)=>{this.$store.commit('setCategory',val)})
				}
				return this.$store.state.category;
			}
		},
		methods:{
			chooseCategory(data){
				this.nowCategory = data;
				this.visible.category = false;
			},
			//打开侧边栏
			openSidebar(){
				for(let i = 0;i<10;i++){
					this.ismoreobj.push(true);
				}
				this.visible.sidebar = true;
			},
			//
			getData(){
				setTimeout(()=>{
					this.data.push(this.pageNum1++);
					this.data.push(this.pageNum1++);
					if(this.pageNum1>20){
						this.$refs.load.closeUp()
					}else{
						this.$refs.load.fin()
					}
				},2000)
			}
		},
		components:{
			sidebar,load
		}
	}
</script>

<style scoped lang="scss">
#inroldinfo{
	height: 100%;
	.search{
		padding: 0.2rem 0.5rem 0.3rem;
		height: 0.6rem;
	}
	.main{
		height: calc(100% - 1.1rem);
		border-top-left-radius: 0.4rem;
		border-top-right-radius: 0.4rem;
		box-shadow:0px -2px 6px 0px rgba(51,51,51,0.12);
		overflow: hidden;
		.title{
			padding-top: 0.25rem;
			padding-bottom: 0.25rem;
			text-align: center;
			.top{
				padding: 0 0.3rem;
				line-height: 0.5rem;
			}
			.left{
				float: left;
				width: 65%;
				height: 0.5rem;
				span{
					display: inline-block;
					width: 50%;
					text-align: center;
					color: #333333;
					i{
						vertical-align: middle;
						margin-left: 5px;
					}
				}
				span.active{
					color: #2789ED;
				}
			}
			.right{
				float: right;
				width: 33%;
				color: #333333;
				font-size:0.3rem;
				text-align: center;
				vertical-align: middle;
				i{
					vertical-align: middle;
					margin-left: 5px;
				}
			}
			.checkInfo{
				overflow: auto;
				padding-bottom: 5px;
				padding-top: 0.2rem;
				.content{
					display: inline;
				}
				.item{
					padding:0 0.2rem;
					height: 0.44rem;
					line-height: 0.44rem;
					background-color: #F5F5F5;
					border-radius: 1rem;
					margin: 0 0.1rem;
					color: #666666;
					display: inline-table;
				}
			}
			.tongInfo{
				padding: 0.2rem 0.28rem 0;
				color: #999999;
				font-size: 0.24rem;
				text-align: left;
				span{
					color: #666666;
				}
				.cb{
					display: inline-block;
					padding: 0 0.2rem;
					background-color: #F5F5F5;
					height: 0.44rem;
					line-height: 0.42rem;
					font-size: 0.24rem;
					margin-right: 0.2rem;
					-webkit-border-radius: 0.44rem;
					-moz-border-radius: 0.44rem;
					border-radius: 0.44rem;
					i{
						font-size: 0.24rem;
						color: #2789ED;
					}
				}
			}
		}
		.content{
			height: calc(100% - 2.4rem);
			.content_item{
				padding: 0.3rem;
			}
			.bian{
				padding-bottom: 0.14rem;
				span{
					line-height: 0.32rem;
					padding-left: 0.2rem;
					padding-right: 0.2rem;
					background:linear-gradient(90deg,rgba(52,130,238,1) 0%,rgba(93,159,243,1) 100%);
					color: #FFFFFF;
					border-radius: 0.4rem;
					margin-right: 0.2rem;
					font-size: 0.24rem;
				}
			}
			.guiInfo{
				margin-bottom: 0.2rem;
				.item{
					padding-left: 0.2rem;
					padding-right: 0.2rem;
					line-height: 0.4rem;
					border-radius: 0.4rem;
					background-color: #F5F5F5;
					color: #999999;
					font-size: 0.28rem;
					margin-right: 0.2rem;
				}
			}
			.ds{
				margin-bottom: 0.2rem;
				span{
					display: inline-block;
					width: 55%;
					font-size: 0.28rem;
					color: #333333;
					margin-right: 5%;
				}
				span:last-child{
					width: 40%;
					margin-right: 0;
				}
			}
			.date{
				font-size: 0.24rem;
				color: #2789ED;
			}
		}
	}
}
</style>
