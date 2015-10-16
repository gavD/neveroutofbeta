$('body').removeClass('no-js').addClass('js');

$(document).ready(function() {
    $(".episodes").addClass("loading");

    // Controls what happens when you click on the mobile nav button e.g. the hamburger
    $('.mob-nav').on('tap', function(){
        $(this).toggleClass('active');
        $('.site-navigation').toggleClass('active');
        $('body').toggleClass('has-modal');
    });

    // Controls what happens when you click a link in the mobile navigation section
    $('.site-header a').on('click', function() {
        $('.site-navigation').removeClass('active');
        $('.mob-nav').removeClass('active');
        $('body').removeClass('has-modal');
    });

    // Adds a class letting us know the header is not at the top
    setInterval(checkHeaderScroll, 10);

    function checkHeaderScroll(){
        if ($(window).scrollTop() >= 10) {
            $('.headbar').addClass('not-top');
        } else {
            $('.headbar').removeClass('not-top');
        }
    }

    // Sets up the scrolling for the page and the current class on the relevent section
    $('.site-header').onePageNav({
        currentClass: 'current',
        changeHash: true,
        scrollSpeed: 250,
        scrollThreshold: 0.5,
        filter: ':not(.external)',
        easing: 'swing'
    });

    // NOTE: Basic URL replacement to make links in episodes clickable (based on this: http://stackoverflow.com/a/7123542), if this is not robust enough consider using a library
    if(!String.linkify) {
        String.prototype.linkify = function() {
            // http://, https://, ftp://
            var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

            // www. sans http:// or https://
            var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

            // NOTE: Made the targets blank to avoid closing the window playing the podcast
            return this
                .replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
                .replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>');
        };
    }

    // Load the JSON from the Soundcloud API and if successful add episodes to the page
    // NOTE: You may want to switch out the client id for a NOOB one
    // NOTE: This could be done during the build in a static site generator
    $.getJSON('http://api.soundcloud.com/users/98930059/tracks?client_id=8cdafce6763b1830e96adf4cf64b37b1')
    .done(function( data ) {
        addEpisodesToPage(data);
    })
    .fail(function() {
        $(".episodes").removeClass("loading").html("There was an error loading the episodes, please view them <a href='https://soundcloud.com/never-out-of-beta'>on Soundcloud</a>");
    });

    function addEpisodesToPage(data){
        var content = "";
        for(var i in data){
            var title = data[i].title;
            var description = data[i].description;

            var url = data[i].permalink_url;

            // NOTE: using moment.js to change the format of the date
            var date = moment(new Date(data[i].created_at).toISOString()).format('Do MMMM YYYY');

            content += "<div class=episode>";
            // NOTE: There may be a more efficient way to load this, see: https://developers.soundcloud.com/docs/api/html5-widget and http://owlgraphic.com/owlcarousel/demos/owlStatus.html May be created in SSG later so loading like this for now
            content += '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=' +url+ '&amp;color=0288d1&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"></iframe>';
            content += "<div class='episode__details'>";
            content += "<h4>" +title+ "</h4>";
            content += "<p class='episode__pubdate'>" +date+ "</p>";
            content += "<hr>";
            content += "<p class='episode__description'>" +description.linkify()+ "</p>";
            content += "</div>";
            content += "</div>";
        }

        $(".episodes").removeClass("loading").html(content);

        // If this needs a carousel, load it
        if ($(".episodes").hasClass("owl-carousel")) {
            loadCarousel();
        }

        // Add a fancy custom scrollbar
        $(".episode__details").mCustomScrollbar({
            theme:"noob",
            scrollInertia: 20,
            alwaysShowScrollbar: 1,
            mouseWheel:{ preventDefault: true }, // Stops the whole page from scrolling (there are some issues with this, see below)
            callbacks:{
                whileScrolling:function(){
                    // Remove the fade out if you are close to the bottom
                    if (this.mcs.topPct >= '99') {
                        $(this).addClass('bottom');
                    } else {
                        $(this).removeClass('bottom');
                    }
                },
                onOverflowYNone: function(){
                    $(this).addClass('bottom');
                },
                onTotalScroll: function(){
                    disablePageScroll(false);
                },
                onTotalScrollBack: function(){
                    disablePageScroll(false);
                },
                onScrollStart: function(){
                    disablePageScroll(true);
                }
            }
        });
    }

    function disablePageScroll(setting){
        // Preventing default makes it difficult to carry on reading the page but not setting it makes it difficult to read the content, this is an attempt at middle ground
        $(".episode__details").data("mCS").opt.mouseWheel.preventDefault=setting;
    }

    // Turns the list of episodes in to a carousel using Owl Carousel 
    function loadCarousel() {
        $("#podcast-carousel").owlCarousel({
            items : 2,
            itemsDesktop : [1000,2],
            itemsDesktopSmall : [900,1],
            itemsTablet: false,
            itemsMobile : false,
            navigation: true,
            scrollPerPage: true
        });
    }
});
