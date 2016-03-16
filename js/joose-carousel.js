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
    var Carousel = function(carouselId, defaultPage, continuousScroll) {

        // set the container element
        this.carouselId = carouselId;
        this.container = document.getElementById(carouselId);

        // cancel if no container found
        if (!this.container) return false;

        // store the default page, set to first as default if not supplied (0-indexed)
        var defaultPage = parseInt(this.container.getAttribute('data-default-page'));
        this.defaultPage = (typeof defaultPage === 'number' && defaultPage + '' !== 'NaN') ? defaultPage : 1;

        // store the pagination links
        this.paginationLinks = document.querySelectorAll('#' + this.carouselId + ' > ul a');
        this.noOfPaginationLinks = this.paginationLinks.length;
        this.noOfPages = this.noOfPaginationLinks - 2; // don't count previous and next page links
        this.prevLink = this.paginationLinks[0];
        this.nextLink = this.paginationLinks[1];

        // store other details
        this.pagesContainer = this.container.querySelector('#' + this.carouselId + ' > div');
        this.noOfPagesShown = this.container.getAttribute('data-pages-shown') || 1;
        this.horizontalCarousel = this.container.getAttribute('data-horizontal-carousel') === 'false' ? false : true;
        this.continuousScroll = this.container.getAttribute('data-continuous-scroll') === 'false' ? false : true;
        this.pageChangeDelay = this.container.getAttribute('data-page-change-delay');

        // perform initial setup of the carousel
        this.init();

    };

    // set common properties for carousel
    Carousel.prototype = {

        // open the relevant page
        showPage: function(pageId) {
            
            // get the page to open and it's trigger and page number
            var pageTrigger = this.container.querySelector('[href="#' + pageId + '"]:not([data-direction])');
            var pageToShow = this.container.querySelector('#' + pageId);
            var pageNumber = pageToShow.getAttribute('data-page-number');

            // if the page exists
            if (pageToShow) {

                // remove classes from other pages
                for (var i=0; i<this.noOfPages; i++) {
                    joose.utils.removeClass(this.paginationLinks[i+2].parentNode, config.expandedClassForTrigger);
                    joose.utils.removeClass(this.pages[i], config.expandedClassForContent);
                }

                // 'scroll' to the selected page; add class to trigger's parent for styling flexibility
                joose.utils.addClass(pageTrigger.parentNode, config.expandedClassForTrigger);
                joose.utils.addClass(pageToShow, config.expandedClassForContent);
                if (this.horizontalCarousel) {
                    this.pagesContainer.style.marginLeft = '-' + ((pageNumber - 1) * this.pageWidth) + 'px';
                } else {
                    this.pagesContainer.style.marginTop = '-' + ((pageNumber - 1) * this.pageHeight) + 'px';
                }
            }
        },

        // used to show the next page automatically as a timed event
        timedShowPage: function () {
            var carousel = this;
            carousel.pageChangeTimeout = setTimeout(function() {
                carousel.nextLink.click();
                carousel.timedShowPage();
            }, carousel.pageChangeDelay);
        },

        // stop auto-scroll, e.g. if want to play a video on a tab
        stopTimedShowPage: function() {
            clearTimeout(this.pageChangeTimeout);
        },

        // bind click event to triggers to open relevant page
        bindEvents: function() {
            var carousel = this;
            
            for (var i=0; i<this.noOfPaginationLinks; i++) {
                
                // don't give a page number to a prev / next link
                if (i>1) {
                    this.paginationLinks[i].setAttribute('data-page-number', i-1);
                } else {
                    var direction = (i === 0) ? 'prev' : 'next';
                    this.paginationLinks[i].setAttribute('data-direction', direction);
                }

                // add event to change page
                this.paginationLinks[i].addEventListener('click', function(e) {
                    e.preventDefault();
                    if (this.getAttribute('aria-disabled') === 'true') return false;
                    carousel.showPage(this.getAttribute('aria-controls'));
                    carousel.updatePrevNextPaginationLinks.call(carousel, parseInt(this.getAttribute('data-page-number')));
                });
            }

            // if a delay has been supplied, create auto-scrolling carousel
            if (this.pageChangeDelay !== null) {
                this.pageChangeDelay = parseInt(this.pageChangeDelay);
                if (this.pageChangeDelay + '' !== 'NaN') {

                    // convert the delay to milliseconds after taking into account any CSS transitions
                    var transitionDelay = parseInt(getComputedStyle(this.pagesContainer).transitionDuration);
                    if (typeof transitionDelay !== 'number' || transitionDelay + '' === 'NaN') transitionDelay = 0;
                    this.pageChangeDelay = (this.pageChangeDelay + transitionDelay) * 1000;

                    // start timeout loop
                    carousel.timedShowPage();
                }
            }
        },

        // update the prev / next page pagination links details based on the page shown
        updatePrevNextPaginationLinks: function(pageNo) {

            var prevPageNumber;
            var nextPageNumber;

            // get the page number of the previous page and decide whether to disable link if required
            if (pageNo-1 < 1) {
                prevPageNumber = this.noOfPages;
                if (!this.continuousScroll) {
                    this.prevLink.setAttribute('aria-disabled', 'true');
                }
            } else {
                prevPageNumber = pageNo-1;
                if (!this.continuousScroll) {
                    this.prevLink.removeAttribute('aria-disabled');
                }
            }
            if (pageNo+1 > this.noOfPages) {
                nextPageNumber = 1;
                if (!this.continuousScroll) {
                    this.nextLink.setAttribute('aria-disabled', 'true');
                }
            } else {
                nextPageNumber = pageNo+1;
                if (!this.continuousScroll) {
                    this.nextLink.removeAttribute('aria-disabled');
                }
            }

            // get the prev / next page elements
            var prevPage = this.container.querySelector('section[data-page-number="' + prevPageNumber + '"]');
            var nextPage = this.container.querySelector('section[data-page-number="' + nextPageNumber + '"]');

            // get the id's of the prev / next pages
            var prevPageId = prevPage.getAttribute('id');
            var nextPageId = nextPage.getAttribute('id');

            // set the page number, the href and the aria-controls attributes for prev / next links
            this.prevLink.setAttribute('data-page-number', prevPageNumber);
            this.nextLink.setAttribute('data-page-number', nextPageNumber);
            this.prevLink.setAttribute('href','#' + prevPageId);
            this.nextLink.setAttribute('href','#' + nextPageId);
            this.prevLink.setAttribute('aria-controls', prevPageId);
            this.nextLink.setAttribute('aria-controls', nextPageId);
        },

        // initialise the carousel
        init: function() {

            // apply data attribute for styling if not already present
            if (!this.container.hasAttribute('data-component')) {
                this.container.setAttribute('data-component', 'carousel');
            };

            // get the carousel pages
            this.pages = this.pagesContainer.querySelectorAll('[aria-labelledby]');

            // style the carousel (needs to be calculated dynamically)
            if (this.horizontalCarousel) {
                this.pageWidth = (this.pagesContainer.clientWidth / this.noOfPagesShown);
                this.pagesContainer.style.width = (this.pageWidth * this.noOfPages) + 'px';
            } else {
                this.pageHeight = parseInt(getComputedStyle(this.container).height) / this.noOfPagesShown; // no float therefore still in flow. Fixed height required on carousel
                this.pagesContainer.style.height = (this.pageHeight * this.noOfPages) + 'px';
            }
            for (var i=0; i<this.noOfPages; i++) {
                if (this.horizontalCarousel) {
                    this.pages[i].style.width = (this.pageWidth / this.noOfPagesShown) + 'px';
                } else {
                    this.pages[i].style.height = (this.pageHeight / this.noOfPagesShown) + 'px';
                }

                // utilising existing loop for adding attr
                this.pages[i].setAttribute('data-page-number', i+1);
            }

            // bind events to this instance of a carousel
            this.bindEvents();

            // get the default page href
            var defaultPageIdWithHash = this.paginationLinks[this.defaultPage + 1].href; // plus 2 to account for previous / next page links

            // remove any part of a URL before the hash
            var defaultPageId = defaultPageIdWithHash.substring(defaultPageIdWithHash.indexOf('#') + 1);

            // show default page; chrome uses absolute url with hash, hence search
            this.showPage(defaultPageId);

            // initialise the prev / next page link values
            this.updatePrevNextPaginationLinks(this.defaultPage);
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