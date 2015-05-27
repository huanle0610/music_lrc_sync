define(function(require) {
    seajs.use(['jplayer', 'jplayerList',"map","lrc"], function(a, b) {					   
		 var lrc_list_map = new Map();
		  var myPlaylist = new jPlayerPlaylist({
				jPlayer: "#jquery_jplayer_1"
				}, [], {
				playlistOptions: {
					enableRemoveControls: true
				},
				ready: function(event) {
				 
				},
				timeupdate: function(event) {
					time = event.jPlayer.status.currentTime;
				},
				ended:function(event){
					/*if(myPlaylist.current==myPlaylist.playlist.length-1){
						myPlaylist.play(0);  //播放第一首
					}*/
				},
				pause:function(event) {
					$("#page-song").removeClass("playing");
				},
				play: function(event) {
					$("#page-song").addClass("playing");
					//点击开始方法调用lrc.start歌词方法 返回时间time
					var lrc=myPlaylist.playlist[myPlaylist.current].lrc;
					if(lrc_list_map.get(lrc)!=null && lrc_list_map.get!=undefined){
						if(time==0) {
							$.lrc.start(lrc_list_map.get(lrc), function() {
								return time;
							});
						}
						hideNoLrcInfo(lrc);
					}else if(lrc_list_map.get(lrc)=="error"){
						showNoLrcInfo();
					}else{
						 //加载字幕;
						$.lrc.stop(); 
						$("#lrc_list").empty();
						$.ajax({
						   type: 'get',
						   url: '/lrc/'+lrc,
						   data: {},
						   success: function(results){
								lrc_list_map.put(lrc,results); 
								$.lrc.start(results, function() {
									return time;
								});
								hideNoLrcInfo(lrc);
						   },
						   error: function(results){
							   lrc_list_map.put(lrc,"error");
							   showNoLrcInfo();
						   }
						})
					}
				},
				swfPath: "/flash/", //存放jplayer.swf的决定路径
				solution:"html, flash", //规定用什么方式播放媒体优先。
				supplied: "mp3",
				smoothPlayBar: false,
				keyEnabled: true,
				audioFullScreen: true
			});
		  
			function showNoLrcInfo(){
				$("#errorLrc,.no-lrc").show();
				$("#downloadLrc").hide();
			}
			function hideNoLrcInfo(lrc){
				$("#downloadLrc").attr("href",'/lrc/'+lrc).show();
				$("#errorLrc,.no-lrc").hide();
			}
			
			myPlaylist.setPlaylist(require('data'));
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
			$("#soundBar").slider({
				animate: false , //代表在点击滑动条时滑动块的移动是否有动画效果；
				max:100,         //取值的最大和最小范围；
				min:0,
				range:false,      //是否显示范围区间，如果为false，则显示如下效果：
				value:80,
				orientation: 'auto', //水平还是垂直显示 'horizontal' 或 'vertical'.
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
