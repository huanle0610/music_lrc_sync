define(function(require) {
	seajs.use(['jquery-ui','map'], function(a, b) {	
		seajs.use(['jplayer', 'jplayerList','lrc'], function(a, b) {
			  var $lrc=$("#lrcWrap").lrc({
				 scrollAnimate: "line"
			 });
			  var fullScreen=require("fullScreen");
			  var Backbone = require("backbone/backbone"),
				blModel=require("modelblur/CmdBlurModel");
				
				var blurModel = new blModel;
				var i = Array.prototype.slice.call($("#blur_bg").find("canvas"), 0);
				blurModel.setRenderElems(i, 1, 80);
				blurModel.on("blur",
				function() {
					setTimeout(function() {
						$("#jp_container_1").parent().css("background", "none")
					},
					1000)
				});
				
			  var myPlaylist = new jPlayerPlaylist({
					jPlayer: "#jquery_jplayer_1"
					}, [], {
					playlistOptions: {
						enableRemoveControls: true,
						height:36
					},
					ready: function(event) {
					},
					timeupdate: function(event) {
						$lrc.lrc("scrollTo", event.jPlayer.status.currentTime * 1000);
					},
					ended:function(event){
						/*if(myPlaylist.current==myPlaylist.playlist.length-1){
							myPlaylist.play(0);  //播放第一首
						}*/
					},
					pause:function(event) {
						$("#page-song").removeClass("playing");
						$(".fs-play").addClass("fs-pause");
					},
					play: function(event) {
					    $(".fs-play").removeClass("fs-pause");
						$("#page-song").addClass("playing");
						//点击开始方法调用lrc.start歌词方法 返回时间time
						var lrc=myPlaylist.playlist[myPlaylist.current].lrc;
						var src=myPlaylist.playlist[myPlaylist.current].poster;
						blurModel.set("src",src );
						$(".album-wrapper img").attr("src",src);
						$("#p-album-img").attr("src",src);
						if(lrc==""){
								$lrc.lrc("setLrc","");
								fullScreen.song.set({current:myPlaylist.current});
								showNoLrcInfo();
						}else{
							if(myPlaylist.lrcMap.get(lrc)==null || myPlaylist.lrcMap.get(lrc)==undefined){
								  $.ajax({
									   type: 'get',
									   url: '/lrc/'+lrc,
									   data: {},
									   success: function(results){
											myPlaylist.lrcMap.put(lrc,results); 
											$lrc.lrc("setLrc",myPlaylist.lrcMap.get(lrc));
											hideNoLrcInfo(lrc);
											fullScreen.song.set({current:myPlaylist.current});
									   },
									   error: function(results){
											myPlaylist.lrcMap.put(lrc,""); 
											$lrc.lrc("setLrc","");
											fullScreen.song.set({current:myPlaylist.current});
											showNoLrcInfo();
									   }
									});
							}else{
								fullScreen.song.set({current:myPlaylist.current});
								$lrc.lrc("setLrc",myPlaylist.lrcMap.get(lrc));
								hideNoLrcInfo(lrc);
							}
						}
					},
					swfPath: "/flash/", //存放jplayer.swf的决定路径
					solution:"html, flash", //规定用什么方式播放媒体优先。
					supplied: "mp3",
					smoothPlayBar: false,
					verticalVolume:true,
					keyEnabled: true,
					audioFullScreen: true
				});
			  
				function showNoLrcInfo(){
					$("#errorLrc,#lrcWrap .no-lrc").show();
					$("#downloadLrc").hide();
				}
				function hideNoLrcInfo(lrc){
					$("#downloadLrc").attr("href",'/lrc/'+lrc).show();
					$("#errorLrc,#lrcWrap .no-lrc").hide();
				}
				
				myPlaylist.setPlaylist(require('data'));
				fullScreen.myPlaylist=myPlaylist;
		        fullScreen.initialize();
		});
	});
	seajs.use(['jquery-ui'], function(a, b) {	
		$("#progreeBar").slider({
				animate: false , //代表在点击滑动条时滑动块的移动是否有动画效果；
				max:100,         //取值的最大和最小范围；
				min:0,
				range:false,      //是否显示范围区间，如果为false，则显示如下效果：
				orientation: 'auto', //水平还是垂直显示 'horizontal' 或 'vertical'.
				slide:function(event, ui) {
					//alert(ui.value);
					$("#jquery_jplayer_1").jPlayer("playHead",ui.value);  //改变MP3播放位置
				 }
			});
			$("#volSlider").slider({
				animate: false , //代表在点击滑动条时滑动块的移动是否有动画效果；
				max:100,         //取值的最大和最小范围；
				min:0,
				range:"min",      //是否显示范围区间，如果为false，则显示如下效果：
				value:80,
				orientation: 'vertical', //水平还是垂直显示 'horizontal' 或 'vertical'.
				slide:function(event, ui) {
					//alert(ui.value);
					$("#jquery_jplayer_1").jPlayer("volume",ui.value/100); //改变播放声音大小
				 }
			});
			
			$('#progreeBar a').hover(function(){
				 $(this).addClass("ui-slider-handle-hover");
			},function(){
				 $(this).removeClass("ui-slider-handle-hover");
			});
			//播放按钮
			$(".jp-play").click(function(){
				 $(this).css("display","none");
				 $(".jp-pause").css("display","block");
			});
			//暂停按钮
			$(".jp-pause").click(function(){
				 $(this).css("display","none");
				 $(".jp-play").css("display","block");
			});
			//禁音按钮
			$(".jp-mute").click(function(){
				 $(this).css("display","none");
				 $(".jp-unmute").css("display","block");
			});
			//禁音关闭按钮
			$(".jp-unmute").click(function(){
				 $(this).css("display","none");
				 $(".jp-mute").css("display","block");
			});
			
			$('.wg-button').hover(function(){
				 $(this).addClass("wg-button-hover");
			},function(){
				 $(this).removeClass("wg-button-hover");
			});
			$('.wg-button').mousedown(function(){
				 $(this).addClass("wg-button-active");
			});
			$('.wg-button').mouseup(function(){
				 $(this).removeClass("wg-button-active");
			});
			$("#playMode li a").click(function(){
				 alert("该功能正在开发中...");
			});
			$("#playTitle li a").click(function(){
				 alert("该功能正在开发中...");
			});
			
			$(".skin-web a").click(function(){
				if($("#skin-shape").is(":hidden")){
					$("#skin-shape").slideDown(200);
				}else{
					$("#skin-shape").slideUp(200);
				}
			});
			
			$('#skin-shape li').hover(function(){
				 $(this).find("div").show();
			},function(){
				 $(this).find("div").hide();
			})
			$("body").bind("mousedown",function(event){
				 if (!(event.target.id =="skin-shape"|| $(event.target).parents("#skin-shape").length>0)) {
					 $("#skin-shape").slideUp(200);
				 }
				/* if (!(event.target.id =="soundBar"|| $(event.target).parents("#soundBar").length>0)) {
					 $("#soundBar").hide();
				 }*/
			});
			
			
			$("#volumeWrap").find(".mute").bind("click",function() {
				var t = $("#volSlider").parent();
				if (t.is(":hidden")) {
					t.show();
					setTimeout(function() {
						$(document).on("click.vol",
						function(e) {
							if (e.target !== t[0] && $(e.target).closest("#volSlider").length === 0) {
								t.hide();
								$(document).off("click.vol")
							}
						})
					},
					1)
				} else {
					t.hide();
					$(document).off("click.vol")
				}
			});
			
			$('#skin-shape li').click(function(){
				 var className=$(this).find("a").attr("class");
				 var skinClass="skin-"+className;
				 var skinCss=$("#skin-css");
				 if(className=="more"){
					 return;
				 }
				 if (className !== "default") {
						if (skinCss.length > 0) {
							skinCss.attr("href", "css/" + className + ".css");
						} else {
							$("head").append('<link type="text/css" rel="stylesheet" id="skin-css" href="css/' + className + '.css"/>');
						}
				  }
				 $("body").removeClass($("body").attr("data-skin")).addClass(skinClass);
				 $("body").attr("data-skin",skinClass);
				 $("#skin-shape").slideUp(200);
			})
			$('.leftbar  div').hover(function(){
				 $(this).addClass("list-hover");
			},function(){
				 $(this).removeClass("list-hover");
			});		  
		
	});
	
	seajs.use(['jquery.cookie'], function(a, b) {
		if (!yongweif.cookie.get("vip_fv")) {
            yongweif.cookie.set("vip_fv", 1, {
                expires: 24 * 3600 * 1e3 * 36
            });
            var e = $("#vip_guide").show();
            e.on("click", ".vip_guide_close, .vip_guide_ok",
            function() {
                e.remove()
            })
        }											   
	});
	
	 seajs.use(['browser/jquery.browser.min'], function(a, b) {	
			$(function(t) {
				var e = [300, 400, 500,600],
				i = [12, 14, 16,16],
				s = [28, 30, 33,33];
				var o = false,
				n = 0;
				var a = t(".column3"),
				l = t(".column4"),
				r = t(".column2"),
				h = t(".main-wrapper"),
				c = a.find(".lrc-wrapper"),
				d = a.width();
				var u = !!(t.browser.msie && Math.floor(t.browser.version) < 7),
				f = null,
				g = null,
				p = null;
				if (u) {
					f = "margin-right";
					g = h;
					p = 2
				} else {
					f = "right";
					g = r;
					p = 1
				}
				t(".ui-resizable").bind("dragstart",
				function(t) {
					t.preventDefault();
					t.stopPropagation();
					return false
				}).bind("mousedown",
				function(e) {
					e.preventDefault();
					n = e.clientX;
					o = true;
					t(document).bind("mousemove", m).bind("mouseup", v).bind("onselectstart",
					function() {
						return false
					});
					if (this.setCapture) {
						this.setCapture()
					} else if (window.captureEvents) {
						window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
					}
				});
				var m = function(t) {
					if (o) {
						var e = t.clientX - n;
						var i = d - e;
						i = i > 600 ? 600 : i;
						i = i < 250 ? 250 : i;
						a.width(i);
						g.css(f, i + p + l.width());
						n = t.clientX;
						d = i;
						w(i)
					}
				},
				v = function() {
					if (o) {
						o = false;
						if (this.releaseCapture) {
							t(".ui-resizable")[0].releaseCapture()
						} else if (window.captureEvents) {
							window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP)
						}
						t(document).unbind("mousemove", m).unbind("mouseup", v).unbind("onselectstart");
					}
				},
				w = function(t) {
					var o = 14,
					n = 0;
					for (n = 0, len = e.length; n < len; n++) {
						if (t <= e[n]) {
							o = i[n];
							break
						}
					}
					fontFamily = n == 0 ? "": "微软雅黑";
					c.css({
						"font-size": o + "px",
						"line-height": s[n] + "px",
						"font-family": fontFamily
					})
				}
		}); 												   
	 });

});
