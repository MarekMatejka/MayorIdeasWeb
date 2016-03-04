$(document).ready(function() {

    //checkLoggedIn();

    $('#dataTable_wrapper').hide();

	//var id = sessionStorage.getItem("id");
    var id = 10;
    setupCarousel();

    $.get(url+"/image/get/idea/"+id, function(data) {
        var ideaImageIds = JSON.parse(data);
        console.log(ideaImageIds);
        for (var i = 0; i < ideaImageIds.length; i++) {
              $('.carousel').slick('slickAdd','<div><img data-lazy="'+(url+"/image/get/"+ideaImageIds[i])+'"/></div>');
        }
    }, "text");

    function setupCarousel() {
        $('.carousel').slick({
            dots: true,
            infinite: true,
            speed: 500,
            fade: true,
            cssEase: 'linear',
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            lazyLoad: 'ondemand',
            adaptiveHeight: true
        });


    }
});	