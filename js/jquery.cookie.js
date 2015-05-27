var yongweif={};
yongweif.cookie = yongweif.cookie || {};
yongweif.cookie._isValidKey = function(t) {
    return new RegExp('^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+$').test(t)
};
yongweif.cookie.getRaw = function(t) {
    if (yongweif.cookie._isValidKey(t)) {
        var e = new RegExp("(^| )" + t + "=([^;]*)(;|$)"),
        i = e.exec(document.cookie);
        if (i) {
            return i[2] || null
        }
    }
    return null
};
yongweif.cookie.get = function(t) {
    var e = yongweif.cookie.getRaw(t);
    if ("string" == typeof e) {
        e = decodeURIComponent(e);
        return e
    }
    return null
};
yongweif.cookie.setRaw = function(t, e, i) {
    if (!yongweif.cookie._isValidKey(t)) {
        return
    }
    i = i || {};
    var n = i.expires;
    if ("number" == typeof i.expires) {
        n = new Date;
        n.setTime(n.getTime() + i.expires)
    }
    document.cookie = t + "=" + e + (i.path ? "; path=" + i.path: "") + (n ? "; expires=" + n.toGMTString() : "") + (i.domain ? "; domain=" + i.domain: "") + (i.secure ? "; secure": "")
};
yongweif.cookie.remove = function(t, e) {
    e = e || {};
    e.expires = new Date(0);
    yongweif.cookie.setRaw(t, "", e)
};
yongweif.cookie.set = function(t, e, i) {
    yongweif.cookie.setRaw(t, encodeURIComponent(e), i)
};