$(function(){
  // intro
  $('#wrap').hide();
  setTimeout(function(){
    $('#intro').addClass('remove');
    $('#wrap').show();
  }, 3000)
  setTimeout(function(){
      $('#intro').addClass('hidden');
      $('header').removeClass('blend-mode-screen');
  }, 3100)

  // Mobile Menus
  const mobileBtn = $('.mobile-btn');
  const navMobile = $('.nav-mobile');
  // const layerMask = $('.layer-mask');

  mobileBtn.click(function(e) {
    e.preventDefault();
    const temp = $(this).hasClass('active');
    if(temp) {
      $(this).removeClass('active');
      navMobile.removeClass('active');
      navMobile.find('li').removeClass('active');
      $('body').removeClass('modal-active');

      // layerMask.removeClass('active');
      // $('header').removeClass('blend-mode-screen');
    }else{
      $(this).addClass('active');
      navMobile.addClass('active');
      $('body').addClass('modal-active');
      // $('header').removeClass('blend-mode-screen');
      // layerMask.addClass('active');
    }
  });

  // 주메뉴 클릭 시 스크롤
  const $menu = $('header ul li'), $contents = $('section');
  $menu.click(function(e) {
    e.preventDefault();
    $('.wrap').addClass('active');
    $menu.find('a').removeClass('active');
    $(this).find('a').addClass('active');
    // 메뉴의 해당 li의 인덱스 번호 구하기
    let idx = $(this).index();
    let $section = $contents.eq(idx);
    // 현재 선택된 section의 위치 정보(top)
    let sectionDistance = $section.offset().top;
    $('html, body').stop().animate({
      scrollTop:sectionDistance
    }, 500)
    if(idx >= 2) {
      setTimeout(function(){
        $('header').addClass('blend-mode-screen');
      }, 400);
    }else{
      setTimeout(function(){
        $('header').removeClass('blend-mode-screen');
      }, 400)
    }
  });

  // 스크롤 버튼 클릭 시 프로젝트 섹션으로 이동
  $('.scroll_icon a').click(function(e){
    e.preventDefault();
    let targetDistance = $('#projects').offset().top;
    $('.wrap').addClass('active');
    $('html, body').stop().animate({
      scrollTop:targetDistance
    }, 500)
  });

  // 모바일 메뉴 클릭 시 스크롤
  const $menuEl = $('.menu-mobile li');
  $menuEl.click(function(e){
    e.preventDefault();
    navMobile.removeClass('active');
    mobileBtn.removeClass('active');
    $('body').removeClass('modal-active');

    $menuEl.find('a').removeClass('active');
    $(this).find('a').addClass('active');
    // 메뉴의 해당 li의 인덱스 번호 구하기
    let idx = $(this).index();
    let $section = $contents.eq(idx);
    // 현재 선택된 section의 위치 정보(top)
    let sectionDistance = $section.offset().top;
    $('html, body').animate({
      scrollTop:sectionDistance
    }, 500)
    if(idx >= 2) {
      setTimeout(function(){
        $('header').addClass('blend-mode-screen');
      }, 400);
    }else{
      setTimeout(function(){
        $('header').removeClass('blend-mode-screen');
      }, 400)
    }
  });

  // 위로 이동 버튼 클릭 시 스크롤
  const goTop = $("#goTop");
  goTop.click(() => {
    $menu.find('a').removeClass('active');
    $('html, body').animate({
      scrollTop: 0
    }, 500)
  });

  // 스크롤 이동 감지
  // firefox 브라우저인지 체크
  const mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
  // 브라우저 체크 후 이벤트 적용
  $('body').on(mousewheelevt, function (e) {
    const wheel = e.originalEvent.wheelDelta;

    if (wheel > 0) {
      //스크롤 올릴때
      // console.log(`올리는 중 ${wheel}`);
    }else{
      //스크롤 내릴때
      // console.log(`내리는 중 ${wheel}`);
      $('.wrap').addClass('active');
    }
  });

  // 윈도우 스크롤 시
  $(window).scroll(function(){
    // 비주얼 영역일 때 스크롤 숨김
    const visual = $('#visual');
    // console.log(visual.offset().top, $(window).scrollTop());
    if($(window).scrollTop() == 0) {
      $('.wrap').removeClass('active');
    }
    if($('header').hasClass('blend-mode-screen')) {
      $('.mobile-btn').addClass('blend-mode-screen');
    }else{
      $('.mobile-btn').removeClass('blend-mode-screen');
    }

    // 스크롤 시 해당 영역 활성화
    $contents.each(function(){
      // console.log($(this).offset().top, $(window).scrollTop() + 100);
      if($(this).offset().top <= $(window).scrollTop() + 100) {
        let idx = $(this).index();
        $menu.find('a').removeClass('active');
        $('.menu-mobile li').removeClass('active');
        $menu.eq(idx).find('a').addClass('active');
        $('.menu-mobile li').eq(idx).addClass('active');
        if(idx >= 2) {
          $('header').addClass('blend-mode-screen');
        }else{
          $('header').removeClass('blend-mode-screen');
        }
      }
    });
  });

  // layerMask 클릭 시 모바일 메뉴 닫힘
  // layerMask.click(function() {
  //   mobileBtn.removeClass('active');
  //   navMobile.removeClass('active');
  //   $(this).removeClass('active');
  // });


  //화면사이즈체크
  $(window).resize(function(){
    const screenWidth = $(window).width();
    if(screenWidth > 1024) {
      mobileBtn.removeClass('active');
      navMobile.removeClass('active');
      // 모달창이 열려 있지 않으면 modal-active 제거
      if($('#modal').hasClass('active') != true) {
        $('body').removeClass('modal-active');
      }
    }
  });

  // projects
  // tabMenu
  const tabMenu = $('.tabMenu li'), 
  tabSlider = $('.swiper-outer > div');
  tabMenu.click(function(e){
    e.preventDefault();  
    if($(this).index() == 4) {
      // 비디오 카테고리 포트폴리오 준비 중
      alert('준비 중입니다.')
    }else{
      // 나머지 카테고리
      tabMenu.removeClass('active');
      $(this).addClass('active');
      tabSlider.hide();
      const tabTarget = $(this).find('a').attr('href');
      $(tabTarget).show();
    }
  });
  tabMenu.eq(0).trigger('click');

  // swiper
  const swiper = new Swiper('.projects-list', {
    // loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    slideToClickedSlide: true,
    // allowTouchMove: false,
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
      768: {
        slidesPerView: 2,
        spaceBetween: 28,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 28,
      },
      1560: {
        slidesPerView: 3,
        spaceBetween: 28,
      }
    }
  });

  //modal
  const projectEl = $('.projects-list li a');
  //modal > open
  $(projectEl).click(function(e){
    e.preventDefault();
    $('body').addClass('modal-active');
    $('#modal').addClass('active');

    // 영상 프로젝트 여부 확인
    const hasVideo = $(this).is('[data-video]');
    // 프로젝트 타이틀 가져오기
    const projectTit = $(this).find('.desc').html().replace('<br>', ' - ');

    // 프로젝트 설명 가져오기
    const projectDesc = $(this).find('.desc').data('desc');
    // 툴 정보 가져오기
    const tools = $(this).find('.desc').data('tools');

    if(hasVideo) {
      $('#modal').removeClass('light');
      $('#modal').addClass('dark');

      $('#modal .modal-cont').prepend(`
        <div class="video-area">
          <div class="video">
            <iframe src="https://www.youtube.com/embed/${$(this).data('video')}?rel=0&playsinline=1&autoplay=1" frameborder="0" name="" allowfullscreen></iframe>
          </div>
        </div>
        <div class="info-area">
          <h2>${projectTit}</h2>
          <div class="tools">
            <img src="img/tool/ico_${tools}.png" alt="${tools}" title="${tools}">
          </div>
          <div class="desc">${projectDesc}</div>
        </div>
      `);
     }else{
      $('#modal').removeClass('dark');
      $('#modal').addClass('light');
      // alert('비디오 없음');
      // View 정보 가져오기
      const viewNum = $(this).find('.desc').data('view');
      // Category 정보 가져오기
      // const projectCategory = $(this).find('.tag span').text();
      // Client 정보 가져오기
      const projectClient = $(this).find('.desc').data('client');
      // Date 정보 가져오기
      const projectDate = $(this).find('.desc').data('date');
      // Work Role 정보 가져오기
      const projectRole = $(this).find('.desc').data('work');
      // Color 정보 가져오기
      let projectColors = $(this).find('.desc').data('color');
      let colorSplit = projectColors.split(',');

      $('#modal').prepend(`<h2><span>${projectTit}</span> <img src="img/tool/ico_${tools}.png" alt="${tools}" title="${tools}"></h2>`);
      $('.modal-cont').prepend(`
        <div class="info-area">
          <ul>
            <li>
              <dl>
                <dt>CLIENT</dt>
                <dd>${projectClient}</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>DATE</dt>
                <dd>${projectDate}</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>WORK</dt>
                <dd>${projectRole}</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>COLOR</dt>
                <dd>
                  <span style='background-color:${colorSplit[0]}'></span>
                  <span style='background-color:${colorSplit[1]}'></span>
                  <span style='background-color:${colorSplit[2]}'></span>
                </dd>
              </dl>
            </li>
          </ul>
          <div class="desc">${projectDesc}</div>
        </div>
        <div class="view-area">
          <img src="img/projects/view_${viewNum}.jpg">
          
        </div>
      `);
      // $('#modal').append(`
      //   <div class="modal-footer">
      //     <div class="btn-area">
      //       <button type="button" class="btn-prev">prev</button>
      //       <button type="button" class="btn-next">next</button>
      //     </div>
      //   </div> 
      // `);
    }
    // return true;
  });

  //modal > close
  $('#modal .btn-close').click(function(){
    $('#modal').removeClass('active');
    $('#modal').removeClass('dark');
    $('#modal').removeClass('light');
    $('body').removeClass('modal-active');
    $('.modal-cont > div').remove();
    $('#modal h2').remove();
    $('.modal-footer').remove();
  });
  

 
});

AOS.init({
  // easing: 'ease-out-cubic',
  // duration: 1500,
  once: true,
});