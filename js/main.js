(function() {
    var winH = 0; // 창높이
    var sc = 0; // scrollTop

    // swiper객체에 height()메서드 사용불가하므로 래퍼에서 높이 가변처리
    var mainSliderWrap = $('.main_slider_wrap');

     // 메인슬라이더 높이 조절
     $(window).resize(function() {
        winH = $(this).height();
        mainSliderWrap.height(winH - 55);
    }).trigger('resize');

    // 클릭시만 선택이되므로 변수에 담을필요없음
    // gnb 열기
    $('#header .btn_open').on('click', function(e) {
        e.preventDefault();

        $('#header .dimm').show();
        $('#header .gnb_box').addClass('open');
        $('#header .btn_close').fadeIn();
        $('body').addClass('hidden');

        // 통합검색이 열려있으면 닫기
        if($('#header .search_box').hasClass('open')) {
            $('#header .btn_search_toggle').removeClass('on');
            $('#header .search_box').removeClass('open');
            header.removeClass('scroll');
        };
        
    });

    // gnb 닫기
    $('#header .btn_close, #header .dimm').on('click', function() {
        $('#header .dimm').fadeOut();
        $('#header .gnb_box').removeClass('open');
        $('#header .btn_close').fadeOut();
        $('body').removeClass('hidden');
    });

    // gnb 아코디언
    $('.gnb .depth1>li>a').on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('active').parent().siblings().find('>a').removeClass('active');

        $(this).next().stop().slideToggle().parent().siblings().find('.depth2').hide();
    });

    var header = $('#header');
    var bgFix = $('.bg_fix');
    var btnTop = $('#footer .btn_top');
    var subFix = $('.sub_fix');
    var docH = 0; // 문서높이
    
    $(window).scroll(function() {
        // 가변높이이므로 스크롤시마다 높이갱신
        docH = $(document).height();
        sc = $(this).scrollTop();

        // 메인페이지에서만 실행
        if(!header.hasClass('sub_header')) {
            if(sc > 0) {
                header.addClass('scroll');
            } else {
                header.removeClass('scroll');
            }
    
            // iOS에서 상단 바운스스크롤시 fixed 배경이 보이므로 scrollTop판단하여 대응
            // iOS에서 문서 상단에서 sc가 300미만일 경우 bgFix 감추기
            // 바운스크롤을 빠르게 할경우가 있으므로 좀더 미리 감춰줌
            // 문서아래까지 스크롤 판단(sc + 창높이(스크롤바높이) == 문서높이)하여 좀더 미리 감춰줌
            if(sc < 300 || sc + $(window).height() > (docH - 150)) {
                bgFix.hide();
            } else {
                bgFix.show();
            }
        }

        // top버튼, 서브 상단 fixed
        if(sc >= 50) {
            btnTop.fadeIn(300);
            subFix.addClass('fixed');
        } else {
            btnTop.fadeOut(300);
            subFix.removeClass('fixed');
        }

    }).trigger('scroll');

    btnTop.on('click', function(e) {
        e.preventDefault();

        $('html, body').animate({scrollTop:0}, 1000);
    });
    
    // 통합검색 토글
    $('#header .btn_search_toggle').on('click', function() {
        $(this).toggleClass('on');
        $('#header .search_box').toggleClass('open');
        $('body').toggleClass('hidden');

        // scroll이벤트가 걸리면서 removeClass가 걸리므로
        // 지연시간을 주어 addClass해줌
        setTimeout(function() {
            header.toggleClass('scroll');
        },0);
    });

    // 메인 배너 슬라이더
    var mainSlider = new Swiper('.main_slider', {
        loop: true,
        autoplay: {
            delay: 5000,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
    
    // 제이쿼리객체 각각에 안쪽내용을 반복실행해줌
    // i는 인덱스, v는 제이쿼리객체
    init();

    function init() {
        lifeSliderInit();
        searchTotal();
    }

    function lifeSliderInit() {
        // 두번째 lifeSlider에 이미지주소를 배열로 생성하여 동적으로 페이지네이션 추가
        var imgUrl = [];
        imgUrl.push('images/thumb01.jpg');
        imgUrl.push('images/thumb02.jpg');
        imgUrl.push('images/thumb03.jpg');
        imgUrl.push('images/thumb03.jpg');
        imgUrl.push('images/thumb03.jpg');
        imgUrl.push('images/thumb03.jpg');

        // 첫번째 lifeSlider에 슬라이드의 갯수에서 원본배열갯수를 뺀만큼
        // src값을 만들어 배열에 채워서 오류방지
        var result = $('.life_slider1 .swiper-slide').length - imgUrl.length;
    
        for(var i=0; i<result; i++) {
            imgUrl.push(imgUrl[0]);
        }
    
        $('.main_life').each(function(i) {
            // $(this)로 각 main_life를 따로 선택하여 텍스트 숨김
            $(this).find('.life_txt:gt(0)').hide();
            // swiper 메서드 내부에서 각 main_life를 가르키기 위한 변수
            var _this = $(this);
            // main_life안쪽 슬라이더를 각각 변수로 선언하여 swiper객체 두개 생성
            var sliderEl = $(this).find('.life_slider');
    
            // 메인 life 슬라이더
            var lifeSlider = new Swiper(sliderEl, {
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.main_life .swiper-pagination',
                    type: 'bullets',
                    clickable: true,
                    renderBullet: function (index, className) {
                        return '<span class="' + className + '"><img src="' + imgUrl[index] + '" alt=""></span>';
                    }
                },
                on: {
                    slideChange: function() {
                        // loop 아닐경우 activeIndex, loop일 경우 realIndex
                        // swiper객체 안쪽 메서드에서 this, $(this)는 swiper객체를 가르킴
                        _this.find('.life_txt').eq(this.activeIndex).show().siblings().hide();
                    },
                }
            });
        });
    }

    var storySlider = new Swiper('.story_slider', {
        centeredSlides: true,
        loop: true,
        // 간격
        spaceBetween: 15,
        // css로 크기지정할경우
        slidesPerView:'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
        },
    });

    // footer 패밀리사이트 링크
    // 모바일에서 새창띄울경우 팝업설정에 의해 안열릴수 있으므로 주소만 이동
    // select option이 변경될때 발생
    $('#footer select').on('change', function() {
        // 되돌아와서 value값이 빈값인 경우 새로고침됨
        if($(this).val()) {
            location.href = $(this).val();
        }
    });

    function searchTotal() {
        // 통합검색
        var incSchKey = $('#inc_schKey');
        incSchKey.val('마늘');

        $('.search_box .btn_remove').on('click', function() {
            // input value값 없애고 포커스이동
            incSchKey.val('').focus();
        });

        // select의 option변경시 발생
        $('#inc_brdCd').on('change', function() {

            switch($(this).val()) {
                case '':
                    incSchKey.val('마늘');
                    break;
                
                case 'BF101':
                    incSchKey.val('6쪽마늘닭죽');
                    break;

                case 'BF102':
                    incSchKey.val('매콤불차돌비빔밥');
                    break;

                case 'BF104':
                    incSchKey.val('광양식바싹불고기 반상');
                    break;

                case 'BF105':
                    incSchKey.val('양지시래기해장설렁탕');
                    break;

                default:
                    incSchKey.val('마늘');
                    break;
            }
        });
    }

    // 서브 lnb
    $('.lnb .btn_lnb').on('click', function() {
        $(this).toggleClass('on');
        $('.lnb .list_lnb').stop().slideToggle();
    });

    // sub_tab 스크롤, sub_tab이 있을때만 실행
    var subTab = $('.sub_tab');

    if(subTab.length) {
        // 좌측 padding값 만큼 덜이동
        var posX = subTab.find('.active').offset().left - 15;
    
        subTab.animate({scrollLeft:posX}, 0);
    }

    // 회사소개 스크롤 애니메이션
    scrollAni();

    function scrollAni() {
        var posArr = []; // 리스트 위치
        // 회사소개 컨텐츠 리스트
        var introduceList = $('.introduce_container .introduce li');
    
        $(window).resize(function() {
            // 창크기에 따라 요소 높이가 변하므로 리사이즈마다 위치값 갱신, push메서드 사용불가
            introduceList.each(function(i) {
                // 290을 빼서 좀더 addClass를 빨리 걸어줌
                posArr[i] = $(this).offset().top - 290;
            });
        }).trigger('resize');
    
        $(window).scroll(function() {
            // sc가 각 요소위치 사이에 갔을때 addClass
            if(sc >= 100 && sc < posArr[1]) {
                introduceList.eq(0).addClass('on');
            } else if(sc >= posArr[1] && sc < posArr[2]) {
                introduceList.eq(1).addClass('on');
            } else if(sc >= posArr[2]) {
                introduceList.eq(2).addClass('on');
            }
            // console.log(sc,'==> 스크롤탑');
            // console.log(posArr,'==> 요소위치');
        }).trigger('scroll');
    }
})();