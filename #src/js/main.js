$('.header__top-btn-menu').click(function(){
    $('.aside').addClass('aside--close')
})
$('.aside__top-btn-close').click(function(){
    $('.aside').removeClass('aside--close')
})

$(document).ready(function(){
    $('.slick').slick({
      mobileFirst: true,
      variableWidth: true,
      arrows: false,
     responsive: [{
         breakpoint: 768,
         settings:{
             slidesToShow: 2,
             slidesToScroll: 3
         }
        },
        {
            breakpoint: 920,
            settings:{
                slidesToShow: 3,
                slidesToScroll: 3,
                
            }
           },
           {
            breakpoint: 1200,
            settings:{
                
                arrows: true,
            }
           },
     ]
  })
});

// search
searchBtn = $('.header__top-search');
search = $('.search');
tel = $('.header__top-tel')
header = $('.header__body')
content = $('.header__content')
$('active')

searchBtn.click(function(){
    search.addClass('active')
    searchBtn.css({'display':'none'})
    tel.css({'display':'none'})
})
header.click(function(){
    search.removeClass('active')
    setTimeout(function(){
        searchBtn.css({'display':'block'})
    }, 500)
})
content.click(function(){
    search.removeClass('active')
    setTimeout(function(){
        searchBtn.css({'display':'block'})
        tel.css({'display':'block'})
    }, 500)
})

// tabs

$('.tags__inner-title').click(function(e){
    e.preventDefault();
    $('.tabs').hide('tabs')
    // $('tabs--active').hide()
    $($(this).attr('href')).show('tabs')
})