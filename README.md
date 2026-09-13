# TAPA – LUYỆN THI EPS TOPIK

Ứng dụng web luyện thi EPS-TOPIK, xây dựng bằng Next.js/React với TypeScript, ESLint và Vitest. Mã nguồn nằm trong thư mục `02_MA_NGUON_WEB_DAY_DU_REACT`.

Ứng dụng đã được triển khai trên AWS Amplify Hosting (S3 + CloudFront):
<https://main.d3lz6ead3g8gpe.amplifyapp.com/>

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

`npm run build` xuất bản tĩnh ra thư mục `out/` (cấu hình `output: "export"`), đây cũng là nội dung được AWS Amplify phục vụ.

Xem hướng dẫn chi tiết về cấu trúc và các điểm cần sửa trong [README_REACT.md](02_MA_NGUON_WEB_DAY_DU_REACT/README_REACT.md).
