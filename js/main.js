$(function(){
  // 섬네일 호버용 gif 프리로드
  // 페이지 로드 시점이 아니라 #projects 영역에 도달했을 때 실행한다.
  // (초기 로딩 부담을 줄이기 위함 / 아래 IntersectionObserver에서 호출)
  let images = [];
  let preloaded = false;

  function preloadThumbGifs() {
    if (preloaded) return;
    preloaded = true;

    // DOM의 data-animated 값을 불러옴
    const urls = [];
    $('.projects-list a img').each(function () {
      const src = $(this).data('animated');
      if (src && urls.indexOf(src) === -1) {
        urls.push(src);
      }
    });

    urls.forEach(function (src) {
      const img = new Image();
      img.src = src;
      images.push(img);
    });
  }

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
  // const mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
  
  
  // 첫 화면(비주얼)에서 아래로 휠을 굴릴 때의 처리
  // .wrap 의 스크롤 잠금(height:100vh; overflow:hidden)을 풀어주는 역할만 한다.
  const wrapEl = document.querySelector('.wrap');

  function goToProjects() {
    // 이미 첫 화면을 벗어났으면 처리할 것이 없음
    if (window.scrollY > 10) return;

    if (wrapEl && !wrapEl.classList.contains('active')) {
      wrapEl.classList.add('active');
    }
  }

  // 3d/index.html(iframe)에서도 같은 동작을 호출할 수 있도록 노출
  window.goToProjects = goToProjects;

  // 휠 이벤트 (passive)
  // jQuery .on() 으로 붙이면 non-passive 리스너가 되어 브라우저가
  // 핸들러가 끝날 때까지 스크롤을 진행시키지 못하고 기다린다.
  // → 스크롤이 멈췄다가 한 번에 튀는 원인. preventDefault를 쓰지 않으므로 passive로 등록한다.
  window.addEventListener('wheel', function (e) {
    // 올릴 때는 처리할 것이 없음
    if (e.deltaY <= 0) return;

    if (window.scrollY <= 10) {
      // 첫 화면에서는 goToProjects 처리
      goToProjects();
    } else if (wrapEl && !wrapEl.classList.contains('active')) {
      // 이미 붙어 있으면 다시 쓰지 않는다
      wrapEl.classList.add('active');
    }
  }, { passive: true });

  // 윈도우 스크롤 시
  // requestAnimationFrame으로 묶어 프레임당 1회만 실행한다.
  // 또한 읽기(위치 계산)를 먼저 끝내고 쓰기(클래스 변경)를 뒤에 몰아서
  // 레이아웃을 반복 재계산하는 layout thrashing을 피한다.
  const headerEl = document.querySelector('header');
  const mobileBtnEl = document.querySelector('.mobile-btn');
  const $menuMobile = $('.menu-mobile li');
  let ticking = false;

  function onScrollFrame() {
    ticking = false;

    const y = window.scrollY;

    if (y <= 0 && wrapEl && wrapEl.classList.contains('active')) {
      wrapEl.classList.remove('active');
    }

    // --- 읽기 단계 ---
    // 뒤에서부터 훑어 조건에 맞는 첫 섹션을 찾으면 즉시 종료.
    // (원본은 break가 없어 위쪽 섹션 전부에 대해 클래스 조작이 중복 실행되었다)
    let idx = -1;
    for (let i = $contents.length - 1; i >= 0; i--) {
      const el = $contents[i];
      // getBoundingClientRect().top 은 이미 뷰포트 기준이므로 그대로 비교한다
      if (el.getBoundingClientRect().top <= 100) {
        idx = $(el).index();
        break;
      }
    }

    // --- 쓰기 단계 ---
    if (idx > -1) {
      // 이미 활성화된 항목이면 DOM을 건드리지 않는다
      if (!$menu.eq(idx).find('a').hasClass('active')) {
        $menu.find('a').removeClass('active');
        $menuMobile.removeClass('active');
        $menu.eq(idx).find('a').addClass('active');
        $menuMobile.eq(idx).addClass('active');
      }

      // mix-blend-mode는 합성 비용이 크므로 값이 바뀔 때만 토글
      if (headerEl) {
        const needBlend = idx >= 2;
        if (needBlend !== headerEl.classList.contains('blend-mode-screen')) {
          headerEl.classList.toggle('blend-mode-screen', needBlend);
        }
      }
    }

    // 모바일 버튼은 header 상태에 맞춰 동기화 (변경이 있을 때만)
    if (headerEl && mobileBtnEl) {
      const blended = headerEl.classList.contains('blend-mode-screen');
      if (blended !== mobileBtnEl.classList.contains('blend-mode-screen')) {
        mobileBtnEl.classList.toggle('blend-mode-screen', blended);
      }
    }
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScrollFrame);
  }, { passive: true });

  
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

  // #projects 영역이 화면에 들어왔는지 여부.
  // 페이지 접속 직후가 아니라 이 영역에 도달했을 때부터 autoplay를 시작한다.
  let projectsVisible = false;
  // 현재 보고 있는 탭의 id (IntersectionObserver에서 참조)
  let currentTabId = null;

  tabMenu.click(function(e){
    e.preventDefault();  
    {
      tabMenu.removeClass('active');
      $(this).addClass('active');

      const tabTarget = $(this).find('a').attr('href');
      const tabId = tabTarget.replace('#', '');
      const currentSwiper = swipers[tabId];
      currentTabId = tabId;

      // 화면에 보이지 않게 될 모든 swiper의 autoplay를 먼저 정지
      // (숨겨진 상태로 계속 돌면 폭 계산이 꼬여서 다음에 보일 때 재생이 안되거나 랜덤하게 깨짐)
      Object.keys(swipers).forEach(function(id) {
        const sw = swipers[id];
        if (id !== tabId && sw.autoplay && sw.autoplay.running) {
          sw.autoplay.stop();
        }
      });

      tabSlider.hide();
      $(tabTarget).show();

      // 컨테이너가 실제로 화면에 표시된 다음 프레임에서
      // 크기를 다시 계산하고 autoplay를 재시작 (한 번만 수행하여 레이스 컨디션 제거)
      requestAnimationFrame(() => {
        currentSwiper.update();
        currentSwiper.updateSlides();
        currentSwiper.updateSize();
        // #projects 영역에 도달한 뒤에만 재생한다
        if (projectsVisible) {
          currentSwiper.autoplay.start();
        } else {
          currentSwiper.autoplay.stop();
        }
      });
    }
  });

  // ALL 탭 슬라이드 자동 생성
  // WEB/APP, GRAPHIC, MOTION, VIDEO 탭에 있는 슬라이드를 그대로 복제해서
  // #tabs-1(ALL)에 채워 넣는다. 이렇게 하면 각 카테고리 리스트만 관리하면 되고,
  // ALL 탭 내용을 별도로 손으로 유지보수할 필요가 없다.
  const $allWrapper = $('#tabs-1 .swiper-wrapper');
  $allWrapper.empty();

  // 1) 4개 카테고리의 슬라이드를 하나의 배열로 모으기
  let allSlides = [];
  ['#tabs-2', '#tabs-3', '#tabs-4', '#tabs-5'].forEach(function (tabSelector) {
    $(tabSelector).find('.swiper-slide').each(function () {
      // true, true: 이벤트 핸들러와 data()까지 함께 복제
      allSlides.push($(this).clone(true, true));
    });
  });

  // 2) Fisher-Yates 셔플로 카테고리 순서가 아니라 무작위 순서로 섞기
  // for (let i = allSlides.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [allSlides[i], allSlides[j]] = [allSlides[j], allSlides[i]];
  // }

  // 3) 섞인 순서대로 wrapper에 추가
  allSlides.forEach(function ($slide) {
    $allWrapper.append($slide);
  });

  // swiper
  const swipers = {};

$('.projects-list').each(function () {

    const $wrap = $(this).closest('.swiper-outer > div');
    // 이 swiper가 속한 tab의 id (예: "tabs-2")
    const tabId = $wrap.attr('id');

    const swiper = new Swiper(this, {

        observer: true, // DOM 변경 감지 활성화
        observeParents: true, // 부모 요소의 변경 감지 활성화
        
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },

        slideToClickedSlide: true,

        navigation: {
            nextEl: $wrap.find('.btn-next')[0],
            prevEl: $wrap.find('.btn-prev')[0],
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

    swipers[tabId] = swiper;
});

  // 생성 직후에는 모든 autoplay를 멈춰둔다.
  // (Swiper는 autoplay 옵션이 있으면 생성과 동시에 자동 재생을 시작하므로,
  //  페이지 접속 시점이 아니라 #projects 영역에 도달했을 때부터 돌게 하려면 꺼야 한다)
  Object.keys(swipers).forEach(function (id) {
    swipers[id].autoplay.stop();
  });

  // 모든 swiper가 생성된 이후에 첫 번째 탭을 활성화해야
  // 탭 클릭 핸들러 안에서 swipers 객체를 안전하게 참조할 수 있음
  tabMenu.eq(0).trigger('click');

  // #projects 영역 진입 감지
  // 이 영역이 화면에 보이기 시작하면 현재 탭의 swiper를 재생하고,
  // 영역을 벗어나면 멈춘다. (보이지 않는 곳에서 헛도는 것 방지)
  const projectsSection = document.querySelector('#projects');

  if (projectsSection && 'IntersectionObserver' in window) {
    const projectsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        projectsVisible = entry.isIntersecting;

        const sw = swipers[currentTabId];
        if (!sw) return;

        if (entry.isIntersecting) {
          // 이 영역에 도달했을 때 호버용 gif를 미리 받아둔다 (최초 1회)
          preloadThumbGifs();

          sw.update();
          sw.autoplay.start();
        } else {
          sw.autoplay.stop();
        }
      });
    }, {
      // 영역이 20% 정도 보이면 시작
      threshold: 0.2
    });

    projectsObserver.observe(projectsSection);
  } else {
    // IntersectionObserver 미지원 브라우저는 기존처럼 바로 재생
    projectsVisible = true;
    preloadThumbGifs();
    if (swipers[currentTabId]) {
      swipers[currentTabId].autoplay.start();
    }
  }
  // 섬네일 gif 이미지 적용
  $('.projects-list a img').mouseover(function(){
    $(this).attr('src', $(this).data('animated'));
  });
  $('.projects-list a img').mouseout(function(){
    $(this).attr('src', $(this).data('static'));
  });

  //modal
  const projectEl = $('.projects-list li a');
  //modal > open
  $(projectEl).click(function(e){
    e.preventDefault();
    // 모달이 열려 있는 동안에는 슬라이드 자동재생을 멈춘다
    if (swipers[currentTabId]) {
      swipers[currentTabId].autoplay.stop();
    }

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

    if (hasVideo) {

      $('#modal').removeClass('light');
      $('#modal').addClass('dark');

      const video = $(this).data('video');
      let iframeSrc = '';

      // Google Drive인 경우
      if (typeof video === 'string' && video.includes('drive.google.com')) {

        const fileId = video.match(/\/d\/([^/]+)/)[1];
        iframeSrc = `https://drive.google.com/file/d/${fileId}/preview?autoplay=1`;

      } else {

        // 그 외에는 모두 YouTube ID로 간주
        iframeSrc = `https://www.youtube.com/embed/${video}?rel=0&playsinline=1&autoplay=1`;
      }

      $('#modal .modal-cont').prepend(`
        <div class="video-area">
          <div class="video">
            <iframe
              src="${iframeSrc}"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen>
            </iframe>
          </div>
        </div>

        <div class="info-area">
          <h2>${projectTit}</h2>

          <div class="tools">
            <img src="img/tool/ico_${tools}.png"
                alt="${tools}"
                title="${tools}">
          </div>

          <div class="desc">${projectDesc}</div>
        </div>
      `);

    } else {

      $('#modal').removeClass('dark');
      $('#modal').addClass('light');

    // if(hasVideo) {
    //   $('#modal').removeClass('light');
    //   $('#modal').addClass('dark');

    //   $('#modal .modal-cont').prepend(`
    //     <div class="video-area">
    //       <div class="video">
    //         <iframe src="https://www.youtube.com/embed/${$(this).data('video')}?rel=0&playsinline=1&autoplay=1" frameborder="0" name="" allowfullscreen></iframe>
    //       </div>
    //     </div>
    //     <div class="info-area">
    //       <h2>${projectTit}</h2>
    //       <div class="tools">
    //         <img src="img/tool/ico_${tools}.png" alt="${tools}" title="${tools}">
    //       </div>
    //       <div class="desc">${projectDesc}</div>
    //     </div>
    //   `);
    //  }else{
    //   $('#modal').removeClass('dark');
    //   $('#modal').addClass('light');

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

    // 모달을 닫으면 자동재생을 이어서 시작한다.
    // 단, #projects 영역이 화면에 보일 때만 (스크롤로 벗어난 상태면 그대로 정지 유지)
    if (projectsVisible && swipers[currentTabId]) {
      swipers[currentTabId].autoplay.start();
    }
  });

  // 이메일창
  const email = $('#email');
  $('#contact .btn-email').click(function(){
    email.addClass('active');
    $('body').addClass('modal-active');
    $('.layer-mask').addClass('active');
  });
  $('#email .btn-sendmail').click(function(){
    // email.removeClass('active');
    $('body').removeClass('modal-active');
    $('.layer-mask').removeClass('active');
  });
  $('#email .btn-close').click(function(){
    email.removeClass('active');
    $('body').removeClass('modal-active');
    $('.layer-mask').removeClass('active');
  });
});

AOS.init({
  // easing: 'ease-out-cubic',
  // duration: 1500,
  once: true,
});