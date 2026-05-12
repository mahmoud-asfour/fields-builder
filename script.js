/**
 * Fields Builder — Homepage Interactions
 * Uses jQuery for DOM manipulation, sliders, and UI interactions.
 * ========================================================================== */

(function ($) {
    'use strict';

    /* ======================================================================
       STICKY HEADER
       ====================================================================== */
    const $header = $('#header');
    const SCROLL_THRESHOLD = 50;

    function handleHeaderScroll() {
        if ($(window).scrollTop() > SCROLL_THRESHOLD) {
            $header.addClass('header--scrolled');
        } else {
            $header.removeClass('header--scrolled');
        }
    }

    $(window).on('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Run on load


    /* ======================================================================
       MOBILE MENU
       ====================================================================== */
    const $hamburger = $('#hamburger');
    const $mobileNav = $('#mobileNav');

    $hamburger.on('click', function () {
        const isOpen = $mobileNav.hasClass('open');
        $(this).toggleClass('active');
        $mobileNav.toggleClass('open');
        $(this).attr('aria-expanded', !isOpen);
        $('body').toggleClass('no-scroll');
    });

    // Mobile dropdown toggle
    $('.mobile-nav__link--toggle').on('click', function (e) {
        e.preventDefault();
        $(this).parent('.mobile-nav__dropdown').toggleClass('open');
    });

    // Close mobile nav on link click
    $('.mobile-nav__link:not(.mobile-nav__link--toggle)').on('click', function () {
        $hamburger.removeClass('active');
        $mobileNav.removeClass('open');
        $('body').removeClass('no-scroll');
    });

    // Close mobile nav on resize to desktop
    $(window).on('resize', function () {
        if ($(window).width() >= 1024) {
            $hamburger.removeClass('active');
            $mobileNav.removeClass('open');
            $('body').removeClass('no-scroll');
        }
    });


    /* ======================================================================
       LANG DROPDOWN
       ====================================================================== */
    const $langDropdown = $('.lang-dropdown');
    const $langBtn = $('.lang-dropdown__btn');

    $langBtn.on('click', function (e) {
        e.stopPropagation();
        const isOpen = $langDropdown.hasClass('open');
        $langDropdown.toggleClass('open');
        $langBtn.attr('aria-expanded', !isOpen);
    });

    // Close dropdown on outside click
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.lang-dropdown').length) {
            $langDropdown.removeClass('open');
            $langBtn.attr('aria-expanded', 'false');
        }
    });


    /* ======================================================================
       MEGA MENU IMAGE HOVER
       ====================================================================== */
    $('.mega-menu__link').on('mouseenter', function () {
        const imageUrl = $(this).data('image');
        if (imageUrl) {
            // Find the closest mega menu image container
            const $megaImage = $(this).closest('.mega-menu').find('.mega-menu__image img');
            if ($megaImage.length && $megaImage.attr('src') !== imageUrl) {
                // Create a smooth transition by fading out slightly before changing
                $megaImage.css('opacity', 0.8);

                const img = new Image();
                img.onload = function () {
                    $megaImage.attr('src', imageUrl);
                    $megaImage.css('opacity', 1);
                };
                img.src = imageUrl;
            }
        }
    });


    /* ======================================================================
       HERO SLIDER
       ====================================================================== */
    const $heroSlides = $('.hero__slide');
    const $heroDots = $('.hero__dot');
    const totalSlides = $heroSlides.length;
    let currentSlide = 0;
    let heroInterval;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;

        $heroSlides.removeClass('active');
        $heroDots.removeClass('active');

        $heroSlides.eq(index).addClass('active');
        $heroDots.eq(index).addClass('active');

        currentSlide = index;
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startHeroAutoplay() {
        heroInterval = setInterval(nextSlide, 5500);
    }

    function resetHeroAutoplay() {
        clearInterval(heroInterval);
        startHeroAutoplay();
    }

    // Controls
    $('.hero__arrow--next').on('click', function () {
        nextSlide();
        resetHeroAutoplay();
    });

    $('.hero__arrow--prev').on('click', function () {
        prevSlide();
        resetHeroAutoplay();
    });

    $heroDots.on('click', function () {
        goToSlide(parseInt($(this).data('dot')));
        resetHeroAutoplay();
    });

    // Keyboard: left/right on hero
    $(document).on('keydown', function (e) {
        if (e.key === 'ArrowRight') { nextSlide(); resetHeroAutoplay(); }
        if (e.key === 'ArrowLeft') { prevSlide(); resetHeroAutoplay(); }
    });

    // Touch/swipe for hero
    let touchStartX = 0;
    let touchEndX = 0;
    const $hero = $('.hero');

    $hero.on('touchstart', function (e) {
        touchStartX = e.originalEvent.changedTouches[0].screenX;
    });

    $hero.on('touchend', function (e) {
        touchEndX = e.originalEvent.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) { nextSlide(); } else { prevSlide(); }
            resetHeroAutoplay();
        }
    });

    startHeroAutoplay();


    /* ======================================================================
       CAROUSEL SLIDER (Facilities & Products)
       ====================================================================== */
    function initCarousel(trackSelector, arrowPrev, arrowNext) {
        const $track = $(trackSelector);
        const $cards = $track.children();
        let position = 0;

        if ($cards.length === 0) return;

        function getCardWidth() {
            return $cards.first().outerWidth(true);
        }

        function getVisibleCount() {
            const containerW = $track.parent().width();
            const cardW = getCardWidth();
            return Math.max(1, Math.floor(containerW / cardW));
        }

        function getMaxPosition() {
            return Math.max(0, $cards.length - getVisibleCount());
        }

        function updateTrack() {
            const cardW = getCardWidth();
            const dir = $('html').attr('dir') === 'rtl' ? 1 : -1;
            $track.css('transform', 'translateX(' + (dir * position * cardW) + 'px)');
        }

        $(arrowNext).on('click', function () {
            if (position < getMaxPosition()) {
                position++;
            } else {
                position = 0; // loop back
            }
            updateTrack();
        });

        $(arrowPrev).on('click', function () {
            if (position > 0) {
                position--;
            } else {
                position = getMaxPosition(); // loop to end
            }
            updateTrack();
        });

        // Reset on resize
        $(window).on('resize', function () {
            if (position > getMaxPosition()) {
                position = getMaxPosition();
            }
            updateTrack();
        });

        // Touch/swipe for slider
        let sliderTouchStartX = 0;
        $track.parent().on('touchstart', function (e) {
            sliderTouchStartX = e.originalEvent.changedTouches[0].screenX;
        });
        $track.parent().on('touchend', function (e) {
            const sliderTouchEndX = e.originalEvent.changedTouches[0].screenX;
            const diff = sliderTouchStartX - sliderTouchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    if (position < getMaxPosition()) position++;
                    else position = 0;
                } else {
                    if (position > 0) position--;
                    else position = getMaxPosition();
                }
                updateTrack();
            }
        });
    }

    // Initialize both sliders
    initCarousel(
        '.facilities__track',
        '.slider-arrow--prev[data-slider="facilities"]',
        '.slider-arrow--next[data-slider="facilities"]'
    );


    /* ======================================================================
       ANIMATED COUNTER (Stats)
       ====================================================================== */
    let statsAnimated = false;

    function animateCounters() {
        if (statsAnimated) return;
        statsAnimated = true;

        $('.stats__number').each(function () {
            const $this = $(this);
            const target = parseInt($this.data('target'));
            const duration = 2000;
            const start = 0;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + (target - start) * eased);

                $this.text(current);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    $this.text(target);
                }
            }

            requestAnimationFrame(update);
        });
    }


    /* ======================================================================
       INTERSECTION OBSERVER — Reveal Animations & Stats
       ====================================================================== */
    if ('IntersectionObserver' in window) {
        // Reveal elements
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
            revealObserver.observe(el);
        });

        // Stats counter trigger
        const statsSection = document.getElementById('stats');
        if (statsSection) {
            const statsObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounters();
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            statsObserver.observe(statsSection);
        }
    } else {
        // Fallback: immediately show everything
        $('.reveal, .reveal-left, .reveal-right').addClass('revealed');
        animateCounters();
    }


    /* ======================================================================
       FOOTER OFFICE TABS
       ====================================================================== */
    $('.footer__office-tab').on('click', function () {
        const office = $(this).data('office');

        // Update tabs
        $('.footer__office-tab').removeClass('active').attr('aria-selected', 'false');
        $(this).addClass('active').attr('aria-selected', 'true');

        // Update panels
        $('.footer__office-panel').removeClass('active');
        $('.footer__office-panel[data-panel="' + office + '"]').addClass('active');
    });


    /* ======================================================================
       SMOOTH SCROLL for anchor links
       ====================================================================== */
    $('a[href^="#"]').on('click', function (e) {
        const target = $(this).attr('href');
        if (target === '#') return;

        const $target = $(target);
        if ($target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $target.offset().top - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'))
            }, 600, 'swing');
        }
    });


    /* ======================================================================
       ADD REVEAL CLASSES DYNAMICALLY
       ====================================================================== */
    $(function () {
        // Add reveal animations to sections
        $('.about__image-wrap').addClass('reveal-left');
        $('.about__content').addClass('reveal-right');
        $('.stats').addClass('reveal');
        $('.section-header').addClass('reveal');
        $('.reference-card').addClass('reveal');
        $('.cta__inner').addClass('reveal');
        $('.footer__col').each(function (i) {
            $(this).addClass('reveal').css('transition-delay', (i * 0.1) + 's');
        });

        // Re-observe newly added elements
        if ('IntersectionObserver' in window) {
            const lateObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        lateObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            document.querySelectorAll('.reveal:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed)').forEach(function (el) {
                lateObserver.observe(el);
            });
        }
    });


    /* ======================================================================
       NO-SCROLL body class
       ====================================================================== */
    // Add CSS for no-scroll
    $('<style>').text('body.no-scroll{overflow:hidden}').appendTo('head');

    // Initialize Synchronized Product Slider
    initProductSync();

    // Initialize Last News Slider
    initNewsSlider();

    // Initialize FAB
    initFab();

    // Initialize Scroll Animations
    initScrollAnimations();

    // Initialize News Filters
    initNewsFilter();

    // Initialize Product Tabs
    initProductTabs();

    // Initialize FAQ Accordion
    initFAQAccordion();

    // Initialize Related Products Slider
    initRelatedSlider();

    // Initialize Office Accordion (Contact Page)
    initOfficeAccordion();

})(jQuery);

/**
 * Synchronized Product Slider (Dual-Pane)
 * Left pane: Simple stacked images with CSS opacity transitions
 * Right pane: Swiper vertical slider for content list
 */
function initProductSync() {
    // Ensure Swiper exists
    if (typeof Swiper === 'undefined') {
        console.error('Swiper is not loaded');
        return;
    }

    var $images = jQuery('.product-visual-img');
    var totalSlides = $images.length;

    // Initialize Swiper for vertical thumbs
    var thumbsSwiper = new Swiper('.product-thumbs-swiper', {
        direction: 'vertical',
        slidesPerView: 3,
        spaceBetween: 16,
        loop: true,
        slideToClickedSlide: true,
        watchSlidesProgress: true,
        breakpoints: {
            0: {
                direction: 'horizontal',
                slidesPerView: 1.2,
                spaceBetween: 15,
                centeredSlides: true
            },
            992: {
                direction: 'vertical',
                slidesPerView: 3,
                spaceBetween: 16,
                centeredSlides: false
            }
        }
    });

    // Sync: when thumbs slide changes, update the main image
    function syncMainImage(index) {
        // Handle loop indices (Swiper duplicates slides in loop mode)
        var realIndex = index % totalSlides;
        $images.removeClass('active');
        $images.filter('[data-index="' + realIndex + '"]').addClass('active');
    }

    // Listen for Swiper slide changes
    thumbsSwiper.on('slideChange', function () {
        syncMainImage(this.realIndex);
    });

    // Also listen for click on slides (slideToClickedSlide)
    thumbsSwiper.on('click', function () {
        syncMainImage(this.realIndex);
    });

    // Custom Navigation
    jQuery('.product-nav-btn--prev').on('click', function (e) {
        e.preventDefault();
        thumbsSwiper.slidePrev();
    });

    jQuery('.product-nav-btn--next').on('click', function (e) {
        e.preventDefault();
        thumbsSwiper.slideNext();
    });

    // Set initial state
    syncMainImage(0);
}

/**
 * Last News Slider
 * Handles fading between news images and content cards
 */
function initNewsSlider() {
    var $images = jQuery('.news__image');
    var $items = jQuery('.news__item');
    var totalItems = $images.length;
    var currentIndex = 0;

    if (totalItems === 0) return;

    function goToSlide(index) {
        $images.removeClass('active');
        $items.removeClass('active');

        $images.filter('[data-news="' + index + '"]').addClass('active');
        $items.filter('[data-news="' + index + '"]').addClass('active');

        currentIndex = index;
    }

    jQuery('.news__nav-btn--prev').on('click', function (e) {
        e.preventDefault();
        var prevIndex = (currentIndex - 1 + totalItems) % totalItems;
        goToSlide(prevIndex);
    });

    jQuery('.news__nav-btn--next').on('click', function (e) {
        e.preventDefault();
        var nextIndex = (currentIndex + 1) % totalItems;
        goToSlide(nextIndex);
    });

    // Optional Auto-play
    // setInterval(function() {
    //     var nextIndex = (currentIndex + 1) % totalItems;
    //     goToSlide(nextIndex);
    // }, 5000);
}

/**
 * Floating Action Button & Modal Logic
 */
function initFab() {
    // Toggle FAB Menu
    jQuery('.fab-toggle').on('click', function (e) {
        e.preventDefault();
        jQuery('.fab-container').toggleClass('is-open');
    });

    // Close FAB Menu when clicking outside
    jQuery(document).on('click', function (e) {
        if (!jQuery(e.target).closest('.fab-container').length) {
            jQuery('.fab-container').removeClass('is-open');
        }
    });

    // Open Quote Modal
    jQuery('.js-open-quote').on('click', function (e) {
        e.preventDefault();
        jQuery('body').addClass('modal-open');
        jQuery('.fab-container').removeClass('is-open'); // Close menu when modal opens
    });

    // Close Quote Modal
    jQuery('.js-close-quote').on('click', function (e) {
        e.preventDefault();
        jQuery('body').removeClass('modal-open');
    });

    // Prevent modal close when clicking inside the modal content
    jQuery('.quote-modal').on('click', function (e) {
        e.stopPropagation();
    });
}

/**
 * Filter dynamic items on News Archive Page
 */
function initNewsFilter() {
    var $filters = jQuery('.news-filter');
    var $cards = jQuery('.news-arch-card');
    var $searchInput = jQuery('.news-search-input');
    var $searchBtn = jQuery('.news-search-btn');

    if ($filters.length === 0 || $cards.length === 0) return;

    function filterCards(category, searchTerm) {
        searchTerm = searchTerm ? searchTerm.toLowerCase() : '';

        $cards.each(function () {
            var $card = jQuery(this);
            var cardCat = $card.attr('data-category');
            var cardTitle = $card.find('.news-arch-card__title').text().toLowerCase();
            var cardDesc = $card.find('.news-arch-card__excerpt').text().toLowerCase();

            var matchCategory = (category === 'all' || category === cardCat);
            var matchSearch = (searchTerm === '' || cardTitle.includes(searchTerm) || cardDesc.includes(searchTerm));

            if (matchCategory && matchSearch) {
                // Ensure element shows up using fade up animation logic if needed,
                // But a simple fadeIn makes the jump less jarring.
                $card.fadeIn(400);
            } else {
                $card.hide();
            }
        });
    }

    $filters.on('click', function () {
        $filters.removeClass('active');
        jQuery(this).addClass('active');

        var sortBy = jQuery(this).attr('data-filter');
        var currSearch = $searchInput.val();
        filterCards(sortBy, currSearch);
    });

    $searchInput.on('input', function () {
        var currSearch = jQuery(this).val();
        var sortBy = jQuery('.news-filter.active').attr('data-filter');
        filterCards(sortBy, currSearch);
    });

    $searchBtn.on('click', function (e) {
        e.preventDefault();
        var currSearch = $searchInput.val();
        var sortBy = jQuery('.news-filter.active').attr('data-filter');
        filterCards(sortBy, currSearch);
    });
}

/**
 * Filter dynamic items on Product Page Tabs
 */
function initProductTabs() {
    var $tabNavs = jQuery('.prod-tabs__nav-item');
    var $tabPanes = jQuery('.prod-tab-pane');

    if ($tabNavs.length === 0) return;

    $tabNavs.on('click', function () {
        // Remove active class from all
        $tabNavs.removeClass('active');
        $tabPanes.removeClass('active');

        // Add active class to clicked tab
        var $this = jQuery(this);
        $this.addClass('active');

        // If specific tab exists activate it, else fallback to features mockup
        var tabId = $this.attr('data-tab');
        if (jQuery('#tab-' + tabId).length) {
            jQuery('#tab-' + tabId).addClass('active');
        } else {
            jQuery('#tab-features').addClass('active');
        }
    });

    // Handle "Get a Quote" smooth scroll from Hero section
    jQuery('.js-hero-quote-btn').on('click', function (e) {
        e.preventDefault();

        // Activate the Quote tab
        var $quoteTab = jQuery('.prod-tabs__nav-item[data-tab="quote"]');
        if ($quoteTab.length) {
            $quoteTab.trigger('click');
        }

        // Smooth scroll down to the tabs section, accounting for the sticky header
        var targetOffset = jQuery('#prod-tabs').offset().top - 100;
        jQuery('html, body').animate({
            scrollTop: targetOffset
        }, 600);
    });
}

/**
 * FAQ Accordion Toggle Logic
 */
function initFAQAccordion() {
    var $headers = jQuery('.faq-accordion__header');

    if ($headers.length === 0) return;

    $headers.on('click', function () {
        var $item = jQuery(this).closest('.faq-accordion__item');
        var isActive = $item.hasClass('active');

        // Close all other items
        jQuery('.faq-accordion__item').removeClass('active');

        // Toggle the clicked item
        if (!isActive) {
            $item.addClass('active');
        }
    });
}

/**
 * Related Products Slider
 */
function initRelatedSlider() {
    if (jQuery('.prod-related__slider').length === 0) return;

    var relatedSwiper = new Swiper('.prod-related__slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            1024: {
                slidesPerView: 2,
                spaceBetween: 40,
            }
        }
    });

    // Custom Navigation
    jQuery('.prod-related__nav .btn-arrow').first().on('click', function () {
        relatedSwiper.slidePrev();
    });
    jQuery('.prod-related__nav .btn-arrow').last().on('click', function () {
        relatedSwiper.slideNext();
    });
}

/**
 * Scroll Animations using IntersectionObserver
 * Elements fade up slightly as they come into the viewport
 */
function initScrollAnimations() {
    // 1. Target key elements dynamically rather than manually adding classes to HTML
    var animSelectors = [
        '.prod-hero__image-col',
        '.prod-hero__content-col',
        '.prod-tabs .container',
        '.prod-related__header',
        '.prod-related__slider',
        '.page-header__content',
        '.section-label',
        '.section-title',
        '.section-desc',
        '.about__content > *',
        '.about__image-wrap',
        '.stats__item',
        '.facility-card',
        '.product-sync__visual',
        '.product-sync__content',
        '.news__header',
        '.news__slider',
        '.cta__inner > *',
        '.news-archive__bar',
        '.news-arch-card',
        '.facility-details__slider-wrapper',
        '.facility-details__content',
        '.projects-header',
        '.projects-slider',
        '.facility-cta__banner',
        '.faq-header',
        '.faq-accordion__item',
        '.about-hero__content',
        '.about-mv__block',
        '.about-mv__athlete',
        '.about-brands__inner',
        '.reveal-left',
        '.reveal-right',
        '.about-circular'
    ];

    var $elements = jQuery(animSelectors.join(', '));

    // 2. Add the base starting class 
    $elements.each(function (index) {
        var $el = jQuery(this);
        $el.addClass('fade-up-element');

        // Add staggered delays for repeated siblings to cascade in
        if ($el.hasClass('stats__item') || $el.hasClass('facility-card') || $el.hasClass('news-arch-card')) {
            $el.css('transition-delay', (index % 4) * 0.15 + 's');
        } else if ($el.parent().hasClass('about__content') || $el.parent().hasClass('cta__inner')) {
            $el.css('transition-delay', (index % 3) * 0.1 + 's');
        }
    });

    // 3. Setup Intersection Observer
    if ('IntersectionObserver' in window) {
        var observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px', // Trigger slighly before entering the viewport fully
            threshold: 0.1
        };

        var observer = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, observerOptions);

        // 4. Start observing each element
        $elements.each(function () {
            observer.observe(this);
        });
    } else {
        // Fallback for older browsers (reveal instantly)
        $elements.addClass('in-view');
    }
}

/**
 * Office Accordion (Contact Page)
 * Toggle office locations – only one open at a time
 */
function initOfficeAccordion() {
    var $items = jQuery('.office-accordion__item');
    if ($items.length === 0) return;

    $items.find('.office-accordion__header').on('click', function () {
        var $parentItem = jQuery(this).closest('.office-accordion__item');

        if ($parentItem.hasClass('active')) {
            // Close current
            $parentItem.removeClass('active');
        } else {
            // Close all, open clicked
            $items.removeClass('active');
            $parentItem.addClass('active');
        }
    });
}
