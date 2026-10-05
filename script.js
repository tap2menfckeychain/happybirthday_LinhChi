/* Thiệp sinh nhật — phần xử lý. Nội dung nằm trong data.js */
(function () {
  "use strict";

  const D = window.THIEP || {};
  const T = D.tiec || {};
  const $ = (id) => document.getElementById(id);

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { /* trình duyệt chặn lưu trữ: bỏ qua */ }
    return null;
  }

  /* ---------- Ngày giờ ---------- */
  const THU = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const pad = (n) => (n < 10 ? "0" : "") + n;
  function tach(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(s || "");
    return m ? { y: +m[1], mo: +m[2], d: +m[3], h: +(m[4] || 0), mi: +(m[5] || 0) } : null;
  }
  const ngay = (p) => pad(p.d) + "." + pad(p.mo) + "." + p.y;
  const ngayNgan = (p) => pad(p.d) + "." + pad(p.mo);
  const gio = (p) => pad(p.h) + ":" + pad(p.mi);
  const thu = (p) => THU[new Date(Date.UTC(p.y, p.mo - 1, p.d)).getUTCDay()];

  const pStart = tach(T.batDau);
  const pBirth = tach(D.ngaySinh);
  const start = new Date(T.batDau);
  const end = new Date(T.ketThuc || T.batDau);

  /* ---------- Gắn chữ chung ---------- */
  document.querySelectorAll('[data-bind="ten"]').forEach((e) => (e.textContent = D.ten));
  document.querySelectorAll('[data-bind="tuoi"]').forEach((e) => (e.textContent = D.tuoi));
  document.title = D.ten + " " + D.tuoi + " tuổi 🎂";
  $("big13").textContent = D.tuoi;
  document.querySelector(".l-13").textContent = D.tuoi;
  if (pStart) {
    $("heroDate").textContent = ngay(pStart);
    document.querySelectorAll(".party-date").forEach((e, i) => (e.textContent = i === 0 ? ngay(pStart) : ngayNgan(pStart)));
  }
  if (pBirth) $("heroBirth").textContent = ngay(pBirth);

  /* ---------- Thiệp mời ---------- */
  $("inviteMsg").textContent = D.loiMoi || "";
  if (pStart) {
    $("fDate").textContent = thu(pStart) + ", " + ngay(pStart);
    $("fTime").textContent = gio(pStart);
  }
  $("fPlace").textContent = T.nhaHang || "";
  $("fAddr").textContent = T.diaChi || "";

  const timBanDo = T.timTrenBanDo || (T.nhaHang + " " + (T.diaChi || ""));
  $("btnMap").href = T.linkBanDo || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(timBanDo);
  $("mapFrame").src = "https://maps.google.com/maps?q=" + encodeURIComponent(timBanDo) + "&z=16&output=embed";

  const fmtCal = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  $("btnCal").href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent("Sinh nhật " + D.tuoi + " tuổi của " + D.ten + " 🎂") +
    "&dates=" + fmtCal(start) + "/" + fmtCal(end) +
    "&details=" + encodeURIComponent((D.loiMoi || "") + "\n\n" + location.href.split("#")[0]) +
    "&location=" + encodeURIComponent(T.nhaHang + ", " + (T.diaChi || ""));

  const LH = D.lienHe || {};
  if (LH.zalo || LH.soDienThoai) {
    const rsvp = $("btnRsvp");
    rsvp.href = LH.zalo ? "https://zalo.me/" + LH.zalo.replace(/\s+/g, "") : "tel:" + LH.soDienThoai.replace(/\s+/g, "");
    rsvp.hidden = false;
    const c = $("contact");
    c.textContent = "Liên hệ" + (LH.ten ? ": " + LH.ten : "") + " · " + (LH.soDienThoai || LH.zalo);
    c.hidden = false;
  }

  const Z = D.nhomZalo || {};
  if (Z.link) {
    $("zaloBtn").href = Z.link;
    $("zaloName").textContent = Z.ten ? "Nhóm: " + Z.ten : "";
    if (Z.qr) $("zaloQr").src = Z.qr;
    else document.querySelector(".zalo-qr").hidden = true;
    $("zaloCard").hidden = false;
    $("footZaloLink").href = Z.link;
    $("footZalo").hidden = false;
  }

  $("btnShare").addEventListener("click", async () => {
    const data = { title: document.title, text: "Thiệp mời sinh nhật " + D.tuoi + " tuổi của " + D.ten, url: location.href.split("#")[0] };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(data.url);
      toast("Đã sao chép link thiệp! 💌");
    } catch (e) {
      if (!e || e.name !== "AbortError") toast("Hãy sao chép link trên thanh địa chỉ nhé!");
    }
  });

  /* ---------- Lịch trình ---------- */
  function renderTimeline(root, items, timeOf) {
    root.textContent = "";
    (items || []).forEach((it) => {
      const li = el("li", "tl-item" + (it.moi ? " fresh" : ""));
      const card = el("div", "tl-card");
      card.append(el("span", "tl-ico", it.icon || "✨"));
      const body = el("div");
      const time = timeOf(it);
      if (time) body.append(el("div", "tl-time", time));
      const h = el("h4", "tl-title", it.tieuDe || "");
      if (it.nhan) h.append(el("span", "tag", it.nhan));
      body.append(h);
      if (it.moTa) body.append(el("p", "tl-desc", it.moTa));
      const g = photoGrid(it);
      if (g) body.append(g);
      if (it.ten) body.append(el("span", "tl-by", "— " + it.ten));
      card.append(body);
      li.append(card);
      root.append(li);
      it.moi = false;
    });
  }
  renderTimeline($("timeline"), D.lichTrinh, (it) => (it.den ? it.tu + " – " + it.den : "Từ " + it.tu));
  $("afterGirls").textContent = (D.sau21h || {}).banNu || "";
  $("afterBoys").textContent = (D.sau21h || {}).banNam || "";

  /* ---------- Đếm ngược ---------- */
  function tick() {
    const now = Date.now();
    if (now < start) {
      let s = Math.floor((start - now) / 1000);
      $("cdD").textContent = Math.floor(s / 86400); s %= 86400;
      $("cdH").textContent = pad(Math.floor(s / 3600)); s %= 3600;
      $("cdM").textContent = pad(Math.floor(s / 60));
      $("cdS").textContent = pad(s % 60);
      return true;
    }
    $("countdown").classList.add("done");
    $("cdMsg").textContent = now < end ? "🎉 Bữa tiệc đang diễn ra!" : "Cảm ơn mọi người đã đến chung vui cùng " + D.ten + " 💖";
    return false;
  }
  if (tick()) {
    const timer = setInterval(() => { if (!tick()) clearInterval(timer); }, 1000);
  }

  /* ---------- Album ảnh ---------- */
  const GRADS = [
    "linear-gradient(150deg,#ffe3ec,#efe4ff)",
    "linear-gradient(150deg,#fff1d6,#ffe3ec)",
    "linear-gradient(150deg,#e3f4ec,#efe4ff)",
    "linear-gradient(150deg,#efe4ff,#ffe9f0)",
    "linear-gradient(150deg,#ffe9d9,#fff6c9)"
  ];
  const ROT = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.6deg", ".8deg"];

  function placeholder(i) {
    const ph = el("div", "ph");
    ph.style.setProperty("--g", GRADS[i % GRADS.length]);
    ph.append(el("span", null, "📷"), el("span", null, "Ảnh sắp có"));
    return ph;
  }

  function renderGallery(root, list, emptyState) {
    root.textContent = "";
    const items = (list || []).map((x) => (typeof x === "string" ? { src: x } : x));
    if (!items.length) { root.append(emptyState()); return; }
    const grid = el("div", "gallery");
    items.forEach((it, i) => {
      const fig = el("figure", "polaroid");
      fig.style.setProperty("--r", ROT[i % ROT.length]);
      const frame = el("button", "frame");
      frame.type = "button";
      const ratio = el("div", "ratio");   // khung 4:5 cố định, ảnh được cắt vừa khung
      frame.append(ratio);
      if (it.src) {
        const img = new Image();
        img.loading = "lazy";
        img.decoding = "async";
        img.alt = it.chuThich || "Ảnh " + (i + 1);
        img.onload = () => img.classList.add("loaded");
        img.onerror = () => { it.loi = true; ratio.replaceChild(placeholder(i), img); frame.disabled = true; };
        img.src = it.src;
        ratio.append(img);
        frame.setAttribute("aria-label", "Xem ảnh lớn: " + img.alt);
        frame.addEventListener("click", () => openLightbox(items, i));
      } else {
        ratio.append(placeholder(i));
        frame.disabled = true;
      }
      fig.append(frame);
      if (it.chuThich) fig.append(el("figcaption", null, it.chuThich));
      grid.append(fig);
    });
    root.append(grid);
  }

  renderGallery($("galleryRecent"), D.anhGanDay, () => {
    const box = el("div", "empty");
    box.append(el("h3", null, "Album đang được cập nhật"), el("p", null, "Quay lại sau để xem ảnh của " + D.ten + " nhé!"));
    return box;
  });

  renderGallery($("galleryParty"), D.anhTiec, () => {
    const box = el("div", "empty");
    const strip = el("div", "strip");
    ["😆", "🥳", "😘"].forEach((e) => strip.append(el("span", null, e)));
    box.append(
      strip,
      el("h3", null, "Ảnh tiệc sẽ được cập nhật sau"),
      el("p", null, "Những tấm ảnh trong buổi tối " + (pStart ? ngay(pStart) : "") + " và ảnh photo booth sẽ có ở đây. Nhớ quay lại xem nhé! 📸")
    );
    return box;
  });

  /* ---------- Lightbox ---------- */
  const lb = $("lightbox");
  let lbItems = [], lbIdx = 0, lastFocus = null;
  const bigSrc = (it) => it.lon || it.src;
  function showLb() {
    const it = lbItems[lbIdx];
    const img = $("lbImg");
    img.src = it.src;              // hiện ngay ảnh nhỏ đã tải sẵn…
    const full = new Image();      // …rồi thay bằng ảnh lớn khi tải xong
    full.onload = () => { if (lbItems[lbIdx] === it) img.src = full.src; };
    full.src = bigSrc(it);
    img.alt = it.chuThich || "";
    $("lbCap").textContent = it.chuThich || "";
    const many = lbItems.length > 1;
    $("lbPrev").hidden = !many;
    $("lbNext").hidden = !many;
    $("lbCount").textContent = many ? lbIdx + 1 + " / " + lbItems.length : "";
    if (many) [1, -1].forEach((d) => { new Image().src = bigSrc(lbItems[(lbIdx + d + lbItems.length) % lbItems.length]); });
  }
  function openLightbox(items, i) {
    lbItems = items.filter((x) => x.src && !x.loi);
    lbIdx = Math.max(0, lbItems.indexOf(items[i]));
    if (!lbItems.length) return;
    lastFocus = document.activeElement;
    showLb();
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    $("lbClose").focus();
  }
  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  const step = (d) => { lbIdx = (lbIdx + d + lbItems.length) % lbItems.length; showLb(); };
  $("lbClose").addEventListener("click", closeLb);
  $("lbPrev").addEventListener("click", () => step(-1));
  $("lbNext").addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });
  let touchX = null;
  lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50 && lbItems.length > 1) step(dx < 0 ? 1 : -1);
    touchX = null;
  });

  /* ---------- Kho lưu trữ Google Sheet (Apps Script) ----------
     Một link duy nhất lưu cả lời chúc, thành tích và kỷ niệm. */
  const API = String(D.apiGoogleSheet || D.apiLoiChuc || "").trim();
  const remote = { loiChuc: [], thanhTich: [], kyNiem: [] };   // đã lưu trên Google Sheet
  const mine = { loiChuc: [], thanhTich: [], kyNiem: [] };     // vừa gửi, hiện ngay trong lúc chờ tải lại
  let loadState = API ? "loading" : "off";
  let lastLoad = 0;
  let backendMoi = true;   // false khi Apps Script còn bản cũ (chỉ lưu được lời chúc)
  let backendAnh = true;   // false khi Apps Script chưa có phần lưu ảnh

  function fmtTime(t) {
    const d = new Date(t);
    if (isNaN(d)) return "";
    return pad(d.getDate()) + "." + pad(d.getMonth() + 1) + " · " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }
  const sameItem = (a, b) => a.ten === b.ten && (a.loiNhan || a.tieuDe) === (b.loiNhan || b.tieuDe);
  function withFresh(loai) {
    // mục mình vừa gửi: giữ ảnh xem trước trên máy cho tới khi Drive xử lý xong ảnh
    const rem = remote[loai].map((o) => {
      const m = mine[loai].filter((x) => sameItem(x, o))[0];
      return m && m.anhLocal ? Object.assign({}, o, { anhLocal: m.anhLocal }) : o;
    });
    return mine[loai].filter((m) => !remote[loai].some((o) => sameItem(o, m))).concat(rem);
  }

  async function loadAll(force) {
    if (!API) { renderAll(); return; }
    if (!force && Date.now() - lastLoad < 30000) return;
    lastLoad = Date.now();
    loadState = "loading";
    renderNotes();
    try {
      const r = await fetch(API + (API.indexOf("?") < 0 ? "?" : "&") + "t=" + Date.now(), { cache: "no-store" });
      const j = (await r.json()) || {};
      remote.loiChuc = j.loiChuc || j.list || [];
      remote.thanhTich = j.thanhTich || [];
      remote.kyNiem = j.kyNiem || [];
      backendMoi = Array.isArray(j.thanhTich);
      backendAnh = j.coAnh === true;
      loadState = "ok";
    } catch (e) {
      loadState = remote.loiChuc.length ? "ok" : "error";
    }
    updateAddWarn();
    renderAll();
  }

  async function guiLen(loai, payload) {
    // gửi dạng text/plain để trình duyệt không chặn (không cần "preflight")
    const r = await fetch(API, { method: "POST", body: JSON.stringify(Object.assign({ loai: loai }, payload)) });
    let j = null;
    try { j = await r.json(); } catch (err) { /* vẫn coi là đã gửi */ }
    if (j && j.ok === false) throw new Error(j.error || "loi");
    return j || {};
  }

  /* Ảnh của thành tích / kỷ niệm (lưu trên Google Drive) */
  const driveUrl = (id, w) => "https://drive.google.com/thumbnail?id=" + encodeURIComponent(id) + "&sz=w" + w;
  const driveUrl2 = (id, w) => "https://lh3.googleusercontent.com/d/" + encodeURIComponent(id) + "=w" + w;
  function itemPhotos(it) {
    if (it.anhLocal && it.anhLocal.length) return it.anhLocal.map((d) => ({ src: d, lon: d }));
    return (it.anh || [])
      .filter((id) => /^[\w-]{10,}$/.test(id))
      .map((id) => ({ id: id, src: driveUrl(id, 800), lon: driveUrl(id, 1600) }));
  }
  function photoGrid(it) {
    const list = itemPhotos(it).slice(0, 3);
    if (!list.length) return null;
    const grid = el("div", "item-photos n" + list.length);
    list.forEach((p, i) => {
      p.chuThich = it.tieuDe || "";
      const b = el("button");
      b.type = "button";
      b.setAttribute("aria-label", "Xem ảnh lớn" + (it.tieuDe ? ": " + it.tieuDe : ""));
      const img = new Image();
      img.loading = "lazy";
      img.alt = it.tieuDe || "Ảnh";
      img.onerror = () => {
        if (p.id && !p.thuLai) {          // thử đường dẫn ảnh thứ hai của Google
          p.thuLai = true;
          p.src = driveUrl2(p.id, 800);
          p.lon = driveUrl2(p.id, 1600);
          img.src = p.src;
        } else {
          p.loi = true;
          if (img.parentNode) img.parentNode.removeChild(img);
          b.append(el("span", "ph-wait", "Ảnh đang được xử lý…"));
        }
      };
      img.src = p.src;
      b.append(img);
      b.addEventListener("click", () => openLightbox(list, i));
      grid.append(b);
    });
    return grid;
  }

  function renderAll() { renderNotes(); renderAchieve(); renderMemories(); }

  /* ---------- Lời chúc ---------- */
  const MAU = { hong: "#ffd6e2", tim: "#e6dbff", vang: "#ffefb8", la: "#d4f1e2", xanh: "#d6e8ff", cam: "#ffdfcc" };
  const MAU_KEYS = Object.keys(MAU);
  const NOTE_ROT = ["-1.5deg", "1.2deg", "-.6deg", "1.8deg", "-1deg", ".6deg"];
  const pinned = (D.loiChuc || []).filter((m) => m && m.loiNhan).map((m) => ({ ten: m.ten, loiNhan: m.loiNhan, mau: m.mau, ghim: true }));

  function renderNotes() {
    const root = $("notes");
    root.textContent = "";
    const friendsList = withFresh("loiChuc");
    const list = pinned.concat(friendsList);
    list.forEach((m, i) => {
      const n = el("figure", "note" + (m.moi ? " fresh" : ""));
      const key = MAU[m.mau] ? m.mau : MAU_KEYS[i % MAU_KEYS.length];
      n.style.setProperty("--bg", MAU[key]);
      n.style.setProperty("--r", NOTE_ROT[i % NOTE_ROT.length]);
      if (m.ghim) n.append(el("span", "pin", "📌"));
      n.append(el("p", null, m.loiNhan));
      const foot = el("div", "note-foot");
      if (m.t) foot.append(el("time", null, fmtTime(m.t)));
      foot.append(el("span", "script", "— " + (m.ten || "Một người bạn")));
      n.append(foot);
      root.append(n);
      m.moi = false;
    });
    const friends = friendsList.length;
    $("notesCount").textContent = friends ? "(" + friends + ")" : "";

    if (loadState === "loading" && !friends) {
      root.append(el("p", "notes-status", "Đang tải lời chúc… 💌"));
    } else if (loadState === "error") {
      const p = el("p", "notes-status", "Chưa tải được bảng lời chúc — kiểm tra mạng rồi thử lại nhé.");
      const retry = el("button", "btn btn-ghost", "Thử lại");
      retry.type = "button";
      retry.addEventListener("click", () => loadAll(true));
      p.append(el("br"), retry);
      root.append(p);
    } else if (!friends) {
      root.append(el("p", "notes-status", "Chưa có lời chúc nào từ các bạn — hãy là người đầu tiên nhé! ✨"));
    }
  }

  const form = $("wishForm");
  const wName = $("wName");
  const wMsg = $("wMsg");
  const wStatus = $("wStatus");
  const wSubmit = $("wSubmit");
  if (!API) $("wishWarn").hidden = false;
  wName.value = store("thiep-ten") || "";
  const updateCount = () => { $("wCount").textContent = wMsg.value.length + "/500"; };
  wMsg.addEventListener("input", updateCount);

  function setStatus(msg, kind) {
    wStatus.textContent = msg;
    wStatus.className = "wish-status" + (kind ? " " + kind : "");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ten = wName.value.trim();
    const loiNhan = wMsg.value.trim();
    const checked = form.querySelector('input[name="mau"]:checked');
    const mau = checked ? checked.value : "hong";
    if (form.website.value) return; // ô bẫy chống spam
    if (!ten) { setStatus("Bạn nhớ ghi tên nhé!", "err"); wName.focus(); return; }
    if (!loiNhan) { setStatus("Bạn chưa viết lời chúc nè!", "err"); wMsg.focus(); return; }
    if (!API) { setStatus("Kho lưu trữ chưa được kết nối nên chưa gửi được.", "err"); return; }

    wSubmit.disabled = true;
    wSubmit.textContent = "Đang gửi…";
    setStatus("");
    try {
      await guiLen("loiChuc", { ten: ten, loiNhan: loiNhan, mau: mau });
      mine.loiChuc.unshift({ ten: ten, loiNhan: loiNhan, mau: mau, t: new Date().toISOString(), moi: true });
      store("thiep-ten", ten);
      wMsg.value = "";
      updateCount();
      setStatus("Đã gửi! Cảm ơn bạn đã chúc mừng " + D.ten + " 💖", "ok");
      renderNotes();
      boom(false);
      setTimeout(() => loadAll(true), 4000);
    } catch (err) {
      setStatus("Gửi chưa được 😢 Kiểm tra mạng rồi bấm gửi lại nhé.", "err");
    } finally {
      wSubmit.disabled = false;
      wSubmit.textContent = "Gửi lời chúc 💌";
    }
  });

  /* ---------- Tuổi 13 ---------- */
  const stats = $("stats");
  const birth = new Date(D.ngaySinh + "T00:00:00+07:00");
  const days = Math.floor((Date.now() - birth) / 86400000);
  [
    [String(D.tuoi), "tuổi rực rỡ"],
    [days.toLocaleString("vi-VN"), "ngày đáng yêu"],
    [D.cungHoangDao || "", "cung hoàng đạo"],
    [D.conGiap || "", pBirth ? "sinh " + thu(pBirth) + ", " + ngay(pBirth) : "năm sinh"]
  ].forEach((x) => {
    if (!x[0]) return;
    const s = el("div", "stat");
    s.append(el("b", null, x[0]), el("span", null, x[1]));
    stats.append(s);
  });

  const pinnedAch = (D.thanhTich || []).filter((a) => a && a.tieuDe);
  function renderAchieve() {
    const root = $("achieve");
    root.textContent = "";
    const list = pinnedAch.concat(withFresh("thanhTich"));
    list.forEach((a) => {
      const c = el("div", "ach" + (a.moi ? " fresh" : ""));
      c.append(el("div", "ach-ico", a.icon || "🌟"), el("h4", null, a.tieuDe || ""));
      if (a.moTa) c.append(el("p", null, a.moTa));
      const g = photoGrid(a);
      if (g) c.append(g);
      if (a.ten) c.append(el("span", "ach-by", "— " + a.ten));
      root.append(c);
      a.moi = false;
    });
    if (!list.length) {
      root.append(el("p", "ach-empty", loadState === "loading"
        ? "Đang tải… 🏅"
        : "Chưa có thành tích nào được thêm — bạn biết " + D.ten + " giỏi gì? Bấm “Thêm thành tích” nhé! 🏅"));
    }
  }
  function renderMemories() {
    renderTimeline($("memories"), (D.kyNiem || []).concat(withFresh("kyNiem")), (it) => it.thoiGian || "");
  }

  /* ---------- Khách tự thêm thành tích / kỷ niệm ---------- */
  const ICONS = {
    thanhTich: ["🏆", "🏅", "🎖️", "📚", "🎨", "🎹", "⚽", "🏊", "💃", "🌟"],
    kyNiem: ["💭", "✈️", "🎒", "🏕️", "🎂", "🎉", "🐱", "📸", "💖", "🌈"]
  };
  const addForm = $("addForm");
  const aDesc = $("aDesc");
  let addMode = "thanhTich";
  $("aName").value = store("thiep-ten") || "";

  function setAStatus(msg, kind) {
    $("aStatus").textContent = msg;
    $("aStatus").className = "wish-status" + (kind ? " " + kind : "");
  }
  const updateACount = () => { $("aCount").textContent = aDesc.value.length + "/" + aDesc.maxLength; };
  aDesc.addEventListener("input", updateACount);

  function updateAddWarn() {
    const w = $("addWarn");
    if (!API) w.textContent = "Kho lưu trữ chưa được kết nối nên chưa lưu được. (Xem HUONG-DAN.txt, mục 4.)";
    else if (loadState === "ok" && (!backendMoi || !backendAnh)) w.textContent = "Cần cập nhật đoạn code Apps Script mới để lưu được thành tích, kỷ niệm và ảnh. (Xem HUONG-DAN.txt, mục 4 — phần Cập nhật.)";
    else w.textContent = "";
    w.hidden = !w.textContent;
  }

  function setMode(m) {
    addMode = m;
    addForm.querySelector('input[name="loai"][value="' + m + '"]').checked = true;
    const tt = m === "thanhTich";
    $("aWhenField").hidden = tt;
    $("aTitleLabel").textContent = tt ? "Thành tích" : "Tiêu đề kỷ niệm";
    $("aTitle").placeholder = tt ? "Ví dụ: Giải Nhì vẽ tranh cấp trường" : "Ví dụ: Lần đầu đi cắm trại cùng lớp";
    $("aDescLabel").textContent = tt ? "Mô tả thêm" : "Kể ngắn";
    aDesc.maxLength = tt ? 300 : 400;
    aDesc.placeholder = tt ? "Không bắt buộc" : "Chuyện gì đã xảy ra? (không bắt buộc)";
    updateACount();
    const box = $("aIcons");
    box.textContent = "";
    ICONS[m].forEach((ic, i) => {
      const lab = el("label");
      const inp = el("input");
      inp.type = "radio";
      inp.name = "icon";
      inp.value = ic;
      inp.setAttribute("aria-label", ic);
      inp.checked = i === 0;
      lab.append(inp, el("span", null, ic));
      box.append(lab);
    });
  }
  addForm.querySelectorAll('input[name="loai"]').forEach((r) => r.addEventListener("change", () => setMode(r.value)));
  document.querySelectorAll("[data-add]").forEach((b) =>
    b.addEventListener("click", () => {
      setMode(b.dataset.add);
      addForm.scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );
  setMode("thanhTich");

  /* Chọn ảnh: nén ngay trên máy (tối đa 1280px, JPEG) để tải lên nhanh */
  const MAX_ANH = 3;
  let picked = [];
  function nenAnh(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const s = Math.min(1, 1280 / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * s));
        const h = Math.max(1, Math.round(img.naturalHeight * s));
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("khong-doc-duoc")); };
      img.src = url;
    });
  }
  function renderPicked() {
    const box = $("aPhotos");
    const add = $("aPhotoAdd");
    Array.prototype.slice.call(box.querySelectorAll(".photo-prev")).forEach((n) => box.removeChild(n));
    picked.forEach((d, i) => {
      const w = el("div", "photo-prev");
      const img = new Image();
      img.src = d;
      img.alt = "Ảnh đã chọn " + (i + 1);
      const x = el("button", null, "✕");
      x.type = "button";
      x.setAttribute("aria-label", "Bỏ ảnh " + (i + 1));
      x.addEventListener("click", () => { picked.splice(i, 1); renderPicked(); });
      w.append(img, x);
      box.insertBefore(w, add);
    });
    add.hidden = picked.length >= MAX_ANH;
    $("aPhotoHint").textContent = picked.length ? picked.length + "/" + MAX_ANH + " ảnh" : "tối đa 3 ảnh · không bắt buộc";
  }
  $("aFile").addEventListener("change", async (e) => {
    const files = Array.prototype.slice.call(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    const add = $("aPhotoAdd");
    add.classList.add("busy");
    let loi = 0, thua = 0;
    for (const f of files) {
      if (picked.length >= MAX_ANH) { thua++; continue; }
      if (f.type && f.type.indexOf("image/") !== 0) { loi++; continue; }
      try { picked.push(await nenAnh(f)); } catch (err) { loi++; }
    }
    add.classList.remove("busy");
    renderPicked();
    if (loi) setAStatus(loi + " ảnh không đọc được — hãy chọn ảnh JPG hoặc PNG nhé.", "err");
    else if (thua) setAStatus("Mỗi mục chỉ thêm được tối đa " + MAX_ANH + " ảnh.", "err");
    else setAStatus("");
  });

  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (addForm.website.value) return; // ô bẫy chống spam
    const loai = addMode;
    const tt = loai === "thanhTich";
    const ten = $("aName").value.trim();
    const tieuDe = $("aTitle").value.trim();
    const moTa = aDesc.value.trim();
    const thoiGian = tt ? "" : $("aWhen").value.trim();
    const ic = addForm.querySelector('input[name="icon"]:checked');
    const icon = ic ? ic.value : "🌟";
    if (!tieuDe) { setAStatus(tt ? "Bạn chưa ghi thành tích nè!" : "Bạn chưa ghi tiêu đề kỷ niệm nè!", "err"); $("aTitle").focus(); return; }
    if (!ten) { setAStatus("Bạn nhớ ghi tên người viết nhé!", "err"); $("aName").focus(); return; }
    if (!API || !backendMoi) { updateAddWarn(); setAStatus("Chưa lưu được — kho lưu trữ chưa sẵn sàng.", "err"); return; }
    if (picked.length && !backendAnh) { updateAddWarn(); setAStatus("Kho lưu trữ chưa nhận được ảnh — bỏ ảnh ra hoặc nhờ gia đình cập nhật Apps Script nhé.", "err"); return; }

    const anh = picked.slice();
    const btn = $("aSubmit");
    btn.disabled = true;
    btn.textContent = anh.length ? "Đang tải ảnh lên…" : "Đang lưu…";
    setAStatus(anh.length ? "Đang gửi ảnh, chờ vài giây nhé…" : "");
    try {
      const j = await guiLen(loai, {
        ten: ten, icon: icon, tieuDe: tieuDe, moTa: moTa, thoiGian: thoiGian,
        anh: anh.map((d) => ({ data: d.slice(d.indexOf(",") + 1) }))
      });
      store("thiep-ten", ten);
      $("aTitle").value = "";
      $("aWhen").value = "";
      aDesc.value = "";
      updateACount();
      picked = [];
      renderPicked();
      if (j.choDuyet) {
        setAStatus("Đã gửi! Mục có ảnh sẽ hiện sau khi gia đình duyệt nhé 💖", "ok");
      } else {
        mine[loai].unshift({ ten: ten, icon: icon, tieuDe: tieuDe, moTa: moTa, thoiGian: thoiGian, anhLocal: anh, t: new Date().toISOString(), moi: true });
        setAStatus(tt ? "Đã thêm thành tích! Cảm ơn bạn 💖" : "Đã thêm kỷ niệm! Cảm ơn bạn 💖", "ok");
        if (tt) renderAchieve(); else renderMemories();
        boom(false);
      }
      setTimeout(() => loadAll(true), 4000);
    } catch (err) {
      setAStatus("Lưu chưa được 😢 Kiểm tra mạng rồi bấm lại nhé.", "err");
    } finally {
      btn.disabled = false;
      btn.textContent = "Thêm vào trang ✨";
    }
  });

  updateAddWarn();
  renderAll();
  loadAll(true);

  /* ---------- Tabs ---------- */
  const tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  const ids = tabs.map((t) => t.dataset.tab);
  const nav = $("tabs");
  const hero = document.querySelector(".hero");

  function showTab(id, scroll) {
    if (ids.indexOf(id) < 0) id = ids[0];
    tabs.forEach((t) => {
      const on = t.dataset.tab === id;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      if (on && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = t.offsetLeft - (nav.clientWidth - t.offsetWidth) / 2;
    });
    ids.forEach((x) => ($("tab-" + x).hidden = x !== id));
    if (location.hash !== "#" + id && history.replaceState) history.replaceState(null, "", "#" + id);
    if (id === "loi-chuc" || id === "tuoi-13") loadAll(false);
    if (scroll) {
      // vị trí gốc của thanh tab (ngay dưới hero) — không dùng vị trí "sticky" hiện tại
      const y = hero.offsetTop + hero.offsetHeight;
      if (window.pageYOffset > y || scroll === "force") window.scrollTo(0, y);
    }
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => showTab(t.dataset.tab, true));
    t.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus();
      showTab(n.dataset.tab, true);
    });
  });
  document.querySelectorAll("[data-goto]").forEach((a) =>
    a.addEventListener("click", (e) => { e.preventDefault(); showTab(a.dataset.goto, "force"); })
  );
  window.addEventListener("hashchange", () => showTab(location.hash.slice(1), true));
  const startHash = location.hash.slice(1);
  showTab(startHash);

  /* ---------- Nhạc ---------- */
  const audio = $("bgm");
  const mBtn = $("musicBtn");
  const N = D.nhac || {};
  if (N.file) {
    audio.src = N.file;
    audio.volume = 0.6;
    $("musicCredit").textContent = "Nhạc nền: " + (N.ten || "");
  } else {
    mBtn.hidden = true;
  }
  audio.addEventListener("error", () => { mBtn.hidden = true; });
  function syncMusic() {
    const on = !audio.paused;
    mBtn.classList.toggle("playing", on);
    mBtn.setAttribute("aria-pressed", on ? "true" : "false");
    mBtn.setAttribute("aria-label", on ? "Tắt nhạc" : "Bật nhạc");
  }
  audio.addEventListener("play", syncMusic);
  audio.addEventListener("pause", syncMusic);
  function playMusic() {
    if (!N.file) return;
    const p = audio.play();
    if (p && p.catch) p.catch(() => {});
  }
  mBtn.addEventListener("click", () => (audio.paused ? playMusic() : audio.pause()));

  /* ---------- Pháo giấy ---------- */
  const COLORS = ["#f5a9bd", "#c23f72", "#cbb6ef", "#f3cf86", "#ffffff"];
  function boom(big) {
    if (typeof window.confetti !== "function") return;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    confetti({ particleCount: big ? 140 : 70, spread: big ? 100 : 70, origin: { y: .55 }, colors: COLORS, scalar: 1.05 });
    if (big) {
      setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: .7 }, colors: COLORS }), 250);
      setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: .7 }, colors: COLORS }), 400);
    }
  }
  $("big13").addEventListener("click", () => boom(false));

  /* ---------- Mở phong bì ---------- */
  const intro = $("intro");
  const env = $("envelope");
  let opened = false;
  function openInvite() {
    if (opened) return;
    opened = true;
    playMusic();
    env.classList.add("open");
    setTimeout(() => {
      intro.classList.add("hide");
      document.body.classList.remove("locked");
      boom(true);
      // mở link có sẵn #tab (vd. .../#loi-chuc) thì cuộn thẳng tới tab đó
      if (startHash && startHash !== ids[0] && ids.indexOf(startHash) >= 0) showTab(startHash, "force");
    }, 1500);
    setTimeout(() => { intro.hidden = true; }, 2400);
  }
  env.addEventListener("click", openInvite);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }
})();
