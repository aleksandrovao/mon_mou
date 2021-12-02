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