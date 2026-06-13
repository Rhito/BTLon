___
## Cross-cutting (áp dụng toàn hệ thống)
- [x] Tạo model và relation
	- [x] Category
	- [x] Order
	- [x] OrderItem
	- [x] OrderHistory
	- [x] Product
	- [x] ProductImage
	- [x] User
- [x] Xử lý slug theo model
- [x] Tạo cấu hình observer xử lý file theo model action
- [x] Rate Limit
- [x] Policy Permission CRUD

---

## Target A — Duyệt sản phẩm & danh mục (Guest)
- [x] Service: Product Find/Filter/Sort (Guest)
	- [x] Pagination (12 sp/trang)
	- [x] Tìm kiếm theo tên
	- [x] Lọc theo danh mục, khoảng giá
	- [x] Sắp xếp: mới nhất, giá tăng/giảm, bán chạy
- [x] Controller: ProductController (public endpoints)

---

## Target B — Giỏ hàng (Frontend only)
> Không có task BE — giỏ hàng lưu localStorage phía client.

---

## Target C — Đặt hàng / Guest Checkout
- [x] Repository: Order CRUD
- [x] Service: Place an Order (Guest) — Table Locking
	- [x] Validate tồn kho
	- [x] Tính lại tổng tiền server-side
	- [x] Tạo order trong transaction
	- [x] Trả về order_code

---

## Target D — Tra cứu đơn hàng (Guest)
- [x] Service: Tra cứu đơn hàng dựa trên Email + Mã đơn
- [x] Service: Cancel Order khi status là pending (Guest)
	- [x] Xác nhận bằng email

---

## Target E — Đăng nhập Admin
- [x] Service: Login (Sanctum)
- [x] Service: Token revoke / Đăng xuất
- [x] Controller: AuthController
- [x] Rate Limit cho endpoint login

---

## Target F — Quản lý Danh mục (Admin)
- [x] Repository: Category CRUD
- [x] Lấy số lượng sản phẩm trong category
- [x] Controller: CategoryController

---

## Target G — Quản lý Sản phẩm (Admin)
- [x] Repository: Product CRUD
- [x] Service: Image handling
	- [x] Upload (Multiple)
	- [x] Resize (Intervention Image): ảnh gốc + thumbnail 300x300
- [x] Controller: ProductController (admin endpoints)
	- [x] Product-image endpoints
- [x] Cảnh báo khi stock ≤ 5

---

## Target H — Quản lý Đơn hàng (Admin)
- [x] Repository: Liệt kê đơn hàng + filter (trạng thái, ngày, từ khóa)
- [x] Repository: Xem chi tiết đơn hàng **Track-Order**
- [x] Service: Cập nhật trạng thái (pending → confirmed → shipping → delivered / cancelled)
- [ ] ~~Service: Logging Status Action (lịch sử thay đổi trạng thái)(optn)~~
- [x] Service: Export CSV
- [x] Controller: OrderController

---

## Target I — Dashboard & Thống kê (Admin)
- [x] Service: Tổng đơn hàng / doanh thu (hôm nay / tuần / tháng)
- [x] Service: Số đơn hàng theo từng trạng thái
- [x] Service: Top 5 sản phẩm bán chạy
- [x] Service: Sản phẩm sắp hết hàng (stock ≤ 5)
- [x] Service: Biểu đồ doanh thu 7 ngày gần nhất (bonus)
- [x] Controller: DashboardController
- [x] Cache mỗi 5 phút và clear khi order thay đổi