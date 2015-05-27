define(function(require, exports, module) {
	var _ = require("backbone/underscore");			
	if (!t) {
		var t = {
			map: function(t, r) {
				var n = {};
				return r ? t.map(function(t, e) {
					n.index = e;
					return r.call(n, t)
				}) : t.slice()
			},
			naturalOrder: function(t, r) {
				return t < r ? -1 : t > r ? 1 : 0
			},
			sum: function(t, r) {
				var n = {};
				return t.reduce(r ?
				function(t, e, o) {
					n.index = o;
					return t + r.call(n, e)
				}: function(t, r) {
					return t + r
				},
				0)
			},
			max: function(r, n) {
				return Math.max.apply(null, n ? t.map(r, n) : r)
			}
		}
	}
	var r = function() {
		var r = 5,
		n = 8 - r,
		e = 1e3,
		o = .75;
		function i(t, n, e) {
			return (t << 2 * r) + (n << r) + e
		}
		function u(t) {
			var r = [],
			n = false;
			function e() {
				r.sort(t);
				n = true
			}
			return {
				push: function(t) {
					r.push(t);
					n = false
				},
				peek: function(t) {
					if (!n) e();
					if (t === undefined) t = r.length - 1;
					return r[t]
				},
				pop: function() {
					if (!n) e();
					return r.pop()
				},
				size: function() {
					return r.length
				},
				map: function(t) {
					return r.map(t)
				},
				debug: function() {
					if (!n) e();
					return r
				}
			}
		}
		function a(t, r, n, e, o, i, u) {
			var a = this;
			a.r1 = t;
			a.r2 = r;
			a.g1 = n;
			a.g2 = e;
			a.b1 = o;
			a.b2 = i;
			a.histo = u
		}
		a.prototype = {
			volume: function(t) {
				var r = this;
				if (!r._volume || t) {
					r._volume = (r.r2 - r.r1 + 1) * (r.g2 - r.g1 + 1) * (r.b2 - r.b1 + 1)
				}
				return r._volume
			},
			count: function(t) {
				var r = this,
				n = r.histo;
				if (!r._count_set || t) {
					var e = 0,
					o, u, a;
					for (o = r.r1; o <= r.r2; o++) {
						for (u = r.g1; u <= r.g2; u++) {
							for (a = r.b1; a <= r.b2; a++) {
								index = i(o, u, a);
								e += n[index] || 0
							}
						}
					}
					r._count = e;
					r._count_set = true
				}
				return r._count
			},
			copy: function() {
				var t = this;
				return new a(t.r1, t.r2, t.g1, t.g2, t.b1, t.b2, t.histo)
			},
			avg: function(t) {
				var n = this,
				e = n.histo;
				if (!n._avg || t) {
					var o = 0,
					u = 1 << 8 - r,
					a = 0,
					f = 0,
					c = 0,
					s, v, h, l, p;
					for (v = n.r1; v <= n.r2; v++) {
						for (h = n.g1; h <= n.g2; h++) {
							for (l = n.b1; l <= n.b2; l++) {
								p = i(v, h, l);
								s = e[p] || 0;
								o += s;
								a += s * (v + .5) * u;
								f += s * (h + .5) * u;
								c += s * (l + .5) * u
							}
						}
					}
					if (o) {
						n._avg = [~~ (a / o), ~~ (f / o), ~~ (c / o)]
					} else {
						n._avg = [~~ (u * (n.r1 + n.r2 + 1) / 2), ~~ (u * (n.g1 + n.g2 + 1) / 2), ~~ (u * (n.b1 + n.b2 + 1) / 2)]
					}
				}
				return n._avg
			},
			contains: function(t) {
				var r = this,
				e = t[0] >> n;
				gval = t[1] >> n;
				bval = t[2] >> n;
				return e >= r.r1 && e <= r.r2 && gval >= r.g1 && e <= r.g2 && bval >= r.b1 && e <= r.b2
			}
		};
		function f() {
			this.vboxes = new u(function(r, n) {
				return t.naturalOrder(r.vbox.count() * r.vbox.volume(), n.vbox.count() * n.vbox.volume())
			})
		}
		f.prototype = {
			push: function(t) {
				this.vboxes.push({
					vbox: t,
					color: t.avg()
				})
			},
			palette: function() {
				return this.vboxes.map(function(t) {
					return t.color
				})
			},
			size: function() {
				return this.vboxes.size()
			},
			map: function(t) {
				var r = this.vboxes;
				for (var n = 0; n < r.size(); n++) {
					if (r.peek(n).vbox.contains(t)) {
						return r.peek(n).color
					}
				}
				return this.nearest(t)
			},
			nearest: function(t) {
				var r = this.vboxes,
				n, e, o;
				for (var i = 0; i < r.size(); i++) {
					e = Math.sqrt(Math.pow(t[0] - r.peek(i).color[0], 2) + Math.pow(t[1] - r.peek(i).color[1], 2) + Math.pow(t[1] - r.peek(i).color[1], 2));
					if (e < n || n === undefined) {
						n = e;
						o = r.peek(i).color
					}
				}
				return o
			},
			forcebw: function() {
				var r = this.vboxes;
				r.sort(function(r, n) {
					return t.naturalOrder(t.sum(r.color), t.sum(n.color))
				});
				var n = r[0].color;
				if (n[0] < 5 && n[1] < 5 && n[2] < 5) r[0].color = [0, 0, 0];
				var e = r.length - 1,
				o = r[e].color;
				if (o[0] > 251 && o[1] > 251 && o[2] > 251) r[e].color = [255, 255, 255]
			}
		};
		function c(t) {
			var e = 1 << 3 * r,
			o = new Array(e),
			u,
			a,
			f,
			c;
			t.forEach(function(t) {
				a = t[0] >> n;
				f = t[1] >> n;
				c = t[2] >> n;
				u = i(a, f, c);
				o[u] = (o[u] || 0) + 1
			});
			return o
		}
		function s(t, r) {
			var e = 1e6,
			o = 0,
			i = 1e6,
			u = 0,
			f = 1e6,
			c = 0,
			s, v, h;
			t.forEach(function(t) {
				s = t[0] >> n;
				v = t[1] >> n;
				h = t[2] >> n;
				if (s < e) e = s;
				else if (s > o) o = s;
				if (v < i) i = v;
				else if (v > u) u = v;
				if (h < f) f = h;
				else if (h > c) c = h
			});
			return new a(e, o, i, u, f, c, r)
		}
		function v(r, n) {
			if (!n.count()) return;
			var e = n.r2 - n.r1 + 1,
			o = n.g2 - n.g1 + 1,
			u = n.b2 - n.b1 + 1,
			a = t.max([e, o, u]);
			if (n.count() == 1) {
				return [n.copy()]
			}
			var f = 0,
			c = [],
			s = [],
			v,
			h,
			l,
			p,
			g;
			if (a == e) {
				for (v = n.r1; v <= n.r2; v++) {
					p = 0;
					for (h = n.g1; h <= n.g2; h++) {
						for (l = n.b1; l <= n.b2; l++) {
							g = i(v, h, l);
							p += r[g] || 0
						}
					}
					f += p;
					c[v] = f
				}
			} else if (a == o) {
				for (v = n.g1; v <= n.g2; v++) {
					p = 0;
					for (h = n.r1; h <= n.r2; h++) {
						for (l = n.b1; l <= n.b2; l++) {
							g = i(h, v, l);
							p += r[g] || 0
						}
					}
					f += p;
					c[v] = f
				}
			} else {
				for (v = n.b1; v <= n.b2; v++) {
					p = 0;
					for (h = n.r1; h <= n.r2; h++) {
						for (l = n.g1; l <= n.g2; l++) {
							g = i(h, l, v);
							p += r[g] || 0
						}
					}
					f += p;
					c[v] = f
				}
			}
			c.forEach(function(t, r) {
				s[r] = f - t
			});
			function b(t) {
				var r = t + "1",
				e = t + "2",
				o, i, u, a, h, l = 0;
				for (v = n[r]; v <= n[e]; v++) {
					if (c[v] > f / 2) {
						u = n.copy();
						a = n.copy();
						o = v - n[r];
						i = n[e] - v;
						if (o <= i) h = Math.min(n[e] - 1, ~~ (v + i / 2));
						else h = Math.max(n[r], ~~ (v - 1 - o / 2));
						while (!c[h]) h++;
						l = s[h];
						while (!l && c[h - 1]) l = s[--h];
						u[e] = h;
						a[r] = u[e] + 1;
						return [u, a]
					}
				}
			}
			return a == e ? b("r") : a == o ? b("g") : b("b")
		}
		function h(n, i) {
			if (!n.length || i < 2 || i > 256) {
				return false
			}
			var a = c(n),
			h = 1 << 3 * r;
			var l = 0;
			a.forEach(function() {
				l++
			});
			if (l <= i) {}
			var p = s(n, a),
			g = new u(function(r, n) {
				return t.naturalOrder(r.count(), n.count())
			});
			g.push(p);
			function b(t, r) {
				var n = 1,
				o = 0,
				i;
				while (o < e) {
					i = t.pop();
					if (!i.count()) {
						t.push(i);
						o++;
						continue
					}
					var u = v(a, i),
					f = u[0],
					c = u[1];
					if (!f) {
						return
					}
					t.push(f);
					if (c) {
						t.push(c);
						n++
					}
					if (n >= r) return;
					if (o++>e) {
						return
					}
				}
			}
			b(g, o * i);
			var m = new u(function(r, n) {
				return t.naturalOrder(r.count() * r.volume(), n.count() * n.volume())
			});
			while (g.size()) {
				m.push(g.pop())
			}
			b(m, i - m.size());
			var d = new f;
			while (m.size()) {
				d.push(m.pop())
			}
			return d
		}
		return {
			quantize: h
		}
	} ();
	var n = function(t) {
		imgEl = t.jquery ? t[0] : t;
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);
		this.width = this.canvas.width = imgEl.width;
		this.height = this.canvas.height = imgEl.height;
		this.context.drawImage(imgEl, 0, 0, this.width, this.height)
	};
	n.prototype.clear = function() {
		this.context.clearRect(0, 0, this.width, this.height)
	};
	n.prototype.update = function(t) {
		this.context.putImageData(t, 0, 0)
	};
	n.prototype.getPixelCount = function() {
		return this.width * this.height
	};
	n.prototype.getImageData = function() {
		return this.context.getImageData(0, 0, this.width, this.height)
	};
	n.prototype.removeCanvas = function() {
		$(this.canvas).remove()
	};
	function e(t, e) {
		var o = new n(t),
		i = o.getImageData(),
		u = i.data,
		a = o.getPixelCount();
		var f = [];
		for (var c = 0,
		s, v, h, l, p; c < a; c++) {
			s = c * 4;
			v = u[s + 0];
			h = u[s + 1];
			l = u[s + 2];
			p = u[s + 3];
			if (p >= 125) {
				if (! (v > 250 && h > 250 && l > 250)) {
					f.push([v, h, l])
				}
			}
		}
		var g = r.quantize(f, e);
		var b = g.palette();
		o.removeCanvas();
		return b
	}
	function o(t) {
		var e = .15;
		var o = new n(t),
		i = o.getImageData(),
		u = i.data,
		a = o.getPixelCount();
		var f = [];
		var c = [];
		for (var s = 0,
		v, h, l, p, g; s < a; s++) {
			v = s * 4;
			h = u[v + 0];
			l = u[v + 1];
			p = u[v + 2];
			g = u[v + 3];
			if (g >= 125) {
				if (! (h > 250 && l > 250 && p > 250)) {
					f.push([h, l, p]);
					if (s < a * e || s % o.height < o.width * e / 2) {
						c.push([h, l, p])
					}
				}
			}
		}
		var b = r.quantize(f, 5);
		var m = b.palette();
		var d = r.quantize(c, 5);
		var x = d.palette();
		o.removeCanvas();
		return [m, x[0]]
	}
	function i(t) {
		var r = t[0],
		n = t[1],
		e = t[2];
		var o = (r * 299 + n * 587 + e * 114) / 1e3;
		return o
	}
	function u(t) {
		return t >= 128 ? [0, 0, 0] : [255, 255, 255]
	}
	function a(t, r, n) {
		var e = i(t);
		var o = [],
		a,
		f,
		c = [];
		n = n || 80;
		for (var s = 0; s < r.length; s++) {
			var v = i(r[s]);
			if (Math.abs(v - e) > n) {
				o.push(r[s]);
				c.push(v)
			}
		}
		a = o[0] ? o[0] : u(e);
		f = o[1] ? o[1] : u(e);
		return [a, f]
	}
	function f(t, r) {
		var n = i(t);
		if (r.length < 1) {}
		r.sort(function(r, n) {
			var e = (r[0] - t[0]) * (r[0] - t[0]) + (r[1] - t[1]) * (r[1] - t[1]) + (r[2] - t[2]) * (r[2] - t[2]);
			var o = (n[0] - t[0]) * (n[0] - t[0]) + (n[1] - t[1]) * (n[1] - t[1]) + (n[2] - t[2]) * (n[2] - t[2]);
			return o - e
		});
		function e(t, r) {
			var n = (t[0] - r[0]) * (t[0] - r[0]) + (t[1] - r[1]) * (t[1] - r[1]) + (t[2] - r[2]) * (t[2] - r[2]);
			return Math.sqrt(n)
		}
		return r
	}
	module.exports = {
		getColors: function(t) {
			var r = o(t);
			var n = a([51, 51, 51], [r[1]].concat(r[0]));
			return _.filter(n,
			function(t) {
				return i(t) <= 200
			})
		}
	}
});