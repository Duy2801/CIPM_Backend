# Dữ liệu mẫu M2 – Dự án & Công trình

Seed theo mục 4.2.1–4.2.4 trong `BQL_HaTien_BRD_ChinhThuc_CF1.0.md`:

```sh
pnpm run prisma:seed
```

Cần cấu hình `DATABASE_URL` trong `.env`, database đã có schema/migrations và Prisma Client đã được generate.

`seed.ts` giữ bộ 5 dự án ban đầu và gọi `seed-projects.ts` để bổ sung:

| Bảng                  |                            Số bản ghi thêm |
| --------------------- | -----------------------------------------: |
| Project               | 5 (mã BQL-DA-2026-006 đến BQL-DA-2026-010) |
| User                  |                                          5 |
| UserRole              |  5, dùng vai trò TECHNICAL_OFFICER hiện có |
| FundingSource         |                                          5 |
| AnnualCapitalPlan     |                                5, năm 2026 |
| ProjectAssignment     |            10, mỗi dự án 2 người khác nhau |
| ProjectProgressUpdate |                                          5 |

Quy ước dữ liệu mẫu cho `assignmentType`: `PRIMARY` là phụ trách chính, `TECHNICAL_SUPERVISOR` là giám sát kỹ thuật. Schema hiện dùng kiểu String cho trường này.

Tài khoản mẫu: `m2.engineer1@example.com` đến `m2.engineer5@example.com`, mật khẩu ban đầu `Engineer@123`. Các bản ghi M2 mới dùng `upsert` không cập nhật bản ghi đã tồn tại, nên chạy lại không tạo trùng hoặc đặt lại mật khẩu các tài khoản này. Phần seed tài khoản admin/engineer ban đầu vẫn giữ hành vi đặt lại mật khẩu như trước.

Số tiền lưu bằng VND; giao diện quy đổi sang tỷ đồng theo BRD. Dữ liệu có dự án thi công chậm/vượt tiến độ, chuẩn bị đầu tư và hoàn thành; dự án đạt 100% có ngày hoàn thành thực tế. Lịch sử tiến độ ghi ngày thứ Hai 21/09/2026.

Để thử phân trang cùng trạng thái, dùng `CONSTRUCTION` với `limit=2`. Mỗi dự án mới có người phụ trách để API hiện tại trả về qua `assignments.user`. Nguồn vốn và lịch sử đã có trong database; API cần include `capitalPlans.fundingSource` và `progressUpdates` nếu muốn trả các phần này.

Phạm vi bộ dữ liệu này là màn hình M2; không tạo thêm dữ liệu cho các module thủ tục, thanh toán, GPMB hay bảo hành.
