define(function(require, exports, module) {
    var t = function() {
        var e = ["", "webkit", "moz", "ms"],
        l = ["fullScreen", "fullscreen"];
        for (var t = 0,
        n = e.length; t < n; t++) {
            for (var s = 0,
            i = l.length; s < i; s++) if (document[e[t] + l[s] + "Enabled"]) {
                return true
            }
        }
        return false
    } ();
	var T={};
	T.browser = T.browser || {};
    T.browser.ie = T.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? document.documentMode || +RegExp["$1"] : undefined;
	var Backbone = require("backbone/backbone"),
    _ = require("backbone/underscore"),
	blModel=require("modelblur/CmdBlurModel"),
	color_thief=require("modelblur/Cmdcolor-thief");
	module.exports = {
		isFullScreen: false,
        $elem: $("#FS-container"),
        $lrc: $("#FS-lrc-wrap").lrc({
            scrollAnimate: "line"
        }),
		song:null,
		myPlaylist:null,
		//curSong: listCtrl.get("playlist").getCurSong(),
        fs_global_color_selector: "#FS-container",
        fs_hilight_color_selector: "#FS-lrc-wrap .ui-lrc-current",
        initialize: function() {
            this._lastSong = null;
           /* listCtrl.on("change:songLink",
            function(e, l) {
                this.curSong = l;
                this.onSongChange(l)
            },
            this);
		   */
		   /*
            this.blurModel = new e({
                overlayColor: "rgba(0,0,0,0.1)"
            });
            this.blurModel.set("offsetPercentage", 0);
            var l = T.browser.ie ? .3 : 1;
            this.blurModel.setRenderElems(this.$elem.find("canvas"), 1, 80);*/
			var th=this;
			
			var SongInfo = Backbone.Model.extend({
				defaults: {
					current: null
				}
			});	
			th.song=new SongInfo();
			th.song.on('change:current', function(model, value) {
				th.onSongChange();
			});
			
			/*$("#jquery_jplayer_1").bind($.jPlayer.event.play, function(event) { 
				th.song.set({downloadLrc:th.myPlaylist.options.playlistOptions.lrc});
			}); */
			
			th.blurModel = new blModel({
					overlayColor: "rgba(0,0,0,0.1)"
			});
			th.blurModel.set("offsetPercentage", 0);
			var l = T.browser.ie ? .3 : 1;
			th.blurModel.setRenderElems(th.$elem.find("canvas"), 1, 80);
			
            this._initFullScreen();
            this._initButtonEvent();
				
				
			$("#jquery_jplayer_1").bind($.jPlayer.event.timeupdate, function(event) { // Add a listener 
					th.$lrc.lrc("scrollTo",event.jPlayer.status.currentTime * 1000);
			}); 
			
            /*if (player) {
                player.setEventListener(player.EVENTS.POSITIONCHANGE, _.bind(function(e) {
                    if (this.isFullScreen) {
                        this.$lrc.lrc("scrollTo", e.position)
                    }
                },
                this));
                player.setEventListener(player.EVENTS.STATECHANGE, _.bind(function(e) {
                    var l = e.newState === "play" || e.newState === "buffering" || e.newState === "pre-buffer";
                    this.$elem.find(".fs-play")[l ? "removeClass": "addClass"]("fs-pause")
                },
                this))
            }
            boxCtrl.on("change:curSongStatus",
            function(e, l) {
                this.$elem.find(".fs-favor")[l ? "addClass": "removeClass"]("fs-favor-active")
            },
            this)*/
        },
        _initFullScreen: function() {
            var e = this;
            $("#req-full-screen, #opt-popup .full-screen").click(function() {
                var l = e.$elem[0];
                if (l.webkitRequestFullScreen) {
                    l.webkitRequestFullScreen()
                } else if (l.mozRequestFullScreen) {
                    l.mozRequestFullScreen()
                } else if (l.msRequestFullscreen) {
                    l.msRequestFullscreen()
                } else if (l.requestFullScreen) {
                    l.requestFullScreen()
                } else {
                    e.requestFullScreen()
                }
               /* logCtrl.sendLog("click", "http://nsclick.baidu.com/v.gif", {
                    otherInfo: {
                        page: "tingbox",
                        sub: "full-screen",
                        pos: "bottom"
                    }
                })*/
            });
            $("#exit-full-screen").click(function() {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen()
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                } else if (document.mozExitFullScreen) {
                    document.mozExitFullScreen()
                }else if(document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				}else {
                    e.cancelFullScreen()
                }
            });
            if (!t) {
                $(document).on("keyup",
                function(l) {
                    if (l.keyCode === 27 && e.isFullScreen) {
                        e.cancelFullScreen()
                    }
                })
            }
            document.onfullscreenchange = document.onmsfullscreenchange = document.onmozfullscreenchange = document.onwebkitfullscreenchange = function() {
                if (document.webkitIsFullScreen || document.mozFullScreenElement || document.isFullScreen || document.fullScreenElement || document.msFullscreenElement) {
                    e.requestFullScreen()
                } else {
                    e.cancelFullScreen()
                }
            };
            $("#FS-song-cover, #fs-play-ctrl").hover(function() {
                $("#fs-play-ctrl").show()
            },
            function() {
                $("#fs-play-ctrl").hide()
            })
        },
        _initButtonEvent: function() {
			var l = this;
		    this.$elem.find(".fs-prev").click(function() {
                l.myPlaylist.previous()
            });
            this.$elem.find(".fs-next").click(function() {
                l.myPlaylist.next()
            });
			 this.$elem.find(".fs-play").click(function() {
				if($(this).hasClass("fs-pause")){
				   $("#jquery_jplayer_1").jPlayer("play");
				}else{
				   $("#jquery_jplayer_1").jPlayer("pause");
				}
            });
          /*  var e = listCtrl.get("playlist"),
            l = this;
            this.$elem.find(".fs-favor").click(function() {
                var e = $(this);
                boxCtrl.collectCurSong(!e.hasClass("fs-favor-active"))
            });
            this.$elem.find(".fs-prev").click(function() {
                e.prev()
            });
            this.$elem.find(".fs-next").click(function() {
                e.next()
            });
            this.$elem.find(".fs-play").click(function() {
                player[$(this).hasClass("fs-pause") ? "play": "pause"]()
            });
            this.$elem.find(".fs-share").bind("hover",
            function() {
                var e = $(this);
                require(["asyncmodules/share"],
                function(t) {
                    t.init(l.curSong, e, "#FS-container")
                })
            })*/
        },
        requestFullScreen: function() {
            if (T.browser.ie) {
                this.$elem.show()
            } else {
                this.$elem.fadeIn(1e3)
            }
            this.isFullScreen = true;
           /* setTimeout(_.bind(function() {
                this.onSongChange(this.curSong)
            },
            this), 100)*/
		   this.onSongChange();
		   
        },
        cancelFullScreen: function() {
            if (T.browser.ie) {
                this.$elem.hide()
            } else {
                this.$elem.fadeOut(1e3)
            }
            this.isFullScreen = false;
            if (document.webkitIsFullScreen || document.mozIsFullScreen || document.isFullScreen) { (document.webkitCancelFullScreen || document.cancelFullScreen || doucment.mozCancelFullScreen)()
            }
        },
        onSongChange: function(e) {
			//console.log(window.fywPlayList.current)
			var t = this;
			
			var lrc=this.myPlaylist.playlist[this.myPlaylist.current].lrc;
			if(lrc==""){
				 t.$lrc.lrc("setLrc","");
			}else{
				if(t.myPlaylist.lrcMap.get(lrc)==null || t.myPlaylist.lrcMap.get(lrc)==undefined){
					$.ajax({
					   type: 'get',
					   url: 'http://www.fanyongwei.com/play/lrc/'+lrc,
					   data: {},
					   success: function(results){
							t.myPlaylist.lrcMap.put(lrc,results); 
							t.$lrc.lrc("setLrc",myPlaylist.lrcMap.get(lrc));
					   },
					   error: function(results){
							t.myPlaylist.lrcMap.put(lrc,""); 
							t.myPlaylist.lrcMap.put(lrc,"");
					   }
					});
				}else{
						t.$lrc.lrc("setLrc",t.myPlaylist.lrcMap.get(lrc));
				}
			}
			
			
           /* if (e && this.isFullScreen && e != this._lastSong) {
                this.$elem.find("img").attr("src", e.songPicRadio || "//mu9.bdstatic.com/player/t/i/KHU9zw6z.png");
                this.$elem.find(".fs-album").text(e.songName || "--");
                this.$elem.find(".fs-artist").text(e.artistName || "--");
                this.$elem.find(".fs-favor")[e.hasCollected ? "addClass": "removeClass"]("fs-favor-active");
                var t = this;
                SongDataModel.fetchSongLrcContent(e, {
                    success: function(e) {
                        t.$lrc.lrc("setLrc", e.lrcContent)
                    },
                    error: function() {
                        t.$lrc.lrc("setLrc", "")
                    }
                });
                var n = e.songPicRadio;
                if (this.blurModel._testSupport()) {
                    this.blurModel._loadImage(n,
                    function(e) {
                        t._createAlbumColorCss(l.getColors(e))
                    });
                    this.blurModel.set("src", n)
                }
                this._lastSong = e
            }*/
			//alert(this.isFullScreen);
			if (this.isFullScreen) {
				this.$elem.find(".fs-album").text(t.myPlaylist.playlist[t.myPlaylist.current].title || "--");
				this.$elem.find(".fs-artist").text(t.myPlaylist.playlist[t.myPlaylist.current].artist || "--");
             /*   this.$elem.find("img").attr("src", e.songPicRadio || "//mu9.bdstatic.com/player/t/i/KHU9zw6z.png");
                this.$elem.find(".fs-album").text(e.songName || "--");
                this.$elem.find(".fs-artist").text(e.artistName || "--");
                this.$elem.find(".fs-favor")[e.hasCollected ? "addClass": "removeClass"]("fs-favor-active");
                var t = this;
                SongDataModel.fetchSongLrcContent(e, {
                    success: function(e) {
                        t.$lrc.lrc("setLrc", e.lrcContent)
                    },
                    error: function() {
                        t.$lrc.lrc("setLrc", "")
                    }
                });*/
               // var n = "http://www.fanyongwei.com/play/baijin/images/KHU9zw6z.png";
			   var n = this.myPlaylist.playlist[this.myPlaylist.current].poster;
			   $("#FS-song-cover img").attr("src",n);
                if (this.blurModel._testSupport()) {
                    this.blurModel._loadImage(n,
                    function(e) {
						t._createAlbumColorCss(color_thief.getColors(e));
                       
                    });
                    this.blurModel.set("src", n)
                }
            }
        },
        _createAlbumColorCss: function(e) {
            var l = $("<style type='text/css' rel='stylesheet' />").appendTo($("head"));
            var t = [];
            if (e.length) {
                t.push(this.fs_global_color_selector, "{ color : rgb(" + e[0].join(",") + ")}");
            }
            if (l[0].styleSheet) {
                l[0].styleSheet.cssText = t.join(" ");
            } else {
                l[0].appendChild(document.createTextNode(t.join(" ")));
            }
            if (this.$style) {
                this.$style.remove();
            }
            this.$style = l;
        }
		
	}
});