/*
Joose Carousel Component
@author Phil Gibbins

Depends on Joose.utils
*/

;var joose = window.joose || {};
joose.classes = joose.classes || {};
joose.carousel = (function(js) {
    
    "use strict";

    // set config for carousels
    var config = {
        expandedClassForTrigger: 'current',
        expandedClassForContent: 'shown'
    };

    // carousel constructor
    var Carousel = function(carouselId, defaultPage) {

        // set the container element
        this.carouselId = carouselId;
        this.container = document.getElementById(carouselId);

        // cancel if no container found
        if (!this.container) return false;

        // store the default page, set to first as default if not supplied (0-indexed)
        this.defaultPage = (typeof defaultPage !== 'undefined') ? defaultPage : 0;

        // store the pagination links
        this.paginationLinks = document.querySelectorAll('#' + this.carouselId + ' > ul a');
        this.noOfPaginationLinks = this.paginationLinks.length;
        this.noOfPages = this.noOfPaginationLinks - 2; // don't count previous and next page links

        // store other details
        this.pagesContainer = this.container.querySelector('#' + this.carouselId + ' > div');
        this.noOfPagesShown = this.container.getAttribute('data-pages-shown') || 1;

        // perform initial setup of the carousel
        this.init();

    };

    // set common properties for carousel
    Carousel.prototype = {

        // open the relevant page
        showPage: function(pageId) {
            
            // get the page to open and it's trigger and page number
            var pageTrigger = this.container.querySelector('[href="#' + pageId + '"]');
            var pageToShow = this.container.querySelector('#' + pageId);
            var pageNumber = pageToShow.getAttribute('data-page-number');

            // if the page exists
            if (pageToShow) {

                // 'scroll' to the selected page; add class to trigger's parent for styling flexibility
                joose.utils.addClass(pageTrigger.parentNode, config.expandedClassForTrigger);
                joose.utils.addClass(pageToShow, config.expandedClassForContent);
                this.pagesContainer.style.marginLeft = '-' + ((pageNumber - 1) * this.pageWidth) + 'px';

            }
        },

        // bind click event to triggers to open relevant page
        bindEvents: function() {
            var carousel = this;
            
            // skip the prev / next links
            for (var i=2; i<this.noOfPaginationLinks; i++) {
                this.paginationLinks[i].setAttribute('data-page-number', i+1);
                this.paginationLinks[i].addEventListener('click', function(e) {
                    e.preventDefault();
                    carousel.showPage(this.getAttribute('aria-controls'));
                });
            }
        },

        // initialise the carousel
        init: function() {

            // apply data attribute for styling if not already present
            if (!this.container.hasAttribute('data-component')) {
                this.container.setAttribute('data-component', 'carousel');
            };

            // style the carousel (needs to be calculated dynamically)
            this.pageWidth = (this.pagesContainer.clientWidth / this.noOfPagesShown);
            this.pagesContainer.style.width = (this.pageWidth * this.noOfPages) + 'px';
            var pages = this.pagesContainer.querySelectorAll('[aria-labelledby]');

            for (var i=0; i<this.noOfPages; i++) {
                pages[i].style.width = (this.pageWidth / this.noOfPagesShown) + 'px';
                pages[i].setAttribute('data-page-number', i+1);
            }

            // bind events to this instance of a carousel
            this.bindEvents();

            // get the default page href
            //var defaultPageIdWithHash = this.paginationLinks[this.defaultPage + 1].href; // plus 2 to account for previous / next page links

            // show default page; chrome uses absolute url with hash, hence search
            //not working
            // this.showPage(defaultPageIdWithHash.substring(defaultPageIdWithHash.search('#') + 2));
        }
    };

    // find any instances of carousels on the page, and initialise those found
    var init = function() {

        // make carousel constructor publicly available
        joose.classes.Carousel = Carousel;

        // find all carousels on the page not manually initialised
        var carousels = document.querySelectorAll('[data-component="carousel"]');
        var noOfCarousels = carousels.length;
        
        // if there are carousels we want to initialise them individually
        if (noOfCarousels > 0) {

            for (var i=0; i<noOfCarousels; i++) {

                // get the carousel details
                var carouselId = carousels[i].getAttribute('id');

                // default the id if none supplied
                if (!carouselId) {
                    carouselId = 'carousel-' + i;
                    carousels[i].setAttribute('id', carouselId);
                }

                // record instance of a carousel to variable
                if (!joose.carousels) joose.carousels = {};
                joose.carousels[carouselId] = new Carousel(carouselId);
            }
        }
    };

    return {
        init: init
    }

})(joose);

// initialise carousel functionality
joose.carousel.init();

// remove public method
delete joose.carousel.init;