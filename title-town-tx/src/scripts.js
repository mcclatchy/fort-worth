var player;
var videos = document.querySelectorAll(".video");
var seasons = document.querySelector(".seasons");
var playlists = document.querySelector(".playlists");
var vAnalytics = new mistats.VideoPlayer();

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

function swapVideo(id) {
  player.catalog.getVideo(id, function(err, video) {
    player.catalog.load(video);
  });
}

/**
 * Generic resize events
 */

window.addEventListener('load', sendHeight);
window.addEventListener('resize', debounce(sendHeight, 200)); 

/*
 * Brightcove manual implementation for Omniture integration
 */

videojs("mainPlayer").ready(function() {
  player = this;
  player.on("play", function() {
    let info = player.mediainfo;
    let payload = {
      title: info.name,
      duration: info.duration,
      vgrapher: info.customFields.byline1,
      pageName: 'Title Town, TX'
    }

    vAnalytics.start(payload);
  });
});

/*
 * Add the event
 */

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

seasons.addEventListener("click", function(e) {
  season = e.target.dataset.id;
  if(season) {
    // swap selector
    this.dataset.active = season;

    // swap playlist
    playlists.dataset.active = season;

    // swap to first video
    let playlist = document.querySelector(`.playlist[data-id=${season}]`);
    let video = playlist.querySelector(".video");
    if(video) {
      swapVideo(video.dataset.id);
    }

    // resend the new height
    sendHeight();
  };
})
