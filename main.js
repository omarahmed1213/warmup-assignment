const fs = require("fs");

function getShiftDuration(a, b) {
    function p(c) {
        if (typeof c !== "string") return NaN;
        var d = c.trim().toLowerCase();
        var e = d.split(" ").filter(function(f) {
            return f.trim().length > 0;
        });
        if (e.length !== 2) return NaN;
        var g = e[0];
        var h = e[1];
        if (h !== "am" && h !== "pm") return NaN;
        var i = g.split(":");
        if (i.length !== 3) return NaN;
        var j = parseInt(i[0], 10);
        var k = parseInt(i[1], 10);
        var l = parseInt(i[2], 10);
        if (!Number.isFinite(j) || !Number.isFinite(k) || !Number.isFinite(l)) return NaN;
        if (j < 1 || j > 12) return NaN;
        if (k < 0 || k > 59 || l < 0 || l > 59) return NaN;
        var m = j % 12;
        if (h === "pm") m += 12;
        return m * 3600 + k * 60 + l;
    }

    function q(r) {
        var s = Math.max(0, Math.floor(r));
        var t = Math.floor(s / 3600);
        var u = s % 3600;
        var v = Math.floor(u / 60);
        var w = u % 60;
        var x = String(v);
        var y = String(w);
        if (x.length === 1) x = "0" + x;
        if (y.length === 1) y = "0" + y;
        return String(t) + ":" + x + ":" + y;
    }

    var z = p(a);
    var aa = p(b);
    if (!Number.isFinite(z) || !Number.isFinite(aa)) return "0:00:00";
    var ab = aa - z;
    if (ab < 0) ab += 24 * 3600;
    return q(ab);
}

function getIdleTime(a, b) {
    function p(c) {
        if (typeof c !== "string") return NaN;
        var d = c.trim().toLowerCase();
        var e = d.split(" ").filter(function(f) {
            return f.trim().length > 0;
        });
        if (e.length !== 2) return NaN;
        var g = e[0];
        var h = e[1];
        if (h !== "am" && h !== "pm") return NaN;
        var i = g.split(":");
        if (i.length !== 3) return NaN;
        var j = parseInt(i[0], 10);
        var k = parseInt(i[1], 10);
        var l = parseInt(i[2], 10);
        if (!Number.isFinite(j) || !Number.isFinite(k) || !Number.isFinite(l)) return NaN;
        if (j < 1 || j > 12) return NaN;
        if (k < 0 || k > 59 || l < 0 || l > 59) return NaN;
        var m = j % 12;
        if (h === "pm") m += 12;
        return m * 3600 + k * 60 + l;
    }

    function q(r) {
        var s = Math.max(0, Math.floor(r));
        var t = Math.floor(s / 3600);
        var u = s % 3600;
        var v = Math.floor(u / 60);
        var w = u % 60;
        var x = String(v);
        var y = String(w);
        if (x.length === 1) x = "0" + x;
        if (y.length === 1) y = "0" + y;
        return String(t) + ":" + x + ":" + y;
    }

    var z = p(a);
    var aa = p(b);
    if (!Number.isFinite(z) || !Number.isFinite(aa)) return "0:00:00";
    var ab = aa - z;
    if (ab < 0) ab += 24 * 3600;

    var ac = 8 * 3600;
    var ad = 22 * 3600;

    if (aa < z) return "0:00:00";

    var ae = Math.max(z, ac);
    var af = Math.min(aa, ad);
    var ag = Math.max(0, af - ae);
    var ah = Math.max(0, ab - ag);
    return q(ah);
}

function getActiveTime(a, b) {
    function p(c) {
        if (typeof c !== "string") return NaN;
        var d = c.trim().split(":");
        if (d.length !== 3) return NaN;
        var e = parseInt(d[0], 10);
        var f = parseInt(d[1], 10);
        var g = parseInt(d[2], 10);
        if (!Number.isFinite(e) || !Number.isFinite(f) || !Number.isFinite(g)) return NaN;
        if (e < 0 || f < 0 || f > 59 || g < 0 || g > 59) return NaN;
        return e * 3600 + f * 60 + g;
    }

    function q(h) {
        var i = Math.max(0, Math.floor(h));
        var j = Math.floor(i / 3600);
        var k = i % 3600;
        var l = Math.floor(k / 60);
        var m = k % 60;
        var n = String(l);
        var o = String(m);
        if (n.length === 1) n = "0" + n;
        if (o.length === 1) o = "0" + o;
        return String(j) + ":" + n + ":" + o;
    }

    var p1 = p(a);
    var p2 = p(b);
    if (!Number.isFinite(p1) || !Number.isFinite(p2)) return "0:00:00";
    return q(Math.max(0, p1 - p2));
}

function metQuota(a, b) {
    function p(c) {
        if (typeof c !== "string") return NaN;
        var d = c.trim().split(":");
        if (d.length !== 3) return NaN;
        var e = parseInt(d[0], 10);
        var f = parseInt(d[1], 10);
        var g = parseInt(d[2], 10);
        if (!Number.isFinite(e) || !Number.isFinite(f) || !Number.isFinite(g)) return NaN;
        if (e < 0 || f < 0 || f > 59 || g < 0 || g > 59) return NaN;
        return e * 3600 + f * 60 + g;
    }

    function q(h) {
        if (typeof h !== "string") return false;
        if (h.length !== 10) return false;
        if (h[4] !== "-" || h[7] !== "-") return false;
        return h >= "2025-04-10" && h <= "2025-04-30";
    }

    var r = p(b);
    if (!Number.isFinite(r)) return false;
    var s = q(a) ? 6 * 3600 : 8 * 3600 + 24 * 60;
    return r >= s;
}

function addShiftRecord(a, b) {
    if (!b || typeof b !== "object") return {};
    var c = String(b.driverID != null ? b.driverID : "").trim();
    var d = String(b.driverName != null ? b.driverName : "").trim();
    var e = String(b.date != null ? b.date : "").trim();
    var f = String(b.startTime != null ? b.startTime : "").trim();
    var g = String(b.endTime != null ? b.endTime : "").trim();
    if (!c || !d || !e || !f || !g) return {};

    var h = fs.readFileSync(a, { encoding: "utf8", flag: "r" });
    var i = [];
    var j = h.split("\n");
    for (var k = 0; k < j.length; k++) {
        if (j[k].trim().length > 0) i.push(j[k]);
    }
    if (i.length === 0) return {};
    var l = i[0];
    var m = [];
    for (var n = 1; n < i.length; n++) {
        var o = i[n].split(",");
        if (o.length < 10) continue;
        m.push({
            driverID: o[0],
            driverName: o[1],
            date: o[2],
            startTime: o[3],
            endTime: o[4],
            shiftDuration: o[5],
            idleTime: o[6],
            activeTime: o[7],
            metQuota: o[8] === "true",
            hasBonus: o[9] === "true"
        });
    }

    for (var p = 0; p < m.length; p++) {
        if (m[p].driverID === c && m[p].date === e) return {};
    }

    var q = getShiftDuration(f, g);
    var r = getIdleTime(f, g);
    var s = getActiveTime(q, r);
    var t = metQuota(e, s);

    var u = {
        driverID: c,
        driverName: d,
        date: e,
        startTime: f,
        endTime: g,
        shiftDuration: q,
        idleTime: r,
        activeTime: s,
        metQuota: t,
        hasBonus: false
    };

    m.push(u);
    m.sort(function(v, w) {
        if (v.driverID !== w.driverID) return v.driverID.localeCompare(w.driverID);
        return v.date.localeCompare(w.date);
    });

    var x = [l];
    for (var y = 0; y < m.length; y++) {
        var z = m[y];
        x.push([
            z.driverID,
            z.driverName,
            z.date,
            z.startTime,
            z.endTime,
            z.shiftDuration,
            z.idleTime,
            z.activeTime,
            String(!!z.metQuota),
            String(!!z.hasBonus)
        ].join(","));
    }
    fs.writeFileSync(a, x.join("\n") + "\n", { encoding: "utf8" });
    return u;
}

function setBonus(a, b, c, d) {
    var e = String(b != null ? b : "").trim();
    var f = String(c != null ? c : "").trim();
    var g = fs.readFileSync(a, { encoding: "utf8", flag: "r" });
    var h = [];
    var i = g.split("\n");
    for (var j = 0; j < i.length; j++) {
        if (i[j].trim().length > 0) h.push(i[j]);
    }
    if (h.length === 0) return;

    for (var k = 1; k < h.length; k++) {
        var l = h[k].split(",");
        if (l.length < 10) continue;
        if (l[0] === e && l[2] === f) {
            l[9] = String(!!d);
            h[k] = l.join(",");
            break;
        }
    }
    fs.writeFileSync(a, h.join("\n") + "\n", { encoding: "utf8" });
}

function countBonusPerMonth(a, b, c) {
    var d = String(b != null ? b : "").trim();
    var e = typeof c === "number" ? c : parseInt(String(c).trim(), 10);
    if (!Number.isFinite(e)) return -1;

    var f = fs.readFileSync(a, { encoding: "utf8", flag: "r" });
    var g = f.split("\n");

    var h = false;
    for (var i = 1; i < g.length; i++) {
        if (g[i].trim().length === 0) continue;
        var j = g[i].split(",");
        if (j.length < 10) continue;
        if (j[0] === d) {
            h = true;
            break;
        }
    }
    if (!h) return -1;

    var k = 0;
    for (var l = 1; l < g.length; l++) {
        if (g[l].trim().length === 0) continue;
        var m = g[l].split(",");
        if (m.length < 10) continue;
        if (m[0] !== d) continue;
        var n = parseInt(String(m[2]).slice(5, 7), 10);
        if (n === e && String(m[9]).trim() === "true") {
            k++;
        }
    }
    return k;
}

function getTotalActiveHoursPerMonth(a, b, c) {
    var d = String(b != null ? b : "").trim();
    var e = typeof c === "number" ? c : parseInt(String(c).trim(), 10);
    if (!Number.isFinite(e)) return "0:00:00";

    function p(f) {
        if (typeof f !== "string") return NaN;
        var g = f.trim().split(":");
        if (g.length !== 3) return NaN;
        var h = parseInt(g[0], 10);
        var i = parseInt(g[1], 10);
        var j = parseInt(g[2], 10);
        if (!Number.isFinite(h) || !Number.isFinite(i) || !Number.isFinite(j)) return NaN;
        if (h < 0 || i < 0 || i > 59 || j < 0 || j > 59) return NaN;
        return h * 3600 + i * 60 + j;
    }

    function q(k) {
        var l = Math.max(0, Math.floor(k));
        var m = Math.floor(l / 3600);
        var n = l % 3600;
        var o = Math.floor(n / 60);
        var p2 = n % 60;
        var q2 = String(o);
        var r = String(p2);
        if (q2.length === 1) q2 = "0" + q2;
        if (r.length === 1) r = "0" + r;
        return String(m) + ":" + q2 + ":" + r;
    }

    var s = fs.readFileSync(a, { encoding: "utf8", flag: "r" });
    var t = s.split("\n");
    var u = 0;
    for (var v = 1; v < t.length; v++) {
        if (t[v].trim().length === 0) continue;
        var w = t[v].split(",");
        if (w.length < 10) continue;
        if (w[0] !== d) continue;
        var x = parseInt(String(w[2]).slice(5, 7), 10);
        if (x !== e) continue;
        var y = p(w[7]);
        if (Number.isFinite(y)) u += y;
    }
    return q(u);
}

function getRequiredHoursPerMonth(a, b, c, d, e) {
    var f = String(d != null ? d : "").trim();
    var g = typeof e === "number" ? e : parseInt(String(e).trim(), 10);
    if (!Number.isFinite(g)) return "0:00:00";

    function p(h) {
        if (typeof h !== "string") return false;
        if (h.length !== 10) return false;
        if (h[4] !== "-" || h[7] !== "-") return false;
        return h >= "2025-04-10" && h <= "2025-04-30";
    }

    function q(i) {
        var j = Math.max(0, Math.floor(i));
        var k = Math.floor(j / 3600);
        var l = j % 3600;
        var m = Math.floor(l / 60);
        var n = l % 60;
        var o = String(m);
        var p2 = String(n);
        if (o.length === 1) o = "0" + o;
        if (p2.length === 1) p2 = "0" + p2;
        return String(k) + ":" + o + ":" + p2;
    }

    var r = fs.readFileSync(b, { encoding: "utf8", flag: "r" });
    var s = r.split("\n");
    var t = false;
    for (var u = 0; u < s.length; u++) {
        if (s[u].trim().length === 0) continue;
        var v = s[u].split(",");
        if (v.length < 4) continue;
        if (v[0] === f) {
            t = true;
            break;
        }
    }
    if (!t) return "0:00:00";

    var w = fs.readFileSync(a, { encoding: "utf8", flag: "r" });
    var x = w.split("\n");
    var y = 0;
    for (var z = 1; z < x.length; z++) {
        if (x[z].trim().length === 0) continue;
        var aa = x[z].split(",");
        if (aa.length < 10) continue;
        if (aa[0] !== f) continue;
        var ab = parseInt(String(aa[2]).slice(5, 7), 10);
        if (ab !== g) continue;
        y += p(aa[2]) ? 6 * 3600 : 8 * 3600 + 24 * 60;
    }

    var ac = Number.isFinite(c) ? c : 0;
    y -= Math.max(0, Math.floor(ac)) * 2 * 3600;
    if (y < 0) y = 0;
    return q(y);
}

function getNetPay(a, b, c, d) {
    var e = String(a != null ? a : "").trim();
    function p(f) {
        if (typeof f !== "string") return NaN;
        var g = f.trim().split(":");
        if (g.length !== 3) return NaN;
        var h = parseInt(g[0], 10);
        var i = parseInt(g[1], 10);
        var j = parseInt(g[2], 10);
        if (!Number.isFinite(h) || !Number.isFinite(i) || !Number.isFinite(j)) return NaN;
        if (h < 0 || i < 0 || i > 59 || j < 0 || j > 59) return NaN;
        return h * 3600 + i * 60 + j;
    }

    var k = fs.readFileSync(d, { encoding: "utf8", flag: "r" });
    var l = k.split("\n");
    var m = NaN;
    var n = NaN;
    for (var o = 0; o < l.length; o++) {
        if (l[o].trim().length === 0) continue;
        var p2 = l[o].split(",");
        if (p2.length < 4) continue;
        if (p2[0] !== e) continue;
        m = parseInt(p2[2], 10);
        n = parseInt(p2[3], 10);
        break;
    }
    if (!Number.isFinite(m) || !Number.isFinite(n)) return 0;

    var q = p(b);
    var r = p(c);
    if (!Number.isFinite(q) || !Number.isFinite(r)) return m;

    var s = Math.max(0, r - q);
    var t = Math.floor(s / 3600);

    var u = 0;
    if (n === 1) u = 50;
    else if (n === 2) u = 20;
    else if (n === 3) u = 10;
    else if (n === 4) u = 3;

    var v = Math.max(0, t - u);
    var w = Math.floor(m / 185);
    var x = v * w;
    return m - x;
}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};