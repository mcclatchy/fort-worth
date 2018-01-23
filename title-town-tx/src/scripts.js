var player, playlist;
var videos = document.querySelectorAll(".video");
var seasonSelector = document.querySelector(".season-selector");
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

  // Settings
  player.playlist.autoadvance(0);

  // Events
  player.on("play", function() {
    let plist = player.playlist();
    let info = plist[player.playlist.currentIndex()];

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
 * Thumbnail click event
 */

for(i = 0, len = videos.length; i < len; i++) {
  var v = videos[i];
  v.addEventListener("click", function() {
    let list = this.parentNode.querySelectorAll(".video");
    let index = Array.prototype.indexOf.call(list, this);

    if(index > -1) {
      player.playlist.currentItem(index);
    }

    window.parent.postMessage({
      sentinel: 'video-scroll'
    }, '*');
  });
}

/**
 * Season selector event
 */

seasonSelector.addEventListener("click", function(e) {
  let season = e.target.dataset.id;
  let playlistID = e.target.dataset.playlist;

  if(season && playlistID) {
    document.body.dataset.active = season;
    player.catalog.getPlaylist(playlistID, function(err, list) {
      player.catalog.load(list);
      player.pause();
      player.playlist.first();
    })
  }

  sendHeight();
})
