define(function() {
    var t = window.cancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame ||
    function(t) {
        clearTimeout(t)
    };
    var e = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(t) {
        return setTimeout(t, 30)
    };
    var i = function(t, e) {
        var i = new Uint8Array(t);
        var a = new Uint8Array(e, 0, Math.min(t.byteLength, e.byteLength));
        i.set(a)
    };
	var T={};
	T.browser = T.browser || {};
    T.browser.ie = T.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? document.documentMode || +RegExp["$1"] : undefined;
    var a = true;
    var r = Backbone.Model.extend({
        defaults: {
            scale: 4,
            overlayColor: "rgba(0, 0, 0, 0.15)",
            offsetPercentage: .1,
            imageSmoothing: true,
            src: ""
        },
        canvasElems: [],
        radius: 200,
        ratio: 1,
        initialize: function() {
            this.radius /= this.get("scale");
            this.radius = Math.max(this.radius >> 0, 8);
            var t = this;
            if (this._testSupport()) {
                this.on("change:src",
                function(e, i) {
                    this._loadImage(i,
                    function(e) {
                        t.image = e;
                        t._resizeCanvas(t.getBufferCanvas());
                        t._renderBlur();
                        t._scheduledBlur = false
                    })
                },
                this)
            }
        },
        _testSupport: function() {
            return document.createElement("canvas").getContext && T.browser.ie !== 9
        },
        getCanvas: function() {
            return this.canvas
        },
        setCanvas: function(t) {
            this.canvas = t
        },
        setRenderElems: function(t, e, i) {
            this.canvasElems = t;
            this.renderOpacity = e;
            if (i) {
                this.radius = i / this.get("scale");
                this.radius = Math.max(this.radius >> 0, 8)
            }
        },
        _resizeCanvas: function(t) {
            t.width = $(t).width();
            t.height = $(t).height();
            if (!this.$blur) {
                this.$blur = document.createElement("canvas")
            }
            this.$blur.width = Math.ceil(t.width / this.get("scale"));
            this.$blur.height = Math.ceil(t.height / this.get("scale"))
        },
        _loadImage: function(t, e) {
            var i = new Image,
            a = this;
            i.onload = function() {
                e(this);
                if (this._xhrload) {
                    URL.revokeObjectURL(this.src)
                }
            };
            i.crossOrigin = "";
            var r = /^(http|https)?\:\/\//.test(t) && t.indexOf(window.location.host) < 0;
            var s = T.browser.ie >= 10 || /(msie\s|trident.*rv:)([\w.]+)/.test(navigator.userAgent.toLowerCase());
            if (s && r && window.URL) {
                var n = new XMLHttpRequest;
                n.onload = function() {
                    i.src = URL.createObjectURL(this.response);
                    i._xhrload = true
                };
                n.onerror = function() {};
                n.abort = function() {};
                n.open("GET", t, true);
                n.responseType = "blob";
                n.send(null)
            } else {
                i.src = t
            }
            return i
        },
        _renderBlur: function() {
            var i = this.$blur.getContext("2d");
            var a = this.$blur.width;
            var r = this.$blur.height;
            this._renderImage(i, a, r);
            if (!this._scheduledBlur) {
                this._scheduledBlur = true;
                this._animationId !== undefined && t(this._animationId);
                var s = this;
                this._animationId = e(function() {
                    s._blurImage(i, a, r)
                })
            }
        },
        _renderImage: function(t, e, i) {
            var a = this.get("offsetPercentage") > 0 ? this.image.width * this.get("offsetPercentage") : 0;
            var r = a * 2;
            var s, n, h, o, u, l;
            if (e > i) {
                u = i / e;
                l = this.image.width / this.image.height;
                o = (this.image.height - r) * u * l;
                h = this.image.width - r;
                n = this.image.height / 2 - o / 2;
                s = a
            } else {
                u = e / i;
                l = this.image.height / this.image.width;
                h = (this.image.width - r) * u * l;
                if (h > this.image.width) {
                    h = this.image.width - r;
                    o = (this.image.height - r) * u / l;
                    n = this.image.height / 2 - o / 2;
                    s = a
                } else {
                    o = this.image.height - r;
                    s = this.image.width / 2 - h / 2;
                    n = a
                }
            }
            t.drawImage(this.image, s, n, h, o, 0, 0, e, i)
        },
        _blurImage: function(t, e, i) {
            var r = t.getImageData(0, 0, e, i);
            var s = r.data;
            var n = {
                operation: "blur",
                w: e,
                h: i,
                r: this.radius * this.ratio
            };
            if (!T.browser.ie) {
                n.buf = s.buffer;
                n.end = a
            } else {
                n.pix = s
            }
            if (!this.worker) {
                var h = "http://www.fanyongwei.com/play/js/modelblur/imagesBlur.js";
               /* if (typeof _GET_HASHMAP !== "undefined") {
                    h = _GET_HASHMAP(h);
                    h = h.indexOf("http://") == 0 || h.indexOf("//") === 0 ? "/" + h.split("/").slice(3).join("/") : h
                }*/
                this.worker = new Worker(h);
                this.worker.onmessage = _.bind(function(t) {
                    this._onWorkDone(t.data, this.renderOpacity || 1)
                },
                this)
            }
            this.worker.postMessage(n)
        },
        _onWorkDone: function(t, e) {
            if (t.err) {
                console.oog("_blurImage error!")
            }
            var a = this.$blur.getContext("2d"),
            r = this.$blur.width,
            s = this.$blur.height;
            e = e || 1;
            var n = a.createImageData(r, s);
            if ("buf" in t && e === 1) {
                i(n.data.buffer, t.buf)
            } else {
                var h = n.data;
                var o = t.pix || new Uint8Array(t.buf);
                var u, l, d;
                for (l = 0; l < s; l++) {
                    for (u = 0; u < r; u++) {
                        d = (l * r + u) * 4;
                        h[d] = Math.min(255, o[d] / e - 1);
                        h[d + 1] = Math.min(255, o[d + 1] / e - 1);
                        h[d + 2] = Math.min(255, o[d + 2] / e - 1);
                        h[d + 3] = 255 * e
                    }
                }
            }
            a.putImageData(n, 0, 0);
            this._draw(a, r, s, this.ratio)
        },
        _draw: function(t, e, i, a) {
            var r = this.get("overlayColor");
            if (r) {
                t.fillStyle = r;
                t.fillRect(0, 0, e, i)
            }
            if (this.get("overlayGradient")) {
                var s = i - Math.ceil(i / 4);
                var n = t.createLinearGradient(0, s, 0, i);
                n.addColorStop(0, "rgba(0, 0, 0, 0)");
                n.addColorStop(1, "rgba(0, 0, 0, 0.5)");
                t.rect(0, 0, e, i);
                t.fillStyle = n;
                t.fill()
            }
            t = this.getBufferCanvas().getContext("2d");
            var h = +new Date;
            t.drawImage(this.$blur, 0, 0, e * this.get("scale") / a, i * this.get("scale") / a);
            this._changeCanvas();
            this.trigger("blur")
        },
        _changeCanvas: function() {
            var t = this;
            $(this.canvas).removeClass("visible");
            this.canvas = this.getBufferCanvas();
            $(this.canvas).addClass("visible")
        },
        getBufferCanvas: function() {
            var t = _.indexOf(this.canvasElems, this.canvas);
            t = (t + 1) % this.canvasElems.length;
            return this.canvasElems[t]
        }
    });
    return r
});