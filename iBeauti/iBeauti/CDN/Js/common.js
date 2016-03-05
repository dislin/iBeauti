$(function () {

    $("#coin-slider").coinslider({
        width: 960, // width of slider panel
        height: 440, // height of slider panel
        spw: 1, // squares per width
        sph: 1, // squares per height
        delay: 5000, // delay between images in ms
        sDelay: 500, // delay beetwen squares in ms
        opacity: 0, // opacity of title and navigation
        titleSpeed: 500, // speed of title appereance in ms
        effect: 'random', // random, swirl, rain, straight
        navigation: true, // prev next and buttons
        links: false, // show images as links 
        hoverPause: false // pause on hover
    });
   

    

});