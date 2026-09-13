# TAPA EPS-TOPIK React

Đây là ứng dụng Next.js App Router dùng React và TypeScript. Nội dung học, bài thi, tiến độ cục bộ và các thành phần giao diện đều nằm trong thư mục này.

## Cài đặt và chạy

Yêu cầu Node.js `>=22.13.0`. Từ thư mục `02_MA_NGUON_WEB_DAY_DU_REACT`, chạy đúng các lệnh sau:

```bash
npm install
npm run dev
```

Sau khi máy chủ phát triển khởi động, mở URL được Next.js hiển thị trong terminal (mặc định là `http://localhost:3000`).

## Kiểm tra và build

Chạy các lệnh này trong `02_MA_NGUON_WEB_DAY_DU_REACT`:

```bash
npm run lint
npm test
npm run build
```

- `npm run lint`: kiểm tra quy tắc ESLint.
- `npm test`: chạy bộ kiểm thử Vitest một lần.
- `npm run build`: tạo và kiểm tra bản production của Next.js.

## Chỉnh sửa nội dung

- `lib/content.ts`: nguồn dữ liệu chính cho bài học, nhóm thư viện, câu hỏi đọc/nghe, đáp án, lời giải, đường dẫn audio và metadata hình ảnh.
- `components/`: các màn hình và thành phần giao diện; ví dụ `tapa-app.tsx` điều phối các màn hình, còn các file `dashboard`, `lessons`, `exam-*` và `library-page` hiển thị từng khu vực.
- `hooks/` và `lib/exam.ts`: logic phiên thi, audio và lưu tiến độ. Sửa các file này khi thay đổi hành vi, không chỉ thay đổi nội dung.
- `app/layout.tsx`: metadata, ngôn ngữ tài liệu và khung ứng dụng.

Khi sửa câu hỏi nghe, cập nhật đồng bộ câu hỏi và mốc `startSeconds`/`endSeconds` trong `lib/content.ts` để chúng khớp với audio.

## Chỉnh sửa assets

- Ảnh nằm trong `public/images/`; dùng đường dẫn bắt đầu bằng `/images/` trong `lib/content.ts`.
- Audio nằm trong `public/audio/`; dùng đường dẫn bắt đầu bằng `/audio/` trong `lib/content.ts`.
- Khi thay file asset, giữ tên và đường dẫn hiện có hoặc cập nhật mọi tham chiếu liên quan trong `lib/content.ts`. Với audio nghe, cần cập nhật cả thời lượng và các mốc thời gian.

## Chỉnh sửa CSS

- `app/globals.css` là stylesheet toàn cục: biến màu ở đầu file, bố cục, typography, trạng thái focus và responsive styles.
- Hãy ưu tiên sửa biến CSS trong `:root` khi đổi hệ màu chung; sửa các selector tương ứng khi cần thay đổi một khu vực cụ thể.

## Tham chiếu giao diện HTML

`../TAPA_LUYEN_THI_EPS_TOPIK.html` chỉ dùng để đối chiếu hình ảnh/ý tưởng giao diện. Nó không phải là một phần của ứng dụng React, không được nhập vào mã nguồn và không phải nơi để cập nhật nội dung hoặc assets của ứng dụng.
