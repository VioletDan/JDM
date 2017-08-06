/**
 * Created by Administrator on 2017/5/13.
 */
'use strict'
//列表样式
;(function () {
//    需求 滑动列表并产生反弹效果，
//    先让列表动起来再说
    scrollBounce('.aside');
    scrollBounce('.article');
    function scrollBounce(ele){
        var leftWrap=document.querySelector(ele);
        var leftWrapUl=leftWrap.querySelector('.scroll');
        leftWrapUl.addEventListener('touchstart',touchStartHandler);
        leftWrapUl.addEventListener('touchmove',touchMoveHandler);
        leftWrapUl.addEventListener('touchend',touchEndHandler);

        var startY=0;
        //为了让ul每次不从原点滑，设置一个变量来记录这个滑动的值,滑动结束后再把centerY+dy的值赋给centerY
        var centerY=0;
        //设置最大滑动区间
        var maxDown=10;
        var maxUp=-(leftWrapUl.offsetHeight-leftWrap.offsetHeight+10);

        //设置反弹
        var maxUpBounce=0;//向上反弹
        var maxDownBounce=-(leftWrapUl.offsetHeight-leftWrap.offsetHeight);//向下反弹
        //滑动开始
        function touchStartHandler(e){
            startY= e.changedTouches[0].clientY;
        }
        //滑动持续
        function touchMoveHandler(e){
            //每次移动的时候，要清过渡
            leftWrapUl.style.transition='none';
            var dy= e.changedTouches[0].clientY-startY;
            //判断滑动区间
            var tempY=centerY+dy;//new 一个临时变量用来存放滑动的距离
            if(tempY>=maxDown){
                tempY=maxDown;
            }else if(tempY<=maxUp){
                tempY=maxUp;
            }
            leftWrapUl.style.transform='translateY('+tempY+'px)';
        }
        //滑动结束
        function touchEndHandler(e){
            var dy= e.changedTouches[0].clientY-startY;
            centerY=centerY+dy;//代表最终的滑动距离
            //    判断反弹
            if(centerY>=maxUpBounce){
                centerY=maxUpBounce;
                //过渡
                leftWrapUl.style.transition='transform,.5s';
                //平移
                leftWrapUl.style.transform='translateY('+centerY+'px)';
            }else if(centerY<=maxDownBounce){
                centerY=maxDownBounce;
                //过渡
                leftWrapUl.style.transition='transform,.5s';
                //平移
                leftWrapUl.style.transform='translateY('+centerY+'px)';
            }
        }
    }
})()