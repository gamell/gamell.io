var gamell = (function($, window){

	var worldMapRotating = false;

	var MOBILE_FALLBACK_MESSAGE = 'You are viewing a limited version of the site, please use a desktop browser to enjoy a much better experience.';
	var UNSUPPORTED_BOWSER_FALLBACK_MESSAGE = 'You are using an <strong>unsupported</strong> browser. Please <a href="http://browsehappy.com/">use a supported browser</a> - Chrome, Firefox, Safari - to improve your experience.';

	var RESUME_URL = "http://gamell.io/media/resume-joan-gamell.pdf"; 

	var SPRITE_URL = "/images/sprite.png";

	var DEFERRED_SCRIPTS = "/scripts/deferred/deferred.js";

	// devcode: !production
	var DEFERRED_SCRIPTS = ['scripts/tipsy/src/javascripts/jquery.tipsy.js',
							'bower_components/d3/d3.js', 
							'bower_components/queue-async/queue.js', 
							'bower_components/topojson/topojson.js', 
							'scripts/infographics/sunburst.js',
							'scripts/infographics/world-map.js'];
							//'scripts/infographics/timeline.js'];
	// endcode

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
		$("span.dropbox-success").tipsy($.extend({},tipsyCommonConfig,{gravity:"n", trigger:"manual"}));
		$('#resume-formal .custom-header h2 a').tipsy($.extend({},tipsyCommonConfig));
		$('#contact ul a').tipsy($.extend({},tipsyCommonConfig));

		$('.skills span.web').tipsy($.extend({},tipsyCommonConfig,{gravity:"s"}));
		$('.skills span.javascript').tipsy($.extend({},tipsyCommonConfig,{gravity:"e"}));
		$('.skills span.qc').tipsy($.extend({},tipsyCommonConfig,{gravity:"s"}));
		$('.skills span.other').tipsy($.extend({},tipsyCommonConfig,{gravity:"e"}));
		$('.skills span.project').tipsy($.extend({},tipsyCommonConfig,{gravity:"e"}));

	};

	var initQR = function(){ // function to load the images with the "rel" attribute
		//debugger;
		$("img.needs-init").each(function(i, elem){
			$(elem).attr("src", $(elem).attr("rel"));	
		});
	};

	var initGithubButton = function(){
		// locally cached to avoid dns lookup and redirections from http://ghbtns.com/github-btn.html?user=gamell&repo=gamell.io&type=fork
		$(".github-button").html('<iframe src="github-btn.html?user=gamell&repo=gamell.io&type=fork" allowtransparency="true" frameborder="0" scrolling="0" width="62" height="20"></iframe>');
	};

	var initDropboxSaver = function(){	
		$("head").append('<script type="text/javascript" src="https://www.dropbox.com/static/api/1/dropins.js" id="dropboxjs" data-app-key="e7nb3h5uznhkmq9"></script>');
		$("#resume-formal .dropbox-button").bind("click",function(){
			try{
				var options = {
				    files: [
				        {
				            'filename': "Resume Joan Gamell.pdf",
				            'url': RESUME_URL
				        }
				    ],
				    success: dropboxSaveSuccess,
				    error: function(err) { alert("There was an error while saving the file to your dropbox: "+err); }
				};

				Dropbox.save(options);
			} catch(e){
				location.href = RESUME_URL;
			}
		});
	};

	var dropboxSaveSuccess = function(){
		var $dbSuccessTooltip = $("span.dropbox-success")
		$dbSuccessTooltip.tipsy("show");
		setTimeout(function(){
			$dbSuccessTooltip.tipsy("hide");	
		}, 3000);
	};

	var displayFallbackMessage = function(){
		var $messageContainer = $(".fallback-message p");
		if($messageContainer.hasClass('mobile')){
			$messageContainer.html(MOBILE_FALLBACK_MESSAGE);
		} else {
			$messageContainer.html(UNSUPPORTED_BOWSER_FALLBACK_MESSAGE);
		}
	};

	var bindWorldMapRotation = function(){
		// setup the listener to init the world rotation
		if(window.location.hash === "#/resume-infographic-world-map" || $("body.impress-not-supported").length > 0 ){
			initWorldMapRotation();
		} else {
			$(window).on('hashchange',function(){ 
			    if(window.location.hash === "#/resume-infographic-world-map"){
			    	initWorldMapRotation();
			    	$(window).off('hashchange');	
			    }
			});
		}
	};

	var bindInitQr = function(){
		// setup the listener to init the world rotation
		if(window.location.hash === "#/resume-formal" || $("body.impress-not-supported").length > 0 ){
			initQR();
		} else {
			$(window).on('hashchange',function(){ 
			    if(window.location.hash === "#/resume-formal"){
			    	initQR();
			    	$(window).off('hashchange');	
			    }
			});
		}
	};

	var initWorldMapRotation = function(){
		if(!!worldMap && !worldMapRotating){
			worldMap.initRotation();
			worldMapRotating = true;
		}
	};

	var initDeferredScripts = function(){
		initGithubButton();
		loadDeferredScripts().done(function(){
			initTooltip();
			bindWorldMapRotation();
			bindInitQr();
			initDropboxSaver();
		});
	};

	var initSprite = function(){
		$(".sprite").css("backgroundImage", "url("+SPRITE_URL+")");
	};

	var init = function(){

		impress().init();

		displayFallbackMessage();

		$(document).ready(function(){

			setupAnimate();
			$(window).load(function(){
				initDeferredScripts();
				initSprite();
			});

		});

	};

	init();

})(jQuery, window);