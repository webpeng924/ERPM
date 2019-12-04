<template>
	<transition name="sidebar">
		<div v-if="isVisible" id="sidebar" @click.self="$emit('close')">
			<div class='warp'>
				<slot></slot>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: "sidebar",
		props:['isVisible']
	}
</script>

<style scoped lang="scss">
#sidebar{
	position: fixed;
	width: 100vw;
	height: 100%;
	top: 0;
	right: 0;
	background-color: rgba(0,0,0,0.5);
	.warp{
		position: absolute;
		top: 0;
		right: 0;
		width: 80vw;
		height: 100%;
		background-color: #FFFFFF;
		animation: warpIn 0.5s;
		animation-timing-function: ease-in-out;
	}
}
@keyframes warpIn {
	0% ,30% {
		right: -80vw;
	}
	
	100% {
		right: 0;
	}
}
.sidebar-enter,.sidebar-leave-to{
	opacity:0
}
.sidebar-enter-active,.sidebar-leave-active{
	transition: opacity 0.5s;
}
.sidebar-enter-to,.sidebar-leave{
	opacity:1
}
</style>
