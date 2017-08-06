/**
 * Created by Administrator on 2017/5/11.
 */
'use strict';
// 前面加上分号，避免因为JS合并带来的不必要的报错
// 启用函数自执行是保持模块的独立
window.onload= function () {

    //固定导航
    ;(function () {
        //  需求 ： 动态改变topbar的透明度
        //  思路：
        //  （1）需要绑定scroll事件 所有的逻辑应该在scroll事件完成
        //  （2）得到比例关系：不断在改变的scrollTop值/自己设定的最大的临界值 = 不断在改变的透明度/1

        var topbar=document.querySelector('.jd-header');
        //    获取滑动被页面卷曲的部分
        var maxScrollTop=300;
        window.addEventListener('scroll', function () {
            var scrollTop=document.body.scrollTop;
            if(scrollTop>maxScrollTop){
                topbar.style.backgroundColor='rgba(201, 21, 35, 1)';
            }else{
                topbar.style.backgroundColor='rgba(201, 21, 35, '+scrollTop/maxScrollTop+')';
            }
        })

        // 动态获取UL的宽度
        var scrollWarp=document.querySelector('.scroll-warp');
        var scrollLis=scrollWarp.querySelectorAll('li');
        //将li的宽度赋给ul
        scrollWarp.style.width=scrollLis[0].offsetWidth*scrollLis.length+'px';

    })()

    //京东快报
    ;(function () {
        // 需求： 实现无缝轮播的效果
        // 核心点：当看到临时工的时候，立马跳到第一个li上面去
        // 思路：
        // （1）复制一个临时工，并追加到ul的最后面
        // （2）设置定时器，设置一个信号量，每一次定时器执行的时候让信号量自增一 ul就移动至信号量*li的高度的位置上、
        // （3）在过渡结束的时候，去判断信号量是否到达临时工上面了，一旦到达，立马瞬移回第一个li的位置
        var newScroll=document.querySelector('.new-scroll');
        var newScrollLis=newScroll.querySelectorAll('li');
        //信号量
        var index=0;
        // （1）复制一个临时工，并追加到ul的最后面
        newScroll.appendChild(newScrollLis[0].cloneNode(true));
        var lisHight=newScrollLis[0].offsetHeight;
        var timer=null;
        timer=setInterval(function () {
            index++;
            newScroll.style.transition='transform,.5s';
            newScroll.style.transform='translateY('+(-index*lisHight)+'px)';
        },1500);
        // 监听过渡结束事件
        newScroll.addEventListener('transitionend', function () {
            //每一次过度完的时候，如果索引值为li标签的最大长度，那么就结束过渡，最后一个li 立马跳回到第一个li
            if(index>=newScrollLis.length){
                index=0;
                newScroll.style.transition='none';
                newScroll.style.transform='translateY(0px)';
            }
        });
    })()

    //倒计时
    ;(function () {
        //当前时间
        var newDate=new Date();
        //未来时间
        var furDate=new Date('May 11 2017 22:00:00');
        //相差的秒数
        var dTime=parseInt((furDate-newDate)/1000);//毫秒变成秒
        var spans=document.querySelectorAll('.jd-ms-time>span');
        var timer=null;
        timer=setInterval(function () {
            dTime--;
            if(dTime<=0){
                clearInterval(timer);
                return false;//程序不用再执行
            }
            //将毫秒数转换为小时分钟和秒
            var h=parseInt(dTime/3600);
            var m=Math.floor(dTime%3600/60);
            var s=Math.floor(dTime%60);
            var str=Timer(h)+':'+Timer(m)+':'+Timer(s);
            function Timer(n){
                return n>9? n:'0'+n;
            }
            //动态添加到spans中
            for(var i=0;i<spans.length;i++){
                spans[i].innerHTML=str[i];
            }



        },1000);
    })()



    //京东轮播图样式
    // 轮播图
    //　准备工作：
    // （1）让所有的ｌｉ都进行了定位，并且将ｌｉ的高度赋值给了ｕｌ（因为ｌｉ脱标了，所有ＵＬ获取不到ＬＩ的高度）
    // （2）动态循环创建了小圆点，因为图片的张数可能不固定，所以通过JS动态循环出来
    // （3）让所有的图片都移出屏幕的外面，至于后期的逻辑全部通过JS去控制想要看到的图片
    // 让轮播图跑起来的逻辑
    // （1）设置三个位置变量，将初始的下标放到变量内部，并且让对应的LI归位
    // （2）封装一个函数（控制看到下一张）轮转下标 极值判断 添加过渡（替补的图片干掉过渡） 继续归位
    // （3）设置当前的小圆点 直接控制center对应的那个小圆点就完事 （排他 控制center）
    ;(function () {
        var jdCarousel=document.querySelector('.jd-carousel');
        var jdCarouselUl=document.querySelector('ul');
        var jdCarouselLis=jdCarouselUl.querySelectorAll('li');
        var points=jdCarousel.querySelector('ol');
        //获取屏幕的宽度
        var screenWidth=document.documentElement.offsetWidth;
        var timer=null;
        //li定位后脱标了，所以要把li的高度赋给ul
        jdCarouselUl.style.height=jdCarouselLis[0].offsetHeight + 'px';
        //    动态循环创建小圆点
        for(var i=0;i<jdCarouselLis.length;i++){
            var newLi=document.createElement('li');
            if(i==0){
                newLi.classList.add('active');
            }
            points.appendChild(newLi);
        }
        //    分三个 left center right
        var left=jdCarouselLis.length-1;
        var center=0;
        var right=1;
        setTransform();
        timer=setInterval(showNext,1000);
        //设置小圆点
        //千万别在前面获取ol里的li,因为那个时候还没有生成这个li
        var pointsLis=points.querySelectorAll('li');
    //    记录手指开始的落点
        var startX=0;
        var startTime=null;
        jdCarouselUl.addEventListener('touchstart',touchStartHandler);
        jdCarouselUl.addEventListener('touchmove',touchMoveHandler);
        jdCarouselUl.addEventListener('touchend', touchEndHandler);


        function touchStartHandler(e) {
            //    获取手指移动的距离
            startX= e.changedTouches[0].clientX;
            startTime=Date.now();
            clearInterval(timer);
        }
        function touchMoveHandler(e) {
            var dx=e.changedTouches[0].clientX-startX;
            // 添加过渡
            setTransition(false,false,false);
            setTransform(dx);
        }
        function touchEndHandler(e) {
            var dx=e.changedTouches[0].clientX-startX;//记录最终的距离
            var dTime=Date.now()-startTime;
            //判断是否滑动成功
            //依据是dx是否大于屏幕的1/3,dx需要取得绝对值，因为我们只需要距离
            //滑动的时间 < 300 并且 滑动的距离大于30
            if(Math.abs(dx)>screenWidth/3 || (dTime<300&&Math.abs(dx)>30)){
                if(dx>0){
                    showPre();
                }else{
                    showNext();
                }
            }else{
                // 添加过渡
                setTransition(true,true,true);
                //    归位
                setTransform();
                clearInterval(timer);
                timer=setInterval(showNext,1000);

            }
        }
        function showPre(){
            right = center;
            center = left;
            left--;
            if(left < 0){
                left = jdCarouselLis.length-1;
            }
        //    过渡
            setTransition(false,true,true);
         // 归位
            setTransform();
            setPoints();
        }
        function showNext(){
            left=center;
            center=right;
            right++;
            if(right>jdCarouselLis.length-1){
                right=0;
            }
            //加过渡
           //过渡时间永远不要超过定时器加载的时间
           // right不要加过渡，因为当图片加载完时，
            // 右边没有图片，会从左边拿，然后就会看到最后一张图片从左边滑过来，这样轮播图就穿帮了
            setTransition(true,true,false);
            //    归位
            setTransform();
            setPoints();
        }
        function setPoints(){
            for(var i=0;i<pointsLis.length;i++){
                pointsLis[i].classList.remove('active');
            }
            pointsLis[center].classList.add('active');
        }
        //归位
        function setTransform(dx){
            //    归位函数
            dx = dx || 0;
            jdCarouselLis[left].style.transform='translateX('+ (-screenWidth +dx) + 'px)';
            jdCarouselLis[center].style.transform='translateX('+dx+'px)';
            jdCarouselLis[right].style.transform='translateX('+ (screenWidth + dx )+ 'px)';//括号问题
        }
        function setTransition(a,b,c){
            if(a){
                jdCarouselLis[left].style.transition = 'transform .5s';
            }else{
                jdCarouselLis[left].style.transition = 'none';
            }
            if(b){
                jdCarouselLis[center].style.transition = 'transform .5s';
            }else{
                jdCarouselLis[center].style.transition = 'none';
            }
            if(c){
                // 右边永远是替补的图片，不能添加过渡，如果一旦添加了过渡，会出现穿帮
                jdCarouselLis[right].style.transition = 'transform .5s';
            }else{
                jdCarouselLis[right].style.transition = 'none';
            }
        }
    })()

}






