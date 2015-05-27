!
function(e) {
    var t = function(e) {
        return encodeURIComponent(e.toString())
    },
    n = "this error message come from share plugin, ",
    o = {
        host: window.location.host,
        width: "",
        height: "",
        padding: "",
        theme: "default",
        itemFadeEffect: true,
        wrapFadeEffect: true,
        evSelector: "li a",
        itemWrap: "<ul/>",
        itemTpl: '<li class="share-btn-item" id="playerpanel-share-#{name}">' + '<a  onclick="return false;" hidefocus="true" title="#{text}" class="png" name="#{name}">#{text}</a>' + "<span>#{text}</span>" + "</li>",
        shareData: [{
            name: "tsina",
            text: "新浪微博"
        },
        {
            name: "renren",
            text: "人人网"
        },
        {
            name: "qzone",
            text: "qq空间"
        },
        {
            name: "tqq",
            text: "腾讯微博"
        },
        {
            name: "douban",
            text: "豆瓣网"
        },
        {
            name: "kaixin001",
            text: "开心网"
        }]
    },
    a = function(e, n) {
        var o = n.songPicRadio || n.songPicBig || n.songPicSmall,
        a = "http://share.baidu.com/s?",
        i = "http://" + window.location.host + "/?__m=mbc.ps&__a=" + (n.songId || t(n.queryId)) + "&__o=share_" + e,
        r = ["url=" + encodeURIComponent(i), "uid=41163", "to=" + e, "type=text", "pic=" + encodeURIComponent(o), "title=" + encodeURIComponent("我在 #百度音乐盒# 听了" + n.artistName + "的一首歌《" + n.songName + "》，来听听看吧 ♪（分享自 @百度音乐）"), "desc=" + encodeURIComponent("百度音乐盒"), "sign=off", "searchPic=0", "key=", "relateUid=0"];
        a += r.join("&");
        var s = {
            tsina: "sina",
            tqq: "tengxu",
            kaixin001: "kaixin"
        };
        logCtrl && logCtrl.sendLog("click", "http://nsclick.baidu.com/v.gif", {
            otherInfo: {
                page: "bottom",
                pos: "share",
                sub: s[e] || e
            }
        });
        return window.open(a)
    },
    i = function(e, t) {
        for (var n in t) {
            if (t.hasOwnProperty(n)) {
                e = e.replace(new RegExp("#{" + n + "}", "g"), t[n])
            }
        }
        return e
    },
    r = function(e, t) {
        var n = [],
        o;
        for (o in t) {
            if (t.hasOwnProperty(o)) {
                n.push(i(e, t[o]))
            }
        }
        return n.join("")
    },
    s = function(t, i, s) {
        var c, h, f, l = false,
        u = function() {
            var e = c.shareData,
            t = c.itemTpl,
            n = c.width,
            o = c.height,
            a = c.theme,
            i = r(t, e);
            f = d(i);
            f.height(o).width(n).addClass(a)
        },
        d = function(t) {
            var n = c.itemWrap,
            o = n ? e(n) : h;
            o.html(t).addClass("clearfix").hide();
            o != h && o.appendTo(h);
            e(c.evSelector, o).each(function(t) {
                e(this).data("name", c.shareData[t].name)
            });
            return o
        },
        m = function() {
            var t = c.evSelector,
            o = c.itemFadeEffect;
            e(f).delegate(t, "click",
            function() {
                var t = c.getShareInfo(),
                o;
                try {
                    o = t.songModel
                } catch(i) {
                    throw n + 'the data of "getShareInfo" function returned missing cahnnel or song filed'
                }
                dataName = e(this).data("name");
                h.trigger("close");
                a(dataName, o)
            });
            o && e(f).delegate(t, "mouseover",
            function() {
                e(this).fadeTo(300, .7)
            });
            o && e(f).delegate(t, "mouseout",
            function() {
                e(this).fadeTo(300, 1)
            })
        },
        p = function(t, a, i) {
            t = t ? e(t) : e("body");
            a = e.extend({},
            o, a);
            h = t;
            c = a;
            if (typeof a.getShareInfo != "function" || !a.getShareInfo()) {
                throw n + 'when you init the puglin, you must give "getShareInfo" callback and make sure this callback return the shareInfo'
            }
            if (i) {
                this.init()
            }
        };
        e.extend(p.prototype, {
            init: function() {
                l = true;
                u();
                m();
                this.show()
            },
            trulyInit: function() { ! l && this.init()
            },
            show: function() {
                this.trulyInit();
                c.wrapFadeEffect ? e(f).fadeIn() : e(f).show()
            },
            hide: function() {
                this.trulyInit();
                c.wrapFadeEffect ? e(f).fadeOut() : e(f).hide()
            },
            setItemTpl: function(e) {
                typeof e == "string" && (c.itemTpl = e)
            },
            setHeight: function(e) {
                typeof e == "number" && (c.height = e)
            },
            setShareData: function(t) {
                e.isArray(t) && (c.shareData = t)
            },
            setParent: function(e) {
                e && (h = e)
            }
        });
        return new p(t, i, s)
    };
    e.fn.shareBar = function(t, n) {
        return s(e(this), n, t)
    }
} (jQuery);
define(function(e, t, n) {
    var o = "share-btn-list",
    a = '<div class="shareBarWrap" id="' + o + '"></div>';
    return {
        _render: function(e, t, n) {
            var i = ".main-panel .share";
            if (!$("#" + o).length) {
                var r = $(a).css({
                    position: "absolute",
                    width: "390px",
                    height: "82px",
                    border: "1px solid #999999",
                    "box-shadow": "0px 0px 3px #999999",
                    "border-radius": "4px",
                    background: "#FFFFFF",
                    zIndex: "300"
                }).appendTo(n || $("body"));
                var s = r.shareBar(true, {
                    getShareInfo: function() {
                        return {
                            songModel: e
                        }
                    },
                    itemFadeEffect: false,
                    theme: "default"
                });
                var c = t || $("#playPanel").find(".share");
                r.position({
                    of: c,
                    my: "left bottom",
                    at: "left top",
                    offset: "-10 -10",
                    collision: "flip flip"
                });
                setTimeout(function() {
                    $(document).on("mousemove.share",
                    function(e) {
                        var t = c.offset();
                        var n = e.clientX + 10 < t.left || e.clientX > t.left + 20 || e.clientY + 10 < t.top || e.clientY > t.top + 20 + 10;
                        if (!$(e.target).closest("#share-btn-list").length && n && !$(e.target).closest(".share").length) {
                            $(document).unbind("mousemove.share");
                            $("#share-btn-list").remove()
                        }
                    })
                },
                1);
                $("#share-btn-list").bind("close",
                function() {
                    $("#share-btn-list").remove();
                    $("document").unbind("mousemove.share");
                    $("body").unbind("click")
                })
            }
        },
        init: function(e, t, n) {
            this._render(e, t, n);
            logCtrl && logCtrl.sendLog("click", "http://nsclick.baidu.com/v.gif", {
                otherInfo: {
                    page: "bottom",
                    pos: "share",
                    sub: "button",
                    sid: e.songId,
                    artistId: e.artistId
                }
            })
        }
    }
});