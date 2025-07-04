!function ($) {
    'use strict';

    $(function () {

        function hackDOM(path) {
            $('.sidebar').remove();
            $('.content .wrap').attr('class','');
            $('.content').css('padding','0');
            setTimeout(function(){
                $('#loading').fadeOut();
            },500)
        }

        var path = document.location.pathname;
        if(path === '/' || path === '/index.html' || path.indexOf('download') >= 0) {
            hackDOM(path);
        }else {
            window.addEventListener('scroll', function(){
                if(window.pageYOffset >= 30 ){
                    $('.navbar.navbar-fixed-top').addClass('show');
                    $('.bs-sidebar.hidden-print.affix.well').addClass('show');
                }else{
                    $('.navbar.navbar-fixed-top').removeClass('show');
                    $('.bs-sidebar.hidden-print.affix.well').removeClass('show');
                }
            });
        }
    });


    // go-top
    function goTop() {
        $(window).scroll(function(e) {
            if ($(window).scrollTop() > 200) {
                $("#go-top").fadeIn(1000);
            } else {
                $("#go-top").fadeOut(1000);
            }
        });
    }

    $(function(){
        $("#go-top").click(function(e) {
            $('body, html').animate({
                scrollTop: 0
            }, 1000);
        });
        goTop();
    });

}(jQuery);
