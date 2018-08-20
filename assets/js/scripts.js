var __widthMobile = 1270;
var __widthMobileTablet = 1000;
var __widthMobileTabletMiddle = 820;
var __widthMobileMobile = 540;
var __isMobile = ($(window).width() <= __widthMobile);
var __isMobileTablet = ($(window).width() <= __widthMobileTablet);
var __isMobileTabletMiddle = ($(window).width() <= __widthMobileTabletMiddle);
var __isMobileMobile = ($(window).width() <= __widthMobileMobile);
var __animationSpeed = 350;

function initElements(element) {
	$element=$(element ? element : 'body');

	$(window).on('resize', function(){
		onResize();
	});

	$.widget('app.selectmenu', $.ui.selectmenu, {
		_drawButton: function() {
		    this._super();
		    var selected = this.element
		    .find('[selected]')
		    .length,
		        placeholder = this.options.placeholder;

		    if (!selected && placeholder) {
		      	this.buttonItem.text(placeholder).addClass('placeholder');
		    } else {
		    	this.buttonItem.removeClass('placeholder');
		    }
		}
	});

	$element.find('select').each(function(i, select) {
		var offset = $(select).attr('data-offset');
		if ($(select).attr('data-pos') == 'right') {
			var data = {
				position: {my : "right"+(offset?"+"+offset:"")+" top+12", at: "right bottom"}
			}
		} else {
			var data = {
				position: {my : "left"+(offset?"+"+offset:"")+" top+12"}
			}
		}
		if ($(select).attr('placeholder')) {
			data['placeholder'] = $(select).attr('placeholder');
		}
		data['change'] = function(e, ui) {
			$(ui.item.element).closest('.input-holder').addClass('focused');
		}
		$(select).selectmenu(data);
		if ($(select).attr('placeholder')) {
			$(select).prepend('<option value="" disabled selected>' + data['placeholder'] + '</option>');
		}
	});

	$element.find('input[type="checkbox"], input[type="radio"]').checkboxradio(); 

	$element.find('.modal-close, .close-btn').click(function() {
		hideModal(this);
	});

	$element.find('.tabs, .js-tabs').lightTabs();

	$('body').mouseup(function(e) {
		if ($('.modal-fadeout').css('display') == 'block') {
			if (!$(e.target).closest('.contents').length) {
				hideModal();
			}
		}
		if (!$(e.target).closest('#search').length) {
			$('#search').removeClass('opened');
			$('#search').prev('ul').stop().animate({opacity: 1}, __animationSpeed);
		}
		$('.confirm-popup').each(function(i, confirm) {
			if ($(confirm).css('display') == 'block') {
				if ($(e.target).closest('.confirm-popup') != $(confirm)) {
					$(confirm).stop().fadeOut(__animationSpeed);
				}
			}
		});

		$('.mobile-select').each(function(i, select) {
			if ($(select).children('.mobile-dropdown').css('display') == 'block') {
				if ($(e.target).closest('.mobile-select') != $(select)) {
					$(select).children('.mobile-dropdown').stop().fadeOut(__animationSpeed);
				}
			}
		});

	}).keypress(function(e){
		if ($('.modal-fadeout').css('display') == 'block') {
			if (!e)e = window.event;
			var key = e.keyCode||e.which;
			if (key == 27){
				hideModal();
			} 
		}
	});

	$element.find('.input-holder input, .input-holder textarea').keydown(function() {
		if ($(this).val()) {
			$(this).parent('.input-holder').addClass('focused');
		}
	}).keyup(function() {
		if (!$(this).val()) {
			$(this).parent('.input-holder').removeClass('focused');
		}
	}).focusout(function() {
		if (!$(this).val()) {
			$(this).parent('.input-holder').removeClass('focused');
		}
	}).each(function(i, item) {
		if ($(item).val()) {
			$(item).parent('.input-holder').addClass('focused');
		}
	});

	$element.find('form input:text, form input[type="email"], form input[type="tel"], form input[type="number"], form input[type="password"], form textarea').on('click keyup change', function() {
		checkForm($(this).closest('form'));
	});
	$element.find('form').each(function(i, form) {
		checkForm(form);
	});

	fadeoutInit();
	mobileSelectInit();
}
function onResize() {
	__isMobile = ($(window).width() <= __widthMobile);
	__isMobileTablet = ($(window).width() <= __widthMobileTablet);
	__isMobileTabletMiddle = ($(window).width() <= __widthMobileTabletMiddle);
	__isMobileMobile = ($(window).width() <= __widthMobileMobile);

	fadeoutInit();
	mobileSelectInit();
}

function parseUrl(url) {
	if (typeof(url) == 'undefined') url=window.location.toString();
	var a = document.createElement('a');
	a.href = url;

	var pathname = a.pathname.match(/^\/?(\w+)/i);	

	var parser = {
		'protocol': a.protocol,
		'hostname': a.hostname,
		'port': a.port,
		'pathname': a.pathname,
		'search': a.search,
		'hash': a.hash,
		'host': a.host,
		'page': pathname?pathname[1]:''
	}		

	return parser;
} 

function checkForm(form) {
	var checked = true;
	$(form).find('input:text, input[type="email"], input[type="tel"], input[type="password"], input[type="number"], textarea').each(function(i, input) {
		if (!input.checkValidity()) checked = false;
	});
	$(form).find('[data-submit-btn="true"]').attr('disabled', !checked);
	return checked;
}

function showModal(modal_id) {
	var $modal = $('#' + modal_id);
	$('.modal-fadeout').stop().fadeIn(300);
	$modal.stop().fadeIn(450).css({
		'display': __isMobileTablet ? 'block' : 'table',
		'top': $(window).scrollTop()
	});

	$modal.children('.modal').addClass('js-test');
	var oversize = $(window).height() < $modal.find('.contents').outerHeight();
	$modal.children('.modal').removeClass('js-test');

	if (($modal.attr('data-long') || oversize) && $(window).height() > 500) {
		$('html').addClass('html-modal-long');
	} else {
		$('html').addClass('html-modal');
	}
}

function hideModal(sender) {
	var $modal = sender ? $(sender).closest('.modal-wrapper') : $('.modal-wrapper[display!="none"]');
	$('.modal-fadeout').stop().fadeOut(300);
	$modal.stop().fadeOut(450, function() {
		$('html').removeClass('html-modal html-modal-long').find('#layout').css('height', 'auto');
	});
}

function fadeoutInit() {
	$('.js-fadeout').each(function(i, block) {
		if (!$(block).data('inited')) {
			var $holder = $('<div class="fadeout-holder"></div>').insertAfter($(block));
			$holder.html($(block));
			$(block).data('inited', true);
		}

		$(block).addClass('nowrap');
		$(block).scrollLeft(0);
		var w_child = 0;
		var range = document.createRange();

		$.each(block.childNodes, function(i, node) {
			if (node.nodeType != 3) {
				w_child += $(node).outerWidth(true);
			} else {
				if (typeof(range) != 'undefined') {
					range.selectNodeContents(node);
					var size = range.getClientRects();
					if (typeof(size) != 'undefined' && typeof(size[0]) != 'undefined' && typeof(size[0]['width'] != 'undefined')) w_child += size[0]['width'];
				}
			}
		});

		if (w_child > $(block).width()) {
			$(block).addClass('fadeout').removeClass('nowrap').swipe({
				swipeLeft: function(event, direction, distance) {
					var scroll_value = $(this).scrollLeft();
					var scroll_max = $(this).prop('scrollWidth') - $(this).width();
					var scroll_value_new = scroll_value - 0 + distance;
					$(this).stop().animate({
						scrollLeft: '+' + distance
					}, __animationSpeed, 'easeInOutQuart');
					if (scroll_value_new >= scroll_max) $(this).addClass('scrolled-full');
					else $(this).removeClass('scrolled-full')
				},
				swipeRight: function(event, direction, distance) {
					var scroll_value = $(this).scrollLeft();
					$(this).stop().animate({
						scrollLeft: '-' + distance
					}, __animationSpeed, 'easeInOutQuart');
					$(this).removeClass('scrolled-full');
				},
				threshold: 0
			});
		} else {
			$(block).removeClass('fadeout');
		}
	});
}

function mobileSelectInit() {
	$('.mobile-select').each(function(i, select) {
		if (!$(select).data('mobile-select-inited')) {
			var $dropdown = $('<ul class="mobile-dropdown"></ul>').appendTo($(select));
			$(select).children().each(function(i, item) {
				if (item.tagName.toLowerCase() == 'span' || item.tagName.toLowerCase() == 'a') {
					$li = $('<li>' + $(item).text() + '</li>').appendTo($dropdown);
					if (item.tagName.toLowerCase() == 'span') $li.addClass('active');
					$li.click(function(e) {
						e.stopPropagation();
						if (!$(this).hasClass('active')) {
							$(this).addClass('active')
								.siblings('.active').removeClass('active')
								.closest('.mobile-select').children('span').text($(this).text());
						}

						// FIXME
						// DO SOMETHING

						$dropdown.stop().hide();
					});
				}
			});
			$(select).click(function() {
				if (__isMobileTablet) {
					if ($(this).children('.mobile-dropdown').css('display') != 'block') {
						$(this).children('.mobile-dropdown').stop().fadeIn(__animationSpeed);
					}
				}
			});
			$(select).data('mobile-select-inited', true);
		}
	});
}

(function ($) {
	$.fn.lightTabs = function(){        
		var initTabs = function(){
            var tabs = this;
            
            $(tabs).find('a').each(function(i, tab){
                $(tab).click(function(e) {
                	e.preventDefault();
                	if (!$(this).hasClass('tab-act')) {
                		var target_id = $(this).attr('href');
	                	var old_target_id = $(tabs).find('.tab-act').attr('href');
	                	$(target_id).show();
	                	$(old_target_id).hide();
	                	$(tabs).find('.tab-act').removeClass('tab-act');
	                	$(this).addClass('tab-act');
                	}

                	return false;
                });
                if (i == 0) $(tab).click();                
                else $($(tab).attr('href')).hide();
            });			
        };		
        return this.each(initTabs);
    };

	$(function () {
		initElements();
		onResize();

		// CHECK HASH FOR TABS
		var url_data = parseUrl();
		$('.tabs, .js-tabs').find('a').each(function(i, link) {
			if (url_data.hash == $(link).attr('href')) {
				$(link).click();
			}
		});

		// BURGER
		$('.menu-holder').click(function() {
			if (__isMobile) {
				if (!$('html').hasClass('html-mobile-opened')) {
					if (!$(this).children('.close').length) {
						$(this).append('<div class="close"></div>');
						$(this).children('.close').click(function(e) {
							e.stopPropagation();
							if ($('html').hasClass('html-mobile-opened')) {
								$('html').removeClass('html-mobile-opened html-modal-long').find('#layout').css('height', 'auto');
							}
						});
					}

					$('html').addClass('html-mobile-opened');

					var inner_h = $('#menu-main').outerHeight(true) + $('#bl-profile').outerHeight(true);
					var window_h = $(window).height();
					if (inner_h + window_h*0.15 > window_h) {
						$('html').addClass('html-modal-long').find('#layout').css('height', $('.menu-holder').outerHeight());
					} else {
						$('html').removeClass('html-modal-long').find('#layout').css('height', 'auto');
					}
				}
			}
		});

		// MOBILE SLICK
		if (__isMobileTabletMiddle) {
			$('.mobile-slider').each(function(i, slider) {
				if (($(slider).attr('data-mobile') && __isMobileSmall) || !$(slider).attr('data-mobile')) {
					$(slider).slick({
						slidesToShow: 1,
						slidesToScroll: 1,
						dots: true,
						arrows: false,
						autoplay: false
					});
				}
			});
		}

		// INDEX SLIDER
		if ($('#bl-slider').length) {
			var speed = parseInt($('#bl-slider').attr('data-autochange-interval-sec')) * 1000;
			$('#bl-slider ul').slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				dots: true,
				arrows: true,
				autoplay: true,
				speed: 750,
				autoplaySpeed : (speed ? speed : 1500)
			});
		}

		// TOGGLER
		$('.js-more-toggler').click(function() {
			if (!$(this).hasClass('opened')) {
				$(this).siblings('.visible').slideUp(__animationSpeed).siblings('.hidden').slideDown(__animationSpeed);
				$(this).addClass('opened').text('Hide');
			} else {
				$(this).siblings('.visible').slideDown(__animationSpeed).siblings('.hidden').slideUp(__animationSpeed);
				$(this).removeClass('opened').text('Show more');
			}
		});

		// FEEDBACK
		if ($('#bl-feedback-form').length) {
			// fixme
			$('#bl-feedback-form form').submit(function() {
				if (checkForm(this)) {
					$('#bl-feedback-form .form').fadeOut(__animationSpeed, function() {
						$('#bl-feedback-form .form-success').fadeIn(__animationSpeed);
					});
				}
				return false;
			});
		}

		// REGISTRATION
		if ($('#bl-registration-form').length) {
			$('#type-person').change(function() {
				if ($(this).prop('checked')) {
					$('#form-section-person').slideDown(__animationSpeed);
					$('#form-section-company').slideUp(__animationSpeed);
				}
			});
			$('#type-company').change(function() {
				if ($(this).prop('checked')) {
					$('#form-section-person').slideUp(__animationSpeed);
					$('#form-section-company').slideDown(__animationSpeed);
				}
			});
		}

	})
})(jQuery)