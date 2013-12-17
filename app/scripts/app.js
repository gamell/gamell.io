var gamell = (function($, window){

	var module = {};

	var initCompatibility = function(){};

	var browserHeight = $(window).height();
	var browserWidth = $(window).width();

	var DEFERRED_SCRIPTS = "/scripts/deferred/deferred.js";

	// devcode: !production
	var DEFERRED_SCRIPTS = ['scripts/tipsy/src/javascripts/jquery.tipsy.js',
							'bower_components/d3/d3.js', 
							'bower_components/queue-async/queue.js', 
							'bower_components/topojson/topojson.js', 
							'scripts/infographics.js'];
	// endcode

	var refreshBrowserSizes = function(){

		browserHeight = $(window).height();
		browserWidth = $(window).width();

		browserHeight -= (browserHeight%2);

		$(".auto-height .viewport").css("height", browserHeight);
		$(".auto-height").css("height", browserHeight);
		$(".auto-center").css("margin-top", (browserHeight > 700) ? ((browserHeight-700)/3) : 0 );
		// if height > 700, 
	};

	var setupAnimate = function(){
	$('.animate').textillate({
		  // the default selector to use when detecting multiple texts to animate
		  selector: '.texts',
		  // enable looping
		  loop: false,
		  // sets the minimum display time for each text before it is replaced
		  minDisplayTime: 2000,
		  // sets the initial delay before starting the animation
		  // (note that depending on the in effect you may need to manually apply 
		  // visibility: hidden to the element before running this plugin)
		  initialDelay: 0,
		  // set whether or not to automatically start animating
		  autoStart: true,

		  // in animation settings
		  in: {
		    // set the effect name
		    effect: 'fadeInDownBig',
		    // set the delay factor applied to each consecutive character
		    delayScale: 2,
		    // set the delay between each character
		    delay: 70,
		    // set to true to animate all the characters at the same time
		    sync: false,
		    // randomize the character sequence 
		    // (note that shuffle doesn't make sense with sync = true)
		    shuffle: true
		  }
		});
	};

	var loadDeferredScript = function(deferredPromise, index){
		if(index < DEFERRED_SCRIPTS.length){
			$.getScript(DEFERRED_SCRIPTS[index]).done(function(){
				loadDeferredScript(deferredPromise, index+1);
			});
		} else {
			deferredPromise.resolve("hurray");
		}
	}

	var loadDeferredScripts = function(){
		if(DEFERRED_SCRIPTS instanceof Array){
			var deferredPromise = new jQuery.Deferred();
			loadDeferredScript(deferredPromise,0);
			return deferredPromise.promise();
		} else {
			return $.getScript(DEFERRED_SCRIPTS);
		}
		
	};

	var initTooltip = function(){

		var tipsyCommonConfig = {html: true, fade: true};
		$('#resume-formal h3.skills').tipsy($.extend({},tipsyCommonConfig,{gravity:"e", trigger:"manual"}));

		$('.skills span.web').tipsy($.extend({},tipsyCommonConfig,{gravity:"s"}));
		$('.skills span.javascript').tipsy($.extend({},tipsyCommonConfig,{gravity:"e"}));
		$('.skills span.qc').tipsy($.extend({},tipsyCommonConfig,{gravity:"s"}));
		$('.skills span.other').tipsy($.extend({},tipsyCommonConfig,{gravity:"e"}));
		$('.skills span.project').tipsy($.extend({},tipsyCommonConfig,{gravity:"e"}));

	};

	var initDeferredScripts = function(){
		loadDeferredScripts().done(function(){
			initTooltip();
		});
	};

	var init = function(){

		impress().init();

		$(document).ready(function(){

			setupAnimate();
			refreshBrowserSizes(); // bind on window resize handler
			$(window).resize(refreshBrowserSizes);	
			$(window).load(function(){
				initDeferredScripts();
			});

		});

	};

	init();

	module.refreshBrowserSizes = refreshBrowserSizes;
	return module;

})(jQuery, window);