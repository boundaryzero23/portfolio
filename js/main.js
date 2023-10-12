$(function(){
  // intro
  $('#wrap').hide();
  setTimeout(function(){
    $('#intro').addClass('remove');
    $('#wrap').show();
  }, 3000)
  setTimeout(function(){
      $('#intro').addClass('hidden');
      $('#visual h2').addClass('active');
  }, 3100)

//   setTimeout(function(){
//     $('#visual h2').addClass('active');
// }, 4500)

  // Mobile Menus
  let mobileBtn = $('.mobile-btn');
  let navMobile = $('.nav-mobile');
  let layerMask = $('.layer-mask');

  mobileBtn.click(function(e) {
    e.preventDefault();
    let temp = $(this).hasClass('active');
    if(temp) {
      $(this).removeClass('active');
      navMobile.removeClass('active');
      layerMask.removeClass('active');
    }else{
      $(this).addClass('active');
      navMobile.addClass('active');
      layerMask.addClass('active');
    }
  });

  // layerMask 클릭 시 모바일 메뉴 닫힘
  layerMask.click(function() {
    mobileBtn.removeClass('active');
    navMobile.removeClass('active');
    $(this).removeClass('active');
  });

  // 화면사이즈체크
  $(window).resize(function(){
    let tmp = $(window).width();
    if(tmp > 960) {
      mobileBtn.removeClass('mobile-btn-active');
      navMobile.removeClass('active');
      layerMask.removeClass('active');
    }
  });

  // 비주얼영상
  // const numberOfVisual=3; 
  // const visualNum = Math.round(Math.random()*(numberOfVisual-1))+1;
  // const visualPath = (`video/bg_${visualNum}.mp4`);
  // $('#visual .mp4').attr('src', visualPath);
  // console.log(visualPath)
  
  // visual 화면이 보일 경우 scroll 숨겼다가, 벗어날 경우 scroll 보임
  $(window).scroll(function(){
    const visual = $('#visual');
    console.log(visual.offset().top, $(window).scrollTop());
    if($(window).scrollTop() == 0) {
      $('.wrap').removeClass('active');
    }
    else if($(window).scrollTop() > 1760) {
      $('header').css('mix-blend-mode', 'screen');
    }else{
      $('header').css('mix-blend-mode', 'difference');
    }
  });

  // 스크롤 이동 감지
  // firefox 브라우저인지 체크
  var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
  // 브라우저 체크 후 이벤트 적용
  $('body').on(mousewheelevt, function (e) {
    const wheel = e.originalEvent.wheelDelta;

    if (wheel > 0) {
      //스크롤 올릴때
      console.log(`올리는 중 ${wheel}`);
    }else{
      //스크롤 내릴때
      console.log(`내리는 중 ${wheel}`);
      $('.wrap').addClass('active');
    }
  });

  // swiper
  const swiper = new Swiper('.projects-list', {
    loop: true,
    // autoplay: {
    //   delay: 2000,
    //   disableOnInteraction: false,
    // },
    // slidesPerView: 4,
    // spaceBetween: 30,
    navigation: {
      nextEl: ".btn-next",
      prevEl: ".btn-prev",
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 28,
      },
      480: {
        slidesPerView: 1,
        spaceBetween: 28,
      },
      560: {
        slidesPerView: 1,
        spaceBetween: 28,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 28,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 28,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 28,
      },
      1700: {
        slidesPerView: 4,
        spaceBetween: 28,
      }
    },
  });
});