
if ( !window.$ ) window.$ = window.jQuery;

// Create Namespace
var LD = window.LD || {};

/* EVENT MANAGER */
LD.EM = LD.EM || $({});

/*
 * EVENTS
 */
LD.Events = {
    APP_READY 	: "APP_READY",
    SCROLLED 	: "SCROLLED",
    RESIZED		: "RESIZED"
};

// VARS-CONST
LD.WIDTH = 0;
LD.HEIGHT = 0;

$(window).ready(function(){

	$("html").addClass( (LD.Utils.hasTouch() ? "touch" : "no-touch") );

	LD.Resize.init();
	LD.Scroll.init();
	LD.Menu.init();
	LD.Carousel.init();
	LD.Footer.init();

	if ( $(".home").length )
		LD.Home.init();

	if ( $(".news").length )
		LD.News.init();
});

$(window).load(function() {
	$(window).trigger("resize");
	$(window).trigger("scroll");
});


LD.Utils = {

	hasTouch : function() {
		return 'ontouchstart' in window;
	},

	isValidEmailAddress : function (emailAddress) {
		var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		return pattern.test(emailAddress);
	},

	map : function(value, start1, stop1, start2, stop2) {
		return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
	},

	createCookie : function(name,value,days) {

		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			expires = "; expires="+date.toGMTString();
		}
		document.cookie = name+"="+value+expires+"; path=/";
	},

	readCookie : function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},

	eraseCookie : function(name) {
		LD.Utils.createCookie(name,"",-1);
	}
};

LD.Carousel = LD.Carousel || {

	sliders : [],

	init : function() {

		if ( $(".article-carousel").length === 0 ) return;
		this.initSwipe();
	},

	initSwipe : function() {

		var self = this;
		$(".article-carousel .swipe").each( function( i, swipe ) {

			var slider = new Swipe(swipe, {
				speed: 900,
				continuous: true,
				callback : $.proxy( self.callbackSlider, self )
			});

			$(swipe).parents(".article-preview").data("index", i);

			self.sliders.push( slider );
		});

		imagesLoaded( $('body'), function() {
			LD.EM.trigger( LD.Events.RESIZED );
		});


		$(".btn-next, .btn-prev", ".article-carousel").on("click", $.proxy( this.navSwipe, this ));
		$(".btn-dot", ".article-carousel").on("click", $.proxy( this.dotSwipe, this ));
	},

	callbackSlider : function(index, el) {
		
		var 
			$el = $(el),
			$parent = $el.parents(".article-preview, .article-full"),
			sliderIndex = $parent.data("index") || 0,
			slider = this.sliders[ sliderIndex ];

		$(".btn-dot.selected", $parent).removeClass("selected");
		$(".btn-dot:eq(" + slider.getPos() + ")", $parent).addClass("selected");
	},

	navSwipe : function(e) {

		e.preventDefault();

		var 
			$el = $(e.currentTarget),
			sliderIndex = $el.parents(".article-preview").data("index") || 0,
			slider = this.sliders[ sliderIndex ];

		if ( $el.hasClass("btn-prev") ) {
			slider.prev();
		} else {
			slider.next();
		}
	},

	dotSwipe : function(e) {

		e.preventDefault();

		var 
			$el = $(e.currentTarget),
			sliderIndex = $el.parents(".article-preview").data("index") || 0,
			slider = this.sliders[ sliderIndex ];

		slider.slide( $el.data("index") );
	}
};

LD.Footer = LD.Footer || {

	init : function() {

		this.initBtn();
		this.initNewsletter();
	},

	initBtn : function() {

		$("footer .btn-top").on("click", $.proxy( this.onTopClick, this ));
	},

	onTopClick : function(e) {
		e.preventDefault();
		$("html, body").animate({
			scrollTop : 0
		}, 1200);
	},

	initNewsletter : function () {

		var 
			$context = $("footer"),
			email;

		$(".form-newsletter", $context).on("submit", function(e){
			e.preventDefault();

			$(".valid-error, .post-error, .valid", $context).hide();

			email = $(".form-email", this).val();
			if ( LD.Utils.isValidEmailAddress(email) ) {

				$.post( $(this).attr("action"), $(this).serialize(), function() {
					$(".valid", $context).show();
				})
				.fail(function() {
					$(".post-error", $context).show();
				});
				
			} else {
				$(".valid-error", $context).show();
			}
		
		});
	},
};

LD.Menu = LD.Menu || {

	init : function() {

		this.initLang();
	},

	initLang : function() {

		var newlang;
		$(".btn-lang").on("click", function(e){
			e.preventDefault();

			newlang = $(this).data("lang");
			LD.Utils.eraseCookie("leduc_lang");
			LD.Utils.createCookie("leduc_lang", newlang, 365);
			window.location.reload();
		});
	}

};


LD.Resize = LD.Resize || {

	init : function() {

		LD.WIDTH = $(window).width();
		LD.HEIGHT = $(window).height();

		$(window).on("resize", $.proxy(this.onResize, this));
	},

	kill : function() {

		$(window).off("resize", $.proxy(this.onResize, this));
	},

	onResize : function() {

		LD.WIDTH = $(window).width();
		LD.HEIGHT = $(window).height();
		
		LD.EM.trigger( LD.Events.RESIZED );
	}
};

LD.Scroll = LD.Scroll || {

	$body : null,
	$carte : null,
	$lunch : null,
	$starters : null,
	$mains : null,
	$restaurant : null,
	
	scrollPos : null,
	scrollLunch : null,
	scrollStarters : null,
	scrollMains : null,
	scrollRestaurant : null,

	init : function() {

		this.$body = $("body");

		this.$carte = $(".home-carte");
		this.$lunch = $(".block-lunch");
		this.$starters = $(".block-starters");
		this.$mains = $(".block-mains");

		this.$restaurant = $(".home-restaurant");

		this.onResized();
		LD.EM.on( LD.Events.RESIZED, $.proxy( this.onResized, this ) );
		$(window).on("scroll", $.proxy(this.onScroll, this));
	},

	kill : function() {

		$(window).off("scroll", $.proxy(this.onScroll, this));
	},

	onResized : function() {

		if ( this.$carte.length === 0 ) return;

		var 
			offset = Math.round(LD.HEIGHT*0.5),
			offsetTopCarte = this.$carte.position().top;

		this.scrollLunch = offsetTopCarte - offset;
		this.scrollStarters = offsetTopCarte + this.$starters.position().top - offset - 150;
		this.scrollMains = offsetTopCarte + this.$mains.position().top - offset - 150;

		this.scrollRestaurant = this.$restaurant.position().top - offset;
	},

	onScroll : function() {

		this.checkScroll( 128, this.$body, "sticky" );
		
		if ( !LD.Utils.hasTouch() ) {
			this.checkScroll( this.scrollLunch, this.$lunch, "show-lunch" );
			this.checkScroll( this.scrollStarters, this.$starters, "show-starters" );
			this.checkScroll( this.scrollMains, this.$mains, "show-mains" );

			this.checkScroll( this.scrollRestaurant, this.$restaurant, "show-restaurant" );
		}
		
		LD.EM.trigger( LD.Events.SCROLLED );
	},

	checkScroll : function( limit, $el, className ) {

		var currentScrollPos = $(document).scrollTop();
		LD.scrollPos = currentScrollPos;

		if ( currentScrollPos > limit ) {
			$el.addClass(className);
		} else {
			$el.removeClass(className);
		}
	}
};

LD.Home = LD.Home || {

	$sliders : null,
	sliders : [],

	init : function() {

		this.$sliders = $(".swipe-container");

		this.initMenu();
		this.initSliders();
		this.initCarte();

		// GOOGLE MAPS
		this.initMap();

		LD.EM.on( LD.Events.SCROLLED, $.proxy( this.onScrolled, this ) );
		LD.EM.on( LD.Events.RESIZED, $.proxy( this.onResized, this ) );
	},

	initMenu : function () {

		$(".logo a").on("click", function(e) {
			
			if ( $(".home").length ) {

				e.preventDefault();

				$('html,body').animate({
					scrollTop: 0
				}, 1000);
			}
		});

		$("a.btn-internal").on("click", function(e) {

			e.preventDefault();

			var target = $(this).attr("href").replace("/", "");

			$('html,body').animate({
				scrollTop: $( target ).offset().top - 110
			}, 1000);
		});
	},

	initSliders : function() {

		var self = this;

		$(".swipe").each( function( i, swipe ) {

			var slider = new Swipe(swipe, {
				auto : 6000,
				speed: 900,
				continuous: true,
				callback : $.proxy( self.callbackSlider, self )
			});

			self.sliders.push( slider );
		});

		$(".btn-next, .btn-prev").on("click", $.proxy( this.navSwipe, this ));
		$(".btn-dot").on("click", $.proxy( this.dotSwipe, this ));
	},

	navSwipe : function(e) {

		e.preventDefault();

		var 
			$el = $(e.currentTarget),
			sliderIndex = $el.parents(".swipe-container").data("index"),
			slider = this.sliders[ sliderIndex ];

		if ( $el.hasClass("btn-prev") ) {
			slider.prev();
		} else {
			slider.next();
		}
	},

	dotSwipe : function(e) {
		e.preventDefault();

		var 
			$el = $(e.currentTarget),
			sliderIndex = $el.parents(".swipe-container").data("index"),
			slider = this.sliders[ sliderIndex ];

		slider.slide( $el.data("index") );
	},

	callbackSlider : function( index, el ) {

		var 
			$el = $(el),
			$parent = $el.parents(".swipe-container"),
			sliderIndex = $parent.data("index"),
			slider = this.sliders[ sliderIndex ];

		$(".btn-dot.selected", $parent).removeClass("selected");
		$(".btn-dot:eq(" + slider.getPos() + ")", $parent).addClass("selected");
	},

	initMap : function() {

		var 
			$el = $(".map"),
			center = new google.maps.LatLng( $el.data("lat"), $el.data("lng") ),

			mapOptions = {
				scrollwheel : false,
				disableDefaultUI : true,
				center: center,
				zoom: 15,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				styles : [{"featureType":"all","stylers":[{"saturation":0},{"hue":"#e7ecf0"}]},{"featureType":"road","stylers":[{"saturation":-70}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"simplified"},{"saturation":-60}]}]
	        },
	        map = new google.maps.Map($el[0], mapOptions);

	    new google.maps.Marker({
			"position": center,
			"map": map
		});
	},

	initCarte : function() {

		this.$carteWrap = $(".home-carte");
		this.$carteHeight = this.$carteWrap.height();
		this.$carteTop = this.$carteWrap.position().top;
		this.$fishes = $(".fish", this.$carteWrap);
	},

	onScrolled : function() {

		if ( LD.Utils.hasTouch() ) return;

		if ( this.$carteTop < LD.scrollPos + LD.HEIGHT && this.$carteTop + this.$carteHeight > LD.scrollPos ) {
			
			var 
				val = this.$carteTop - (LD.scrollPos + LD.HEIGHT),
				max = this.$carteHeight + LD.HEIGHT,
				p = LD.Utils.map( val, 0, max, 0, 150 ),
				$fish = null;

			this.$fishes.each(function (i, fish) {

				$fish = $(fish);
				$fish.css("transform", "translateY(" + (p * $fish.data("speed")) + "%)");
			});
		}
	},

	onResized : function() {

	}
};

LD.News = LD.News || {

	init : function() {

		this.initBtnTop();
	},

	initBtnTop : function() {

		$(".btn-top").on("click", $.proxy(this.toTop, this));
	},

	toTop : function() {

		$("html, body").animate({
			"scrollTop" : 0
		}, 300);
	}
};