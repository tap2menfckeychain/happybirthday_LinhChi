/**
 * KHO LƯU TRỮ CỦA TRANG THIỆP — lưu vào Google Sheet:
 *   • Lời chúc        → trang tính "LoiChuc"
 *   • Thành tích      → trang tính "ThanhTich"
 *   • Kỷ niệm         → trang tính "KyNiem"
 *   • Ảnh khách gửi   → thư mục Google Drive "Ảnh thiệp Linh Chi" (mã ảnh ghi ở cột "Ảnh")
 * Cách cài: xem HUONG-DAN.txt, mục 4. Copy TOÀN BỘ nội dung file này dán vào Apps Script.
 *
 * Mỗi mục là 1 dòng. Muốn ẩn một mục: gõ chữ x vào cột "Ẩn" của dòng đó (hoặc xoá cả dòng).
 */

var TOI_DA_HIEN = 500;                    // số mục tối đa mỗi loại hiện trên trang
var THU_MUC_ANH = 'Ảnh thiệp Linh Chi';   // tên thư mục Drive chứa ảnh khách gửi
var TOI_DA_ANH = 3;                       // số ảnh tối đa mỗi mục
var DUNG_LUONG_ANH = 3 * 1024 * 1024;     // mỗi ảnh tối đa 3 MB (trang web đã tự nén ảnh trước khi gửi)
var DUYET_TRUOC = false;                  // true = mục có ảnh phải được duyệt (xoá chữ "chờ duyệt" ở cột Ẩn) mới hiện
var COT_ANH = 'Ảnh (mã file Drive)';

// [khoá, số ký tự tối đa, tên cột, bắt buộc?]
var LOAI = {
  loiChuc: { trang: 'LoiChuc', coAnh: false, truong: [
    ['ten', 40, 'Tên', true],
    ['loiNhan', 500, 'Lời chúc', true],
    ['mau', 10, 'Màu giấy', false]
  ]},
  thanhTich: { trang: 'ThanhTich', coAnh: true, truong: [
    ['ten', 40, 'Người viết', true],
    ['icon', 8, 'Biểu tượng', false],
    ['tieuDe', 80, 'Thành tích', true],
    ['moTa', 300, 'Mô tả', false]
  ]},
  kyNiem: { trang: 'KyNiem', coAnh: true, truong: [
    ['ten', 40, 'Người viết', true],
    ['icon', 8, 'Biểu tượng', false],
    ['thoiGian', 30, 'Khi nào', false],
    ['tieuDe', 80, 'Tiêu đề', true],
    ['moTa', 400, 'Kể ngắn', false]
  ]}
};

function cotAnh_(cfg) { return cfg.truong.length + 2; }                 // vị trí cột Ảnh (đếm từ 1)
function cotAn_(cfg) { return cfg.truong.length + (cfg.coAnh ? 3 : 2); } // vị trí cột Ẩn (đếm từ 1)

function layTrang_(loai) {
  var cfg = LOAI[loai];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(cfg.trang);
  if (!sh) {
    sh = ss.insertSheet(cfg.trang);
    var dau = ['Thời gian'];
    cfg.truong.forEach(function (t) { dau.push(t[2]); });
    if (cfg.coAnh) dau.push(COT_ANH);
    dau.push('Ẩn (gõ x để ẩn)');
    sh.appendRow(dau);
    sh.setFrozenRows(1);
    sh.getRange(1, 2, sh.getMaxRows(), dau.length - 1).setNumberFormat('@');   // giữ nguyên chữ
  } else if (cfg.coAnh) {
    // trang tạo từ bản cũ (chưa có cột Ảnh) → tự chèn thêm cột
    var dauCu = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0];
    if (dauCu.indexOf(COT_ANH) < 0) {
      sh.insertColumnBefore(cotAnh_(cfg));
      sh.getRange(1, cotAnh_(cfg)).setValue(COT_ANH);
    }
  }
  return sh;
}

function traVe_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function lamSach_(s, toiDa) {
  s = String(s == null ? '' : s)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, toiDa);
  if (/^[=+\-@]/.test(s)) s = "'" + s;   // chặn công thức trong Google Sheet
  return s;
}

function thuMucAnh_() {
  var it = DriveApp.getFoldersByName(THU_MUC_ANH);
  return it.hasNext() ? it.next() : DriveApp.createFolder(THU_MUC_ANH);
}

/* Lưu ảnh (dạng base64 JPEG do trang web gửi lên) vào Drive, trả về danh sách mã file */
function luuAnh_(ds, tenFile) {
  if (!ds || !ds.length) return [];
  var folder = thuMucAnh_();
  var ids = [];
  ds.slice(0, TOI_DA_ANH).forEach(function (a, i) {
    if (!a || !a.data) return;
    var bytes = Utilities.base64Decode(String(a.data));
    if (bytes.length < 4 || bytes.length > DUNG_LUONG_ANH) return;
    if (!(bytes[0] === -1 && bytes[1] === -40)) return;   // chỉ nhận file JPEG thật (FF D8)
    var blob = Utilities.newBlob(bytes, 'image/jpeg', tenFile + '-' + (i + 1) + '.jpg');
    var f = folder.createFile(blob);
    f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    ids.push(f.getId());
  });
  return ids;
}

function docLoai_(loai) {
  var cfg = LOAI[loai];
  var rows = layTrang_(loai).getDataRange().getValues().slice(1);
  var anIdx = cotAn_(cfg) - 1;
  var anhIdx = cotAnh_(cfg) - 1;
  var list = [];
  for (var i = rows.length - 1; i >= 0 && list.length < TOI_DA_HIEN; i--) {
    var r = rows[i];
    if (String(r[anIdx] == null ? '' : r[anIdx]).trim()) continue;   // dòng đã ẩn / chờ duyệt
    var item = { t: r[0] instanceof Date ? r[0].toISOString() : String(r[0]) };
    var du = true;
    cfg.truong.forEach(function (t, k) {
      item[t[0]] = String(r[k + 1] == null ? '' : r[k + 1]);
      if (t[3] && !item[t[0]]) du = false;
    });
    if (cfg.coAnh) {
      item.anh = String(r[anhIdx] || '').split(/[\s,]+/).filter(function (x) { return x; });
    }
    if (du) list.push(item);   // mới nhất đứng đầu
  }
  return list;
}

/* Trang web đọc dữ liệu */
function doGet() {
  var out = { ok: true, coAnh: true };
  Object.keys(LOAI).forEach(function (loai) { out[loai] = docLoai_(loai); });
  out.list = out.loiChuc;   // tương thích bản cũ
  return traVe_(out);
}

/* Trang web gửi một mục mới */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var data = {};
    try { data = JSON.parse(e.postData.contents); } catch (err) { data = e.parameter || {}; }
    if (data.website) return traVe_({ ok: true });   // ô bẫy chống spam

    var loai = LOAI[data.loai] ? data.loai : 'loiChuc';
    var cfg = LOAI[loai];
    var sh = layTrang_(loai);
    var dong = [new Date()];
    var thieu = false;
    cfg.truong.forEach(function (t) {
      var v = lamSach_(data[t[0]], t[1]);
      if (t[3] && !v) thieu = true;
      dong.push(v);
    });
    if (thieu) return traVe_({ ok: false, error: 'thieu-thong-tin' });

    var choDuyet = false;
    if (cfg.coAnh) {
      var stamp = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd-HHmmss');
      var ids = luuAnh_(data.anh, loai + '-' + stamp);
      dong.push(ids.join(','));
      choDuyet = DUYET_TRUOC && ids.length > 0;
    }
    dong.push(choDuyet ? 'chờ duyệt' : '');
    sh.appendRow(dong);
    return traVe_({ ok: true, choDuyet: choDuyet });
  } finally {
    lock.releaseLock();
  }
}
