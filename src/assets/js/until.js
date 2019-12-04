let utils = {
	//数组去重
	uniq(array){
		let type = Object.prototype.toString.call(array);
		if(type !== '[object Array]'){
			console.log('输入值不是数组');
			return []
		}
		let temp = [],obj={};
		for(let i in array){obj[array[i]]=''}
		for(let i in obj){temp.push(i)}
		return temp;
	}
};
export default utils;
