/* =====================================================================
   NỘI DUNG THIỆP — chỉ cần sửa file này, không cần đụng tới file khác.
   Quy tắc nhỏ:
     • Chữ đặt trong dấu ngoặc kép "..."
     • Mỗi mục trong danh sách [ ... ] cách nhau bằng dấu phẩy ,
     • Dòng bắt đầu bằng // là ghi chú, trang web sẽ bỏ qua.
   ===================================================================== */

window.THIEP = {
  ten: "Linh Chi",
  tuoi: 13,
  ngaySinh: "2013-10-03",          // năm-tháng-ngày
  cungHoangDao: "Thiên Bình ♎",
  conGiap: "Quý Tỵ 🐍",

  /* ---------- Buổi tiệc ---------- */
  tiec: {
    batDau: "2026-10-10T18:45:00+07:00",
    ketThuc: "2026-10-10T21:00:00+07:00",
    nhaHang: "Oven & Baked Chicken",
    // Kiểm tra lại địa chỉ này cho đúng chi nhánh nhé:
    diaChi: "S3-SO18 Vinhomes Skylake, Phạm Hùng, Nam Từ Liêm, Hà Nội",
    linkBanDo: "https://share.google/2fNunp0tjYMCiJhOU",
    timTrenBanDo: "Oven & Baked Chicken, Vinhomes Skylake, Phạm Hùng, Hà Nội"
  },

  loiMoi:
    "Tuổi 13 là một cột mốc thật đặc biệt — Chi chính thức bước vào tuổi teen! " +
    "Chi rất mong được đón bạn đến chung vui trong buổi tối sinh nhật của mình: " +
    "cùng ăn tối, dạo chơi và chụp thật nhiều ảnh kỷ niệm nhé! 💖",

  lichTrinh: [
    { tu: "18:45", den: "19:00", icon: "🎈", tieuDe: "Đón khách",
      moTa: "Mọi người đến nhà hàng Oven & Baked Chicken, gặp nhau và chụp vài tấm ảnh check-in." },
    { tu: "19:00", den: "20:30", icon: "🍗", tieuDe: "Tiệc tối",
      moTa: "Cùng ăn tối, trò chuyện và chúc mừng sinh nhật Chi." },
    { tu: "20:30", den: "21:00", icon: "📸", tieuDe: "Vincom Sky Lake & Photo booth",
      moTa: "Dạo chơi trung tâm thương mại Vincom Sky Lake và chụp photo booth lấy ảnh lưu niệm." },
    { tu: "21:00", den: "", icon: "🌙", tieuDe: "Girls' Sleepover", nhan: "Girls only",
      moTa: "Các bạn nữ ở lại ngủ cùng Chi, các bạn nam kết thúc chương trình và ra về." }
  ],

  sau21h: {
    banNu: "Ở lại sleepover cùng Chi 💤 Nhớ mang theo đồ ngủ và đồ dùng cá nhân nhé!",
    banNam: "Kết thúc lúc 21:00 — nhờ bố mẹ đón giúp nhé. Cảm ơn các bạn đã đến! 👋"
  },

  /* Để trống "" thì nút "Xác nhận tham dự" sẽ tự ẩn. */
  lienHe: {
    ten: "",            // ví dụ: "Mẹ Linh Chi"
    soDienThoai: "",    // ví dụ: "0912345678"
    zalo: ""            // số Zalo, ví dụ: "0912345678"
  },

  /* Nhóm Zalo để phụ huynh và các bạn tham gia (để link trống "" thì khung nhóm Zalo tự ẩn) */
  nhomZalo: {
    ten: "sinh nhật Linh chi 13 tuổi",
    link: "https://zalo.me/g/h3edxm1mmv7wpybbtvb4",
    qr: "anh/zalo-qr.png"
  },

  nhac: {
    file: "nhac/what-makes-you-beautiful.mp3",
    ten: "What Makes You Beautiful — One Direction"
  },

  /* ---------- Tab "Khoảnh khắc": ảnh gần đây với gia đình, bạn bè ----------
     src = ảnh nhỏ hiện trong album (thư mục anh/gan-day/nho), lon = ảnh lớn khi bấm phóng to.
     Muốn bỏ ảnh nào thì xoá cả dòng đó; muốn đổi chú thích thì sửa chữ trong chuThich.
     Thêm ảnh mới: bỏ ảnh vào anh/gan-day rồi thêm dòng, ví dụ:
       { src: "anh/gan-day/31.jpg", chuThich: "Chú thích" }, */
  anhGanDay: [
    { src: "anh/gan-day/nho/01.jpg", lon: "anh/gan-day/01.jpg", chuThich: "Lạc giữa đại dương 🐠" },
    { src: "anh/gan-day/nho/02.jpg", lon: "anh/gan-day/02.jpg", chuThich: "Khu rừng ánh sáng" },
    { src: "anh/gan-day/nho/03.jpg", lon: "anh/gan-day/03.jpg", chuThich: "Lung linh sắc tím 💜" },
    { src: "anh/gan-day/nho/04.jpg", lon: "anh/gan-day/04.jpg", chuThich: "Bay giữa dải ngân hà" },
    { src: "anh/gan-day/nho/05.jpg", lon: "anh/gan-day/05.jpg", chuThich: "Tốc độ ánh sáng 🚀" },
    { src: "anh/gan-day/nho/06.jpg", lon: "anh/gan-day/06.jpg", chuThich: "Xuyên không gian ✨" },
    { src: "anh/gan-day/nho/07.jpg", lon: "anh/gan-day/07.jpg", chuThich: "Mưa sao băng 🌌" },
    { src: "anh/gan-day/nho/08.jpg", lon: "anh/gan-day/08.jpg", chuThich: "Chói quá trời 😖" },
    { src: "anh/gan-day/nho/09.jpg", lon: "anh/gan-day/09.jpg", chuThich: "Đi về phía ánh sáng" },
    { src: "anh/gan-day/nho/10.jpg", lon: "anh/gan-day/10.jpg", chuThich: "Chạm vào tia sét ⚡" },
    { src: "anh/gan-day/nho/11.jpg", lon: "anh/gan-day/11.jpg", chuThich: "Ngầu chưa? ⭐" },
    { src: "anh/gan-day/nho/12.jpg", lon: "anh/gan-day/12.jpg", chuThich: "Zoom cận cảnh 👀" },
    { src: "anh/gan-day/nho/13.jpg", lon: "anh/gan-day/13.jpg", chuThich: "Ôm chặt không buông 🤗" },
    { src: "anh/gan-day/nho/14.jpg", lon: "anh/gan-day/14.jpg", chuThich: "Ai tạo kiểu tóc này vậy? 😂" },
    { src: "anh/gan-day/nho/15.jpg", lon: "anh/gan-day/15.jpg", chuThich: "Selfie trong gương 📱" },
    { src: "anh/gan-day/nho/16.jpg", lon: "anh/gan-day/16.jpg", chuThich: "Chơi với các bé mèo 🐱" },
    { src: "anh/gan-day/nho/17.jpg", lon: "anh/gan-day/17.jpg", chuThich: "Một ngày đi chơi" },
    { src: "anh/gan-day/nho/18.jpg", lon: "anh/gan-day/18.jpg", chuThich: "Khám phá khu vườn 🌿" },
    { src: "anh/gan-day/nho/19.jpg", lon: "anh/gan-day/19.jpg", chuThich: "Ngồi ghế giám đốc 😎" },
    { src: "anh/gan-day/nho/20.jpg", lon: "anh/gan-day/20.jpg", chuThich: "Thử tài câu cá 🎣" },
    { src: "anh/gan-day/nho/21.jpg", lon: "anh/gan-day/21.jpg", chuThich: "Suy nghĩ chiến thuật 🤔" },
    { src: "anh/gan-day/nho/22.jpg", lon: "anh/gan-day/22.jpg", chuThich: "Sắp câu được rồi!" },
    { src: "anh/gan-day/nho/23.jpg", lon: "anh/gan-day/23.jpg", chuThich: "Chu môi chờ cá 😙" },
    { src: "anh/gan-day/nho/24.jpg", lon: "anh/gan-day/24.jpg", chuThich: "Thăm vườn thú mini 🐣" },
    { src: "anh/gan-day/nho/25.jpg", lon: "anh/gan-day/25.jpg", chuThich: "Cho các bé thú ăn" },
    { src: "anh/gan-day/nho/26.jpg", lon: "anh/gan-day/26.jpg", chuThich: "Chăm các bạn nhỏ 🐰" },
    { src: "anh/gan-day/nho/27.jpg", lon: "anh/gan-day/27.jpg", chuThich: "Tập làm gốm 🏺" },
    { src: "anh/gan-day/nho/28.jpg", lon: "anh/gan-day/28.jpg", chuThich: "Nặn gốm cùng nhau" },
    { src: "anh/gan-day/nho/29.jpg", lon: "anh/gan-day/29.jpg", chuThich: "Ba nghệ nhân nhí" },
    { src: "anh/gan-day/nho/30.jpg", lon: "anh/gan-day/30.jpg", chuThich: "Sắp thành tác phẩm rồi!" }
  ],

  /* ---------- Tab "Ảnh tiệc": cập nhật sau buổi tiệc ----------
     Đang để trống nên trang sẽ hiện "sắp cập nhật". */
  anhTiec: [
    // { src: "anh/tiec-sinh-nhat/1.jpg", chuThich: "Thổi nến!" },
  ],

  /* ---------- Kho lưu trữ Google Sheet ----------
     Lời chúc, thành tích và kỷ niệm do khách tự điền trên trang đều được lưu vào Google Sheet của bạn.
     Link Web App (mục 4 trong HUONG-DAN.txt): */
  apiGoogleSheet: "https://script.google.com/macros/s/AKfycbzRwFZ6OytJm6u6gIE6mbgdOjTQ-UIt1977fOmpwpyvNVPhUUHiUaYu3v-TihLrm8Si/exec",

  /* ---------- Tab "Lời chúc" ----------
     Lời chúc "ghim" luôn nằm đầu bảng (của gia đình). Lời "Bố Mẹ" là lời mẫu — sửa lại theo ý mình. */
  loiChuc: [
    { ten: "Bố Mẹ",
      loiNhan: "Chúc mừng con gái yêu tròn 13 tuổi! Bố mẹ mong con luôn vui vẻ, tự tin, tử tế và mãi rạng rỡ như hôm nay. Yêu con nhiều! 💕" }
  ],

  /* ---------- Tab "Tuổi 13": thành tích & kỷ niệm ----------
     Khách tự thêm thành tích / kỷ niệm ngay trên trang (lưu vào Google Sheet).
     Các mục dưới đây là mục "ghim" của gia đình, luôn hiện đầu danh sách. Ví dụ thêm một thành tích:
       { icon: "🏅", tieuDe: "Học sinh Xuất sắc", moTa: "Năm học 2025–2026" }, */
  thanhTich: [
  ],

  kyNiem: [
    { thoiGian: "03.10.2026", icon: "🎂", tieuDe: "Chính thức 13 tuổi!",
      moTa: "Chào tuổi teen — một chương mới thật rực rỡ bắt đầu." }
  ]
};
