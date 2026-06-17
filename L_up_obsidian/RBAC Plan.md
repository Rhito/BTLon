---
tags:
  - plan
  - backend
  - frontend
  - rbac
status: todo
---

# Kế hoạch Triển khai Phân quyền (RBAC) Chuẩn

Bản kế hoạch này áp dụng chuẩn **Role-Based Access Control (RBAC)** cho dự án Shopmini, sử dụng package phổ biến nhất của Laravel.

## 1. Công nghệ & Kiến trúc
- **Backend:** Sử dụng package `spatie/laravel-permission`. Đây là tiêu chuẩn công nghiệp (industry standard) cho Laravel.
- **Frontend:** Lưu thông tin Permissions vào Context sau khi đăng nhập và render UI (Sidebar, Nút bấm) dựa theo quyền.

---

## 2. Định nghĩa Roles (Vai trò) & Permissions (Quyền hạn)

### Các Roles cơ bản:
1. **`Super Admin`**: Có toàn quyền (Bypass toàn bộ middleware kiểm tra quyền).
2. **`Manager` (Quản lý)**: Được quản lý Sản phẩm, Danh mục, Đơn hàng và Khách hàng. Không được động vào hệ thống nhân sự (Users) hay Cài đặt.
3. **`Staff` (Nhân viên)**: Chỉ được phép vào xem và chuyển trạng thái Đơn hàng (Processing, Shipping, Delivered). Không được sửa sản phẩm.

### Các Permissions (Quyền hạn chi tiết):
- `view_dashboard`: Xem thống kê
- `manage_products`: Thêm/Sửa/Xoá Sản phẩm
- `manage_categories`: Thêm/Sửa/Xoá Danh mục
- `manage_orders`: Đọc và cập nhật trạng thái đơn hàng
- `manage_users`: Quản lý tài khoản Admin/Staff khác

---

## 3. Checklist Thực thi Backend (Laravel)

- [x] **Cài đặt thư viện:** 
  - Chạy: `composer require spatie/laravel-permission`
  - Chạy: `php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"`
- [x] **Migrate Database:**
  - Chạy `php artisan migrate` để tạo các bảng `roles`, `permissions`, `model_has_roles`, v.v.
- [x] **Setup Model:**
  - Thêm trait `HasRoles` vào model `App\Models\User`.
- [x] **Viết Seeder (`RoleSeeder`):**
  - Tạo các Permissions mặc định.
  - Tạo 3 Roles (Super Admin, Manager, Staff).
  - Gán tất cả quyền cho Manager (trừ `manage_users`).
  - Gán quyền `manage_orders` cho Staff.
  - Gán Role `Super Admin` cho tài khoản `admin@shopmini.test`.
- [x] **Chặn Routes (Middleware):**
  - Gom nhóm các API route và gắn middleware bảo vệ. Ví dụ: `Route::apiResource('products')->middleware('permission:manage_products');`
- [x] **Cập nhật Auth Resource:**
  - Cập nhật API Login hoặc Get Profile (`/api/me`) để trả về thêm mảng: `roles: [...]` và `permissions: [...]`.

---

## 4. Checklist Thực thi Frontend (ReactJS)

- [x] **Quản lý State:**
  - Sau khi Login thành công, lưu mảng `permissions` và `roles` vào Global State (ví dụ Context API, Zustand hoặc Redux).
- [x] **Tạo Helper (HOC / Hook):**
  - Viết hook `useAuth()` trả về hàm `hasPermission(permissionName)`.
  - Viết component `<RequirePermission permission="manage_products"> ... </RequirePermission>` để bọc các nút bấm cần ẩn.
- [x] **Áp dụng vào Sidebar:**
  - Dùng hàm `hasPermission()` để kiểm tra trước khi render các menu (Ví dụ: Ẩn menu "Tài khoản nhân viên" đối với Staff).
- [x] **Áp dụng vào Router (Chặn truy cập trang):**
  - Tạo `<ProtectedRoute>` bọc ngoài các Route trong `App.jsx`. Nếu user cố tình gõ URL vào thanh địa chỉ mà không có quyền, đá văng ra trang `/403` hoặc `/admin`.
- [x] **Ẩn các Action Button (Nút bấm):**
  - Trong trang `Products.jsx`: Ẩn nút "Add Product", "Edit", "Delete" đối với tài khoản `Staff`.

---

## 5. Notes / Quyết định thiết kế (Design Decisions)
- Không check quyền cứng trong code bằng tên Role (vd: `if (user.role == 'manager')`), mà hãy **LUÔN CHECK BẰNG PERMISSION** (vd: `if (user.hasPermission('manage_products'))`). Điều này giúp hệ thống linh hoạt hơn, sau này có thể tự do tạo thêm Role mới mà không cần sửa code.
- Riêng `Super Admin` thì dùng tính năng `Gate::before` của Laravel để tự động cho phép mọi quyền hạn mà không cần lưu vào bảng trung gian.

admin@shopmini.test
manager@shopmini.test
staff@shopmini.test