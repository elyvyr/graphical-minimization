var rows = [{ n: "", a: "", b: "", r: "" }, { n: "", a: "", b: "", r: "" }];
var cost = { a: "", b: "" };
function fmt(v) { var r = Math.round(v * 100) / 100; if (r === 0) r = 0; return r.toLocaleString("en-US") }
function peso(v) { return "₱" + fmt(v) }
function drawInputs() {
    var h = "<tr><th>Service</th><th>(x)</th><th>(y)</th><th>Min. required</th></tr>";
    rows.forEach(function (q, i) { h += "<tr><td><input class='n' style='width:190px' placeholder='Service name' value='" + esc(q.n) + "' oninput='rows[" + i + "].n=this.value'></td><td><input type='number' placeholder='0' value='" + q.a + "' oninput='rows[" + i + "].a=this.value'></td><td><input type='number' placeholder='0' value='" + q.b + "' oninput='rows[" + i + "].b=this.value'></td><td><input type='number' placeholder='0' value='" + q.r + "' oninput='rows[" + i + "].r=this.value'></td></tr>" });
    h += "<tr><th>Cost</th><td><input type='number' placeholder='0' value='" + cost.a + "' oninput='cost.a=this.value'></td><td><input type='number' placeholder='0' value='" + cost.b + "' oninput='cost.b=this.value'></td><td>—</td></tr>";
    inp.innerHTML = h;
}
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;") }
function addRow() { rows.push({ n: "", a: "", b: "", r: "" }); drawInputs() }
function delRow() { if (rows.length > 1) { rows.pop(); drawInputs() } }

function ln(t) { return "<div class='f'>" + t + "</div>" }
function sol(q) {
    var a = fmt(q.a), b = fmt(q.b), r = fmt(q.r), h = "<div class='cols' style='margin:6px 0'>";
    h += "<div>" + ln("<b>x = 0</b>");
    if (q.b) { h += ln(a + "(0) + " + b + "y = " + r) + ln(b + "y = " + r) + ln("y = " + r + " ÷ " + b) + ln("<b>y = " + fmt(q.r / q.b) + "</b>") + ln("(0, " + fmt(q.r / q.b) + ")") } else h += ln("no y-intercept");
    h += "</div><div>" + ln("<b>y = 0</b>");
    if (q.a) { h += ln(a + "x + " + b + "(0) = " + r) + ln(a + "x = " + r) + ln("x = " + r + " ÷ " + a) + ln("<b>x = " + fmt(q.r / q.a) + "</b>") + ln("(" + fmt(q.r / q.a) + ", 0)") } else h += ln("no x-intercept");
    return h + "</div></div>";
}
function solve() {
    var A = "A", B = "B", cost = { a: parseFloat(window.cost.a) || 0, b: parseFloat(window.cost.b) || 0 }, cs = rows.map(function (q, i) { return { n: q.n || ("Service " + (i + 1)), a: parseFloat(q.a) || 0, b: parseFloat(q.b) || 0, r: parseFloat(q.r) || 0 } }).filter(function (q) { return q.a > 0 || q.b > 0 });
    if (!cs.length) { out.innerHTML = "<p class='err'>Fill in the given values first (coefficients, minimum required and cost), then press Solve.</p>"; return }
    var s = "";
    // Step 1 setup
    s += "<p class='sub'><b>" + (ttl.value ? "Example: " + esc(ttl.value) : "Solution") + "</b></p><h2>Step 1 – Define the table</h2><div class='scroll'><table><tr><th>Services</th><th>" + esc(A) + "<br>x</th><th>" + esc(B) + "<br>y</th><th>Min. required</th></tr>";
    cs.forEach(function (q) { s += "<tr><td>" + esc(q.n) + "</td><td>" + fmt(q.a) + "x</td><td>" + fmt(q.b) + "y</td><td>" + fmt(q.r) + "</td></tr>" });
    s += "<tr><th>Cost</th><td>" + peso(cost.a) + "x</td><td>" + peso(cost.b) + "y</td><td>—</td></tr></table></div>";
    // Step 2
    var obj = peso(cost.a) + "x + " + peso(cost.b) + "y";
    s += "<h2>Step 2 – Objective function and constraints</h2><div class='box'><div class='f'><b>Objective Function</b></div><div class='f'>Min C = " + obj + "</div><div class='f' style='margin-top:8px'><b>Subject to:</b></div>";
    cs.forEach(function (q) { s += "<div class='f'>" + fmt(q.a) + "x + " + fmt(q.b) + "y ≥ " + fmt(q.r) + "</div>" });
    s += "<div class='f'>x ≥ 0, y ≥ 0</div></div>";
    // Step 3 intercepts
    s += "<h2>Step 3 – Intercepts of each constraint</h2><div class='cols'>";
    cs.forEach(function (q) {
        s += "<div class='box'><div class='f'><b>" + fmt(q.a) + "x + " + fmt(q.b) + "y = " + fmt(q.r) + "</b></div>" + sol(q) + "<table><tr><th>x</th><th>y</th></tr>";
        s += "<tr><td>0</td><td>" + (q.b ? fmt(q.r / q.b) : "none") + "</td></tr><tr><td>" + (q.a ? fmt(q.r / q.a) : "none") + "</td><td>0</td></tr></table></div>"
    });
    s += "</div>";
    // Step 4 test (0,0)
    s += "<h2>Step 4 – Test point (0, 0)</h2><div class='scroll'><table><tr><th>Constraint</th><th>Substitute</th><th>True / False</th><th>Shade</th></tr>";
    cs.forEach(function (q) { var t = 0 >= q.r; s += "<tr><td>" + fmt(q.a) + "x + " + fmt(q.b) + "y ≥ " + fmt(q.r) + "</td><td>0 ≥ " + fmt(q.r) + "</td><td>" + (t ? "True" : "False") + "</td><td>" + (t ? "toward the origin" : "away from the origin") + "</td></tr>" });
    s += "</table></div>";
    // geometry
    var L = cs.map(function (q) { return { a: q.a, b: q.b, r: q.r } });
    var mx = 0; cs.forEach(function (q) { if (q.a) mx = Math.max(mx, q.r / q.a); if (q.b) mx = Math.max(mx, q.r / q.b) });
    mx = Math.max(mx * 1.25, 1);
    var all = L.concat([{ a: 1, b: 0, r: 0 }, { a: 0, b: 1, r: 0 }, { a: 1, b: 0, r: mx }, { a: 0, b: 1, r: mx }]);
    function feas(p) { if (p.x < -1e-9 || p.y < -1e-9 || p.x > mx + 1e-9 || p.y > mx + 1e-9) return false; return L.every(function (q) { return q.a * p.x + q.b * p.y >= q.r - 1e-9 }) }
    var pts = [];
    for (var i = 0; i < all.length; i++)for (var j = i + 1; j < all.length; j++) {
        var d = all[i].a * all[j].b - all[j].a * all[i].b; if (Math.abs(d) < 1e-12) continue;
        var x = (all[i].r * all[j].b - all[j].r * all[i].b) / d, y = (all[i].a * all[j].r - all[j].a * all[i].r) / d, p = { x: x, y: y };
        if (feas(p) && !pts.some(function (o) { return Math.abs(o.x - x) < 1e-7 && Math.abs(o.y - y) < 1e-7 })) pts.push(p)
    }
    var corners = pts.filter(function (p) { return p.x < mx - 1e-7 && p.y < mx - 1e-7 }).sort(function (p, q) { return p.x - q.x });
    if (!corners.length) { out.innerHTML = s + "<p class='err'>No feasible solution.</p>"; return }
    // Step 5
    s += "<h2>Step 5 – Feasible solutions (corner points)</h2><div class='scroll'><table><tr><th>#</th><th>(x, y)</th></tr>";
    corners.forEach(function (p, i) { s += "<tr><td>" + (i + 1) + ")</td><td>(" + fmt(p.x) + ", " + fmt(p.y) + ")</td></tr>" });
    s += "</table></div>";
    // Step 6
    var best = 0, cv = corners.map(function (p) { return cost.a * p.x + cost.b * p.y });
    cv.forEach(function (v, i) { if (v < cv[best]) best = i });
    s += "<h2>Step 6 – Compute the cost</h2><div class='scroll'><table><tr><th>(x, y)</th><th>C = " + peso(cost.a) + "x + " + peso(cost.b) + "y</th><th>Total cost</th></tr>";
    corners.forEach(function (p, i) { s += "<tr" + (i == best ? " class='best'" : "") + "><td>(" + fmt(p.x) + ", " + fmt(p.y) + ")</td><td>" + fmt(cost.a) + "(" + fmt(p.x) + ") + " + fmt(cost.b) + "(" + fmt(p.y) + ")</td><td>" + peso(cv[i]) + "</td></tr>" });
    s += "</table></div>";
    // Graph
    var W = 640, H = 420, m = 44, sc = Math.min((W - 2 * m) / mx, (H - 2 * m) / mx), ox = m, oy = H - m;
    function X(v) { return ox + v * sc } function Y(v) { return oy - v * sc }
    var g = "<svg viewBox='0 0 " + W + " " + H + "' role='img' aria-label='Graph of constraints and feasible region'>";
    var step = Math.max(1, Math.ceil(mx / 8));
    for (var t = 0; t <= mx; t += step) { g += "<line x1='" + X(t) + "' y1='" + Y(0) + "' x2='" + X(t) + "' y2='" + Y(mx) + "' stroke='currentColor' opacity='.1'/><line x1='" + X(0) + "' y1='" + Y(t) + "' x2='" + X(mx) + "' y2='" + Y(t) + "' stroke='currentColor' opacity='.1'/><text x='" + X(t) + "' y='" + (oy + 16) + "' font-size='11' text-anchor='middle' fill='currentColor'>" + t + "</text><text x='" + (ox - 8) + "' y='" + (Y(t) + 4) + "' font-size='11' text-anchor='end' fill='currentColor'>" + t + "</text>" }
    var cx = pts.reduce(function (a, p) { return a + p.x }, 0) / pts.length, cy = pts.reduce(function (a, p) { return a + p.y }, 0) / pts.length;
    var poly = pts.slice().sort(function (p, q) { return Math.atan2(p.y - cy, p.x - cx) - Math.atan2(q.y - cy, q.x - cx) });
    g += "<polygon points='" + poly.map(function (p) { return X(p.x) + "," + Y(p.y) }).join(" ") + "' fill='#4a8bff' opacity='.28'/>";
    g += "<line x1='" + X(0) + "' y1='" + Y(0) + "' x2='" + X(mx) + "' y2='" + Y(0) + "' stroke='currentColor'/><line x1='" + X(0) + "' y1='" + Y(0) + "' x2='" + X(0) + "' y2='" + Y(mx) + "' stroke='currentColor'/>";
    var cl = ["#e67e22", "#2e8b57", "#c0392b", "#8e44ad", "#16a0b8", "#a0791f"];
    cs.forEach(function (q, i) {
        var P = [];
        [[0, q.b ? q.r / q.b : null], [mx, q.b ? (q.r - q.a * mx) / q.b : null], [q.a ? q.r / q.a : null, 0], [q.a ? (q.r - q.b * mx) / q.a : null, mx]].forEach(function (p) { if (p[0] !== null && p[1] !== null && p[0] >= -1e-9 && p[1] >= -1e-9 && p[0] <= mx + 1e-9 && p[1] <= mx + 1e-9) P.push(p) });
        if (P.length >= 2) g += "<line x1='" + X(P[0][0]) + "' y1='" + Y(P[0][1]) + "' x2='" + X(P[1][0]) + "' y2='" + Y(P[1][1]) + "' stroke='" + cl[i % 6] + "' stroke-width='2'/><text x='" + (X(P[1][0]) - 4) + "' y='" + (Y(P[1][1]) + (P[1][1] >= mx - 1e-6 ? 14 : -6)) + "' font-size='11' fill='" + cl[i % 6] + "' text-anchor='end'>" + fmt(q.a) + "x+" + fmt(q.b) + "y≥" + fmt(q.r) + "</text>"
    });
    corners.forEach(function (p, i) { g += "<circle cx='" + X(p.x) + "' cy='" + Y(p.y) + "' r='5' fill='" + (i == best ? "#1e9e4a" : "#d62d2d") + "'/><text x='" + (X(p.x) + 8) + "' y='" + (Y(p.y) - 8) + "' font-size='11' fill='currentColor'>(" + fmt(p.x) + ", " + fmt(p.y) + ")</text>" });
    g += "<text x='" + (W - m) + "' y='" + (oy - 6) + "' font-size='12' fill='currentColor' text-anchor='end'>x</text><text x='" + (ox + 8) + "' y='" + (m - 8) + "' font-size='12' fill='currentColor'>y</text></svg>";
    s += "<h2>Graph (shaded = feasible region, green = optimal)</h2>" + g;
    // Interpret
    var b = corners[best];
    s += "<h2>Interpretation</h2><div class='ans'>The company should purchase <b>" + fmt(b.x) + " " + esc(A) + "</b> and <b>" + fmt(b.y) + " " + esc(B) + "</b> to satisfy the minimum requirements at the lowest possible cost of <b>" + peso(cv[best]) + "</b>.</div>";
    out.innerHTML = s.split("<h2>").map(function (p, i) { return i ? "<section class='card'><h2>" + p + "</section>" : p }).join("");
}
drawInputs(); out.innerHTML = "<p class='sub'>Fill in the given values above, then press Solve.</p>";
