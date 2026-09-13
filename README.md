# TAPA – bộ mã nguồn dễ chỉnh sửa

Repository gồm hai phiên bản của giao diện TAPA EPS-TOPIK:

- `01_BAN_DE_SUA_CO_BAN`: bản HTML/CSS/JavaScript độc lập, phù hợp để học và chỉnh sửa cơ bản.
- `02_MA_NGUON_WEB_DAY_DU_REACT`: ứng dụng Next.js/React đầy đủ, có TypeScript, ESLint và Vitest. Đây là bản cần dùng khi phát triển website.

`TAPA_LUYEN_THI_EPS_TOPIK.html` chỉ là **tài liệu tham chiếu hình ảnh**. Không chạy, không chỉnh sửa, và không dùng file này làm nguồn dữ liệu hoặc mã cho ứng dụng React.

## Chạy ứng dụng React

Cần Node.js `>=22.13.0`. Chạy các lệnh sau từ thư mục gốc repository:

```bash
cd 02_MA_NGUON_WEB_DAY_DU_REACT
npm install
npm run dev
```

Mở địa chỉ Next.js in ra trong terminal (thông thường là `http://localhost:3000`). Các lệnh kiểm tra và tạo bản production cũng phải được chạy trong chính thư mục này:

```bash
npm run lint
npm test
npm run build
```

Xem hướng dẫn chi tiết về cấu trúc và các điểm cần sửa trong [README_REACT.md](02_MA_NGUON_WEB_DAY_DU_REACT/README_REACT.md).

## Bản HTML/CSS/JavaScript cơ bản

Mở `01_BAN_DE_SUA_CO_BAN/index.html` bằng trình duyệt, hoặc mở thư mục này bằng VS Code và dùng Live Server. Các điểm chỉnh sửa chính:

- `index.html`: cấu trúc và tiêu đề trang.
- `styles.css`: màu sắc, font, khoảng cách và giao diện.
- `data.js`: dữ liệu bài học, từ vựng và câu hỏi.
- `app.js`: hành vi chuyển mục, làm bài, tính điểm và khóa nội dung.
- `assets/`: hình ảnh và audio của bản HTML.
