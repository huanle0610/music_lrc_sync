!function(t, e) {
    var i, s = /\n|\r/,
    n = /\[[\s\S]*?\]/,
    l = /\[\d{2,}:\d{2}(?:[\.|:]\d{2,5})?\]/g,
    r = /\[\d{2,}:\d{2}(?:[\.|:]\d{2,5})?\]/,
    o = /\[offset:[+|-]?\d+?(?=\])/,
    h = "ui-lrc",
    a = "ui-lrc-sentence",
    u = "ui-lrc-current",
    c = function(t) {
        return r.test(t)
    },
    f = function(t) {
        var e = t.split(":"),
        i = e[0],
        s,
        n;
        if (e.length === 3) {
            s = e[1];
            n = e[2]
        } else {
            e = e[1].split(".");
            s = e[0];
            n = e[1]
        }
        return ~~i * 60 * 1e3 + ~~s * 1e3 + ~~n;
    };
    t.widget("ui.lrc", {
        version: "1.0.0",
        widgetEventPrefix: "lrc",
        options: {
            lrc: "",
            scrollAnimate: "",
            orientation: "vertical"
        },
        _create: function() {
            this.element.addClass(h);
            this.$ul = t("<ul>").appendTo(this.element);
            this.autoScroll = true;
            if (this.options.lrc) {
                this._parse();
                this._render()
            }
            this.element.addClass("ui-lrc-" + this.options.orientation);
            var e = this;
            if (t.fn.mousewheel) {
                this.element.mousewheel(function() {
                    if (e.autoScroll) {
                        e.autoScroll = false;
                        e.element.bind("mouseleave.lrcwheel",
                        function() {
                            e.autoScroll = true;
                            e.element.unbind("mouseleave.lrcwheel")
                        })
                    }
                })
            }
            this.element.mousedown(function() {
                if (e.autoScroll) {
                    e.autoScroll = false;
                    t(document).bind("mouseup.lrc",
                    function(i) {
                        e.autoScroll = true;
                        t(document).unbind("mouseup.lrc")
                    })
                }
            });
            this.element.bind("mouseleave.lrcup",
            function() {
                e.autoScroll = true
            })
        },
        _parse: function() {
            var e = this.options.lrc;
            if (typeof e !== "string" || !(e = t.trim(e))) {
                this._clear();
                return
            }
            if (c(e)) {
                this._parseLrc(e)
            } else {
                this._parseTxt(e)
            }
        },
        _parseLrc: function(e) {
            var n = [],
            r = 0,
            h,
            a,
            u,
            c,
            p,
            d,
            m,
            _;
            if (i = e.match(o)) {
                r = ~~i[0].slice(8)
            }
            h = e.split(s);
            for (p = 0, m = h.length; p < m; p++) {
                a = h[p];
                if (i = a.match(l)) {
                    for (d = 0, _ = i.length; d < _; d++) {
                        u = f(i[d].slice(1, -1)) + r;
                        c = t.trim(a.split(i.join("")).join(""));
                        n.push([u, c, null])
                    }
                }
            }
            if (n.length) {
                this.parsed = n.sort(function(t, e) {
                    return t[0] - e[0]
                });
                this._setStatus("lrc")
            } else {
                this._setStatus("no-lrc")
            }
        },
        _parseTxt: function(e) {
            var i = [],
            l,
            r = e.replace(n, "").split(s),
            o,
            h;
            for (o = 0, h = r.length; o < h; o++) {
                l = t.trim(r[o]);
                if (l) {
                    i.push([ - 1, l, null])
                }
            }
            if (i.length) {
                this.parsed = i;
                this._setStatus("txt-lrc")
            } else {

                this._setStatus("no-lrc")
            }
        },
        _setStatus: function(t) {
            this.element.removeClass(this.status || "lrc").addClass(t);
            this.status = t
        },
        _render: function() {
            if (!this.parsed || !this.parsed.length) {
                this._clear();
                return
            }
            var e, i, s, n;
            this.$ul.empty();
            var ll = this.parsed.length;
            for (s = 0, n = ll; s < n; s++) {
                i = this.parsed[s];
                var per = parseFloat((i[0]/this.parsed[ll-1][0])*100).toFixed(2) + '';
                e = t("<li>").addClass(a + ' per_' + per + ' line_' + s).html(i[1] || "&nbsp;").appendTo(this.$ul);
                i[2] = e
            }
            $('li.' + a).on('dblclick', '', function(){
                    var per = this.className.split(' ')[1].split('_')[1];                      $("#jquery_jplayer_1").jPlayer("playHead", per); });
            $(document).keydown(function(e){
                if (e.keyCode == 38) { 
                  $('li.ui-lrc-sentence.ui-lrc-current').prev('li').dblclick(); 
                   return false;
                }
                if (e.keyCode == 40) { 
                  $('li.ui-lrc-sentence.ui-lrc-current').next('li').dblclick(); 
                   ChangeCurrentCell();
                   return false;
                }
            });
        },
        _clear: function() {
            this.$ul.empty();
            this.$ul.append("<li>该歌曲暂时没有歌词</li>");
            this.parsed = null;
            this._setStatus("no-lrc")
        },
        _setOption: function(t, e) {
            this._super.apply(this, arguments);
            switch (t) {
            case "orientation":
                this.element.removeClass("ui-lrc-horizontal ui-lrc-vertical").addClass("ui-lrc-" + e);
                break;
            case "lrc":
                this.setLrc(e);
                break
            }
        },
        _findLine: function(t) {
            if (!this.parsed || !this.parsed.length) return - 1;
            var e = this.parsed,
            i = 0,
            s = e.length,
            n = Math.floor(s / 2);
            if (t < e[0][0]) {
                return - 1
            }
            while (! (e[n][0] <= t && t < (e[n + 1] ? e[n + 1][0] : 999999999))) {
                if (t < e[n][0]) {
                    s = n - 1
                } else {
                    i = n + 1
                }
                n = Math.floor((i + s) / 2)
            }
            return n;
        },
        setLrc: function(t) {
            this.options.lrc = t;
            this._parse();
            this._render()
        },
        scrollTo: function(t) {
            t = ~~t;
            if (!t || this.status !== "lrc") {
                return
            }
            var e = this.options.orientation === "vertical",
            i = this._findLine(t);
            if (i === -1) {
                if (this.autoScroll) {
                    if (typeof this["_animate_" + this.options.scrollAnimate] === "function") {
                        this["_animate_" + this.options.scrollAnimate](0, -1)
                    } else {
                        this.element[e ? "scrollTop": "scrollLeft"](0)
                    }
                }
                return
            }
            if (this.$curLine && this.$curLine != this.parsed[i][2]) {
                this.$curLine.removeClass(u);
                this.$curLine = null
            }
            this.$curLine = this.parsed[i][2];
            this.$curLine.addClass(u);
            if (this.autoScroll) {
                if (typeof this["_animate_" + this.options.scrollAnimate] === "function") {
                    this["_animate_" + this.options.scrollAnimate](t, i)
                } else {
                    this.element[[e ? "scrollTop": "scrollLeft"]](e ? this.$curLine.offset().top - this.$ul.offset().top - this.element.height() * .381967 + this.$curLine.outerHeight(true) * .618033 : this.$curLine.offset().left - this.$ul.offset().left - this.element.width() * .5 + this.$curLine.outerWidth(true) * .5)
                }
            }
        }
    })
} (jQuery); !
function(t, e) {
    t.widget("ui.lrc", t.ui.lrc, {
        _setOption: function(t, i) {
            this._super.apply(this, arguments);
            switch (t) {
            case "orientation":
            case "scrollAnimate":
                this.$ul.css({
                    paddingTop:
                    "",
                    paddingBottom: "",
                    paddingLeft: "",
                    paddingRight: ""
                });
                this.ani_curLineNum = e;
                this.lastMs = null;
                break
            }
        },
        setLrc: function() {
            this._super.apply(this, arguments);
            this.ani_curLineNum = e;
            this.lastMs = null
        },
        _animate_line: function(t, i) {
            var s = this.options.orientation === "vertical";
            if (i === -1 && this.ani_curLineNum === e) {
                this.element.stop(1, 0).animate(s ? {
                    scrollTop: 0
                }: {
                    scrollLeft: 0
                },
                500);
                return
            }
            var n = s ? this.$curLine.offset().top - this.$ul.offset().top - this.element.height() * .5 + this.$curLine.outerHeight(true) * .5 : this.$curLine.offset().left - this.$ul.offset().left - this.element.width() * .5 + this.$curLine.outerWidth(true) * .5;
            if (this.ani_curLineNum === e || this.ani_curLineNum != i) {
                this.element.stop(1, 0).animate(s ? {
                    scrollTop: n
                }: {
                    scrollLeft: n
                },
                500)
            }
            this.ani_curLineNum = i
        },
        _animate_uniform: function(t, e) {
            var i = this.options.orientation === "vertical",
            s = this.element[i ? "height": "width"](),
            n = this.parsed[e],
            l = this.parsed[e + 1],
            r,
            o,
            h,
            a,
            u;
            if (e === -1) {
                this.element[i ? "scrollTop": "scrollLeft"](0);
                return
            }
            this.$ul.css(i ? {
                paddingTop: s * .381967,
                paddingBottom: s * .618033,
                paddingLeft: "",
                paddingRight: ""
            }: {
                paddingTop: "",
                paddingBottom: "",
                paddingLeft: s * (1 - .618033),
                paddingRight: s * .618033
            });
            a = this.$ul.offset()[i ? "top": "left"];
            o = this.$curLine.offset()[i ? "top": "left"] - a;
            h = l ? l[2].offset()[i ? "top": "left"] - a: 0;
            r = h ? h - o: this.$curLine[i ? "outerHeight": "outerWidth"](true);
            u = o + r * (t - n[0]) / (l ? l[0] - n[0] : 999999999) - s * .381967;
            if (u >= 0) {
                this.element.stop(1, 1);
                if (this.lastMs && 0 < t - this.lastMs && t - this.lastMs < 400) {
                    this.element.stop(true, true).animate(i ? {
                        scrollTop: u
                    }: {
                        scrollLeft: u
                    },
                    t - this.lastMs, "linear")
                } else {
                    this.element[i ? "scrollTop": "scrollLeft"](u)
                }
                this.lastMs = t
            }
        }
    })
} (jQuery);
