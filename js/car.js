/**
 * Created by Administrator on 2017/5/14.
 */
/*
* @Author: Administrator
* @Date:   2017-05-14 10:49:34
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-17 22:50:33
*/

'use strict';
// 购物车全选和反选
;(function(){

		// 获取全选按钮框
		var checkbox=document.querySelector('.pro-t .checkbox-wrap');
		// 获取除全选之外，其他的按钮框
		var checkList=document.querySelectorAll('.pro-b .checkbox-wrap');
		// 获取全选按钮下的表单
		var oInp=checkbox.querySelector('input[type="checkbox"]');
		// 获取除全选之外的，其他的按钮框下的表单
		var aInp=document.querySelectorAll('.pro-b input[type="checkbox"]');
		// 全选
		oInp.addEventListener('click',function(){
				this.parentNode.classList.toggle('checked');
				// 检测这个选项框是否包含checked类名
				if(this.parentNode.classList.contains('checked')){
					for (var i = 0; i < aInp.length; i++) {
						aInp[i].checked=true;
						aInp[i].parentNode.classList.add('checked');
					}
				}else{
					for (var i = 0; i < aInp.length; i++) {
						aInp[i].checked=false;
						aInp[i].parentNode.classList.remove('checked');
					}
				}
		})
		// 反选
		for (var i = 0; i < aInp.length; i++) {
			aInp[i].addEventListener('click', function(){
			this.parentNode.classList.toggle('checked');
			for (var j = 0;  j< aInp.length; j++) {
				if(aInp[j].checked===false){
						oInp.checked=false;
						oInp.parentNode.classList.remove('checked');
						return;
				}
				oInp.checked=true;
				oInp.parentNode.classList.add('checked');
			}
			})
		}

})()

// 垃圾桶动画
;(function(){
	var del=document.querySelectorAll('.car-pro .pro-b .del-wrap');//获取垃圾总盒子
	// 取消按钮
	var cancel=document.querySelector('.jd-modal .jd-modal-b button');
	//确定按钮
	var sure=document.querySelector('.jd-modal .jd-modal-b button.sure');
	var delWrap=document.querySelectorAll('.pro-items');
	for (var i = 0; i < del.length; i++) {
		del[i].index=i;
		del[i].addEventListener('click', function(){
			//获取当前盒子里的垃圾盖
			var delT=this.querySelector('.car-pro .pro-b .del-t');
			//让垃圾盖做动画
			delT.style.transition='transform .5s';
			delT.style.transform='rotate(-20deg) translateX(-2px)';
			//显示遮罩层
			var jdMmodal=document.querySelector('.jd-modal');
			jdMmodal.style.display='block';
			cancel.addEventListener('click', function(){
				delT.style.transform='none';
				// this.parentNode.parentNode.parentNode.style.display='none';
				jdMmodal.style.display='none';
			})
			var count=this.index;
			sure.addEventListener('click', function(){
				delT.style.transform='none';
				jdMmodal.style.display='none';
				delWrap[count].style.display='none';
		})
		})
		
	};
})()

// 加减的逻辑
;(function(){
	//商品数量增加逻辑
	var btnsWrap=document.querySelectorAll('.btns-wrap');//获取的是所有的btnWrap;
	for (var i = 0; i < btnsWrap.length; i++) {
		carJiajian(i);
	};
	function carJiajian(m){
		var tipsWord=document.querySelector('.tips-word');
		var count=0;
		var jian=btnsWrap[m].querySelector('.jian');//只获取btnsWrap里的一个减span
		var carCount=btnsWrap[m].querySelector('input[type="number"]');//只获取btnsWrap里的一个a按钮
		var jia=btnsWrap[m].querySelector('.jia');//只获取btnsWrap里的一个加span
		jian.onmouseover=function(){
			this.style.cursor='pointer';
		}
		jia.onmouseover=function(){
			this.style.cursor='pointer';
		}
		jia.addEventListener('click', function(){
			tipsWord.style.display='none';
			count++;
			carCount.value=count;
			// this.parentNode.children[1].children[0].value=count;
		})
		jian.addEventListener('click', function(){
			count--;
			if(count<=1){
				count=1;
				tipsWord.style.display='block';
			}
			carCount.value=count;
		})
	}
})()