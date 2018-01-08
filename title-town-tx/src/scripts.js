function sendHeight() {
  window.parent.postMessage({
    sentinel: 'amp',
    type: 'embed-size',
    height: document.body.scrollHeight
  }, '*');
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

window.addEventListener('load', sendHeight);
window.addEventListener('resize', debounce(sendHeight, 200)); 

/*
 * Brightcove manual implementation for Omniture integration
 */

var player;

videojs("mainPlayer").ready(function() {
  player = this;
});

function swapVideo(id) {
  player.catalog.getVideo(id, function(err, video) {
    player.catalog.load(video);
  });
}

/*
 * Add the event
 */

var videos = document.querySelectorAll(".video");
for(i = 0, len = videos.length; i < len; i++) {
  var v = videos[i];
  v.addEventListener("click", function() {
    swapVideo(this.dataset.id);

    window.parent.postMessage({
      sentinel: 'video-scroll'
    }, '*');
  });
}

/**
 * Season selector event
 */

var seasonSelector = document.querySelector(".seasons");
seasonSelector.addEventListener("click", function(e) {
  season = e.target.dataset.id;
  if(season) {
    // swap selector
    seasonSelector.dataset.active = season;

    // swap playlist
    document.querySelector(".playlists").dataset.active = season;

    // swap to first video
    swapVideo(document.querySelector(`.playlist[data-id=${season}]`).querySelector('.video').dataset.id);

    // resend the new height
    sendHeight();
  };
})
