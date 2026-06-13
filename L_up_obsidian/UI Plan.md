___
## Tech Stack & Cơ sở hạ tầng

- **Framework:** React 19 + Vite 8
- **Routing:** React Router v7
- **State Management:** React Context API (Cart, Auth)
- **HTTP Client:** Axios (base URL: `/api/v1/`)
- **Styling:** TailwindCSS
- **Icons:** Lucide React
- **Charts:** Recharts (cho Dashboard)
- **Notifications:** React Hot Toast

---

## Phase 0 — Project Setup & Base Architecture

- [x] Cài đặt dependencies: `react-router-dom`, `axios`, `lucide-react`, `recharts`, `react-hot-toast, tailwindcss`
- [ ] Cấu hình Vite proxy → Laravel API (`/api` → `http://localhost:8000`)
- [x] Tạo cấu trúc thư mục chuẩn:
	```
	src/
	├── api/            # Axios instance & API service modules
	├── assets/         # Images, fonts
	├── components/     # Shared/reusable components
	│   ├── ui/         # Button, Input, Modal, 
	│	AdminLayout...
	│   ├── layout/     # Header, Footer, Sidebar, 
	│	└── common/     # Badge, Spinner...
	├── contexts/       # CartContext, AuthContext
	├── hooks/          # Custom hooks (useCart, useAuth, useDebounce...)
	├── pages/          # Page-level components
	│   ├── guest/      # Home, Products, ProductDetail, Cart, Checkout, TrackOrder
	│   └── admin/      # Login, Dashboard, Categories, Products, Orders
	├── utils/          # Helpers (formatPrice, formatDate, validators...)
	├── styles/         # Global CSS, design tokens, reset
	├── App.jsx
	└── main.jsx
	```
- [x] Tạo Axios instance với interceptors: #--need-check
	- [x] Base URL config
	- [x] Request interceptor: attach Bearer token từ localStorage
	- [x] Response interceptor: handle 401 → redirect login, handle errors
- [x] Tạo shared UI components: #--need-check
	- [x] `Button` (variants: primary, secondary, outline, danger, ghost)
	- [x] `Input` (text, email, tel, textarea, select)
	- [x] `Modal` (confirm dialog)
	- [x] `Badge` (status badges)
	- [x] `Spinner` / `LoadingOverlay`
	- [x] `Pagination`
	- [x] `EmptyState`
	- [x] `Toast` notifications config
- [x] Cấu hình React Router: #--need-check
	- [x] Guest routes (public layout)
	- [x] Admin routes (admin layout + `ProtectedRoute` guard)
	- [x] 404 Not Found page

---

## Phase 1 — Layout Components

### Guest Layout
- [x] `GuestLayout` — wrapper với Header + Footer
- [ ] `Header`: #--need-logic
	- [x] Logo + tên shop
	- [x] Navigation: Trang chủ, Sản phẩm, Tra cứu đơn hàng
	- [x] Search bar (tìm kiếm sản phẩm)
	- [x] Cart icon + badge số lượng sản phẩm
- [x] `Footer`:
	- [x] Thông tin liên hệ
	- [x] Links nhanh
	- [x] Copyright

### Admin Layout
- [ ] `AdminLayout` — wrapper với Sidebar + Topbar
- [ ] `Sidebar`:
	- [x] Logo
	- [x] Navigation links: Dashboard, Danh mục, Sản phẩm, Đơn hàng
	- [x] Nút Đăng xuất
	- [x] Active state cho route hiện tại
- [ ] `Topbar`:
	- [x] Tên admin đang đăng nhập
	- [x] Avatar placeholder

---

## Phase 2 — Contexts & Hooks

### CartContext
- [x] `CartProvider` wrap toàn app
- [x] State: `items[]`, mỗi item có `{ product, quantity }`
- [ ] Actions:
	- [x] `addToCart(product, quantity)` — kiểm tra trùng, cộng dồn
	- [x] `updateQuantity(productId, quantity)`
	- [x] `removeFromCart(productId)`
	- [x] `clearCart()`
	- [x] `getCartTotal()` — tính tổng tiền
	- [x] `getCartCount()` — tổng số lượng item
- [x] Persist localStorage: load on mount, save on change
- [x] Kiểm tra tồn kho trước khi thêm (gọi API `GET /api/products/{slug}`)

### AuthContext
- [x] `AuthProvider` wrap admin routes
- [x] State: `user`, `token`, `isAuthenticated`
- [x] Actions:
	- [x] `login(email, password)` — gọi `POST /api/auth/login`, lưu token
	- [x] `logout()` — gọi `POST /api/auth/logout`, xóa token, redirect
- [x] Persist token trong localStorage
- [x] Auto-check token validity on mount

### Custom Hooks
- [x] `useDebounce(value, delay)` — cho search input
- [x] `useCart()` — shortcut cho CartContext
- [x] `useAuth()` — shortcut cho AuthContext
- [x] `usePagination(fetchFn)` — quản lý page, loading, data
- [x] `useApiCall()` — wrapper cho loading/error state

---

## Phase 3 — API Service Modules

- [x] `api/axiosInstance.js` — configured Axios instance
- [ ] `api/categoryService.js`:
	- [x] `getCategories(params)` → `GET /api/categories`
	- [x] `getCategoryBySlug(slug)` → `GET /api/categories/{slug}`
	- [x] `getCategoryProductCount(slug)` → `GET /api/categories/count/{slug}`
	- [x] (Admin) `createCategory(data)` → `POST /api/categories`
	- [x] (Admin) `updateCategory(id, data)` → `PUT /api/categories/{id}`
	- [x] (Admin) `deleteCategory(id)` → `DELETE /api/categories/{id}`
	- [x] (Admin) `restoreCategory(id)` → `PATCH /api/categories/{id}/restore`
- [x] `api/productService.js`:
	- [x] `getProducts(params)` → `GET /api/products` (filter, sort, search, paginate)
	- [x] `getProductBySlug(slug)` → `GET /api/products/{slug}`
	- [x] (Admin) `createProduct(data)` → `POST /api/products`
	- [x] (Admin) `updateProduct(id, data)` → `PUT /api/products/{id}`
	- [x] (Admin) `deleteProduct(id)` → `DELETE /api/products/{id}`
	- [x] (Admin) `restoreProduct(id)` → `PATCH /api/products/{id}/restore`
	- [x] (Admin) `uploadImages(slug, formData)` → `POST /api/product-images/uploads/{slug}`
	- [x] (Admin) `updateImage(imageId, slug, formData)` → `POST /api/product-images/{imageId}/update/{slug}`
	- [x] (Admin) `deleteImage(imageId, productId)` → `DELETE /api/product-images/{imageId}/delete/{id}`
- [x] `api/orderService.js`:
	- [x] `checkout(data)` → `POST /api/orders/checkout`
	- [x] `trackOrder(data)` → `POST /api/orders/track`
	- [x] `requestCancel(data)` → `POST /api/orders/request-cancel`
	- [x] `confirmCancel(data)` → `POST /api/orders/confirm-cancel`
	- [x] (Admin) `getOrders(params)` → `GET /api/orders`
	- [x] (Admin) `getOrderById(id)` → `GET /api/orders/{id}`
	- [x] (Admin) `updateOrder(id, data)` → `PUT /api/orders/{id}`
	- [x] (Admin) `exportOrders()` → `GET /api/orders/export`
- [x] `api/authService.js`:
	- [x] `login(credentials)` → `POST /api/auth/login`
	- [x] `logout()` → `POST /api/auth/logout`
- [x] `api/dashboardService.js`:
	- [x] `getDashboard()` → `GET /api/dashboard`

---

## Phase 4 — Guest Pages (Target A–D)

### Target A — Duyệt sản phẩm & Danh mục

#### Trang chủ (`/`)
- [x] Hero banner section (ảnh + slogan + CTA "Xem sản phẩm")
- [x] Section danh mục nổi bật (grid cards, click → trang sản phẩm đã lọc)
- [x] Section sản phẩm nổi bật (grid 4–8 sản phẩm, sort by bán chạy)
- [x] Section "Sản phẩm mới" (sort by mới nhất)
- [x] Animations: fade-in on scroll, hover effects trên cards

#### Trang danh sách sản phẩm (`/products`)
- [ ] Sidebar bộ lọc (hoặc drawer trên mobile):
	- [ ] Lọc theo danh mục (checkbox list, gọi `GET /api/categories`)
	- [ ] Lọc theo khoảng giá (min/max inputs hoặc range slider)
- [ ] Thanh sắp xếp:
	- [ ] Mới nhất
	- [ ] Giá tăng dần
	- [ ] Giá giảm dần
	- [ ] Bán chạy nhất
- [ ] Thanh tìm kiếm (debounced, query param `search`)
- [ ] Product grid (responsive: 4 cols → 3 → 2 → 1)
- [ ] `ProductCard` component:
	- [ ] Ảnh thumbnail
	- [ ] Tên sản phẩm
	- [ ] Giá (hiển thị `sale_price` nếu có, gạch ngang `price`)
	- [ ] Badge "Hết hàng" nếu stock = 0
	- [ ] Nút "Thêm vào giỏ" (nhanh, không vào trang detail)
	- [ ] Hover effect: scale nhẹ + shadow
- [ ] Pagination (12 sp/trang, component `Pagination`)
- [ ] Loading skeleton khi fetch data
- [ ] Empty state khi không có kết quả

#### Trang chi tiết sản phẩm (`/products/:slug`)
- [x] Gallery ảnh (ảnh chính lớn + thumbnails phụ, click để đổi)
- [x] Thông tin sản phẩm:
	- [x] Tên
	- [x] Giá (sale_price nếu có + % giảm)
	- [x] Mô tả (render HTML an toàn)
	- [x] Tình trạng tồn kho (còn hàng/hết hàng, số lượng)
	- [x] Danh mục (link về danh sách đã lọc)
- [x] Chọn số lượng (input number, validate max = stock)
- [x] Nút "Thêm vào giỏ" (disabled nếu hết hàng)
- [x] Thông báo toast khi thêm thành công
- [ ] Breadcrumb: Trang chủ → Sản phẩm → [Tên SP]

---

### Target B — Giỏ hàng (Client-side)

#### Trang giỏ hàng (`/cart`)
- [x] Danh sách sản phẩm trong giỏ:
	- [x] Ảnh thumbnail
	- [x] Tên sản phẩm (link → detail)
	- [x] Đơn giá
	- [ ] Input số lượng (cập nhật realtime, validate max stock)
	- [x] Thành tiền = đơn giá × số lượng
	- [x] Nút xóa từng sản phẩm (với confirm)
- [x] Tổng cộng giỏ hàng (hiển thị rõ ràng)
- [x] Nút "Xóa toàn bộ giỏ" (với confirm modal)
- [x] Nút "Tiếp tục mua sắm" → quay lại `/products`
- [x] Nút "Tiến hành đặt hàng" → chuyển sang `/checkout`
- [x] Empty state khi giỏ trống (icon + thông báo + CTA mua sắm)
- [x] Responsive table → card layout trên mobile

---

### Target C — Đặt hàng / Guest Checkout

#### Trang checkout (`/checkout`)
- [x] Redirect về `/cart` nếu giỏ hàng trống
- [x] Form thông tin khách hàng:
	- [x] Họ tên (required)
	- [x] Số điện thoại (required, validate format VN)
	- [x] Email (required, validate format)
	- [x] Địa chỉ giao hàng (required)
	- [x] Ghi chú (optional, textarea)
- [x] Validation inline (hiển thị lỗi dưới mỗi field)
- [x] Chọn phương thức thanh toán:
	- [x] COD (Thanh toán khi nhận hàng)
	- [x] Chuyển khoản (hiển thị thông tin tài khoản ngân hàng)
- [x] Tóm tắt đơn hàng bên cạnh (sidebar hoặc accordion):
	- [x] Danh sách sản phẩm (ảnh nhỏ, tên, SL, giá)
	- [x] Tổng tiền
- [x] Nút "Đặt hàng" — loading state, disable khi đang submit
- [x] Gọi `POST /api/orders/checkout` với payload:
	```json
	{
	  "customer_name": "",
	  "customer_email": "",
	  "customer_phone": "",
	  "customer_address": "",
	  "note": "",
	  "payment_method": "cod|bank_transfer",
	  "cart": [
	    { "product_id": 1, "quantity": 2 }
	  ]
	}
	```
- [x] Xử lý lỗi từ server (stock không đủ, validation errors)

#### Trang đặt hàng thành công (`/order-success`)
- [x] Icon check thành công (animation)
- [x] Hiển thị mã đơn hàng (`order_code`) — nổi bật, có nút copy
- [x] Thông báo lưu mã đơn + email để tra cứu
- [x] Clear giỏ hàng (gọi `clearCart()`)
- [x] Nút "Tra cứu đơn hàng" → `/track-order`
- [x] Nút "Tiếp tục mua sắm" → `/products`

---

### Target D — Tra cứu đơn hàng (Guest)

#### Trang tra cứu (`/track-order`)
- [x] Form tra cứu:
	- [x] Input mã đơn hàng (required)
	- [x] Input email (required)
	- [x] Nút "Tra cứu"
- [x] Kết quả tra cứu (hiển thị bên dưới hoặc chuyển trang):
	- [x] Thông tin đơn hàng:
		- [x] Mã đơn, ngày đặt
		- [x] Trạng thái (badge màu theo status)
		- [x] Tên khách, SĐT, email, địa chỉ
		- [x] Phương thức thanh toán
		- [x] Ghi chú
	- [x] Danh sách sản phẩm (bảng: tên, SL, đơn giá, thành tiền)
	- [x] Tổng tiền
	- [x] Lịch sử trạng thái (timeline vertical)
- [x] Nút "Hủy đơn hàng" (chỉ hiện khi status = `pending`):
	- [x] Gọi `POST /api/orders/request-cancel` → gửi mã xác nhận qua email
	- [x] Hiển thị form nhập mã xác nhận (cancel_token)
	- [x] Gọi `POST /api/orders/confirm-cancel` để xác nhận hủy
	- [x] Thông báo toast khi hủy thành công
- [x] Loading state & Error handling (đơn không tìm thấy)

---

## Phase 5 — Admin Pages (Target E–I)

### Target E — Đăng nhập Admin

#### Trang Login (`/admin/login`)
- [x] Form đăng nhập:
	- [x] Input email
	- [x] Input password (toggle show/hide)
	- [x] Nút "Đăng nhập" (loading state)
- [x] Validation inline
- [x] Hiển thị lỗi từ server (sai credentials, rate limit)
- [x] Redirect về `/admin/dashboard` sau khi login thành công
- [x] Nếu đã login → auto redirect về dashboard

#### ProtectedRoute Component
- [x] Check `isAuthenticated` từ AuthContext
- [x] Nếu chưa login → redirect `/admin/login`
- [x] Wrap tất cả admin routes

---

### Target F — Quản lý Danh mục (Admin) #--current

#### Trang danh sách (`/admin/categories`)
- [x] Bảng danh mục:
	- [x] Cột: ID, Tên, Slug, Số sản phẩm, Trạng thái (active/deleted), Ngày tạo, Hành động
	- [x] Pagination
	- [x] Search bar (tìm theo tên)
- [x] Nút "Thêm danh mục" → mở modal/form
- [x] Hành động mỗi dòng:
	- [x] Sửa → mở modal/form pre-filled
	- [x] Xóa (soft delete) → confirm dialog
	- [x] Khôi phục (nếu đã xóa)
- [x] Toast thông báo sau mỗi action

#### Modal/Form Danh mục
- [x] Input tên danh mục (required, unique)
- [x] Input mô tả (optional, textarea)
- [x] Slug tự động generate (preview dưới input tên)
- [x] Toggle is_active
- [x] Nút Lưu / Hủy

---

### Target G — Quản lý Sản phẩm (Admin)

#### Trang danh sách (`/admin/products`)
- [x] Bảng sản phẩm:
	- [x] Cột: Ảnh, Tên, Danh mục, Giá, Giá KM, Tồn kho, Trạng thái, Hành động
	- [x] Highlight dòng khi stock ≤ 5 (cảnh báo sắp hết hàng, màu vàng/đỏ)
	- [x] Badge "Hết hàng" khi stock = 0
	- [x] Pagination
	- [x] Search bar
	- [x] Filter theo danh mục
- [x] Nút "Thêm sản phẩm" → chuyển trang hoặc modal

#### Trang/Modal tạo & sửa sản phẩm (`/admin/products/create`, `/admin/products/:id/edit`)
- [x] Form fields:
	- [x] Tên sản phẩm (required)
	- [x] Mô tả (rich textarea)
	- [x] Danh mục (select dropdown, lấy từ API)
	- [x] Giá gốc (required, number)
	- [x] Giá khuyến mãi (optional, number, < giá gốc)
	- [x] Tồn kho (required, number ≥ 0)
	- [x] Trạng thái (toggle is_active)
- [x] Quản lý ảnh:
	- [x] Upload nhiều ảnh (drag & drop hoặc file picker)
	- [x] Preview ảnh trước khi upload
	- [x] Đánh dấu ảnh chính (is_main)
	- [x] Xóa ảnh
	- [x] Hiển thị ảnh đã upload (khi edit)
- [x] Validation inline + server errors
- [x] Nút Lưu (loading state) / Hủy

---

### Target H — Quản lý Đơn hàng (Admin)

#### Trang danh sách (`/admin/orders`)
- [ ] Bảng đơn hàng:
	- [ ] Cột: Mã đơn, Khách hàng, SĐT, Tổng tiền, Thanh toán, Trạng thái, Ngày đặt, Hành động
	- [ ] Status badge (màu theo trạng thái):
		- `pending` → vàng
		- `confirmed` → xanh dương
		- `shipping` → tím
		- `delivered` → xanh lá
		- `cancelled` → đỏ
- [ ] Filters:
	- [ ] Theo trạng thái (tabs hoặc dropdown)
	- [ ] Theo ngày đặt (date range picker)
	- [ ] Theo từ khóa (mã đơn, tên khách, SĐT)
- [ ] Pagination
- [ ] Nút "Export CSV" → gọi `GET /api/orders/export`, download file

#### Trang/Modal chi tiết đơn hàng (`/admin/orders/:id`)
- [ ] Thông tin khách hàng:
	- [ ] Tên, SĐT, Email, Địa chỉ giao hàng, Ghi chú
- [ ] Danh sách sản phẩm (bảng: ảnh, tên, SL, đơn giá, thành tiền)
- [ ] Tổng tiền đơn hàng
- [ ] Phương thức thanh toán
- [ ] Cập nhật trạng thái:
	- [ ] Dropdown/buttons cho luồng: pending → confirmed → shipping → delivered
	- [ ] Nút "Hủy đơn" (nhập lý do, chỉ khi chưa delivered)
	- [ ] Confirm dialog trước khi đổi trạng thái
- [ ] Nút "Quay lại danh sách"

---

### Target I — Dashboard & Thống kê (Admin)

#### Trang Dashboard (`/admin/dashboard`)
- [x] Stat cards (grid 4 cột):
	- [x] Tổng đơn hàng hôm nay
	- [x] Doanh thu hôm nay
	- [x] Doanh thu tuần này
	- [x] Doanh thu tháng này
	- [x] Mỗi card có icon + animation count-up
- [x] Biểu đồ đơn hàng theo trạng thái (Pie chart hoặc Donut)
- [x] Biểu đồ doanh thu 7 ngày gần nhất (Line chart hoặc Bar chart) — `recharts`
- [x] Bảng Top 5 sản phẩm bán chạy (tên, SL đã bán, doanh thu)
- [x] Bảng sản phẩm sắp hết hàng (stock ≤ 5):
	- [x] Tên sản phẩm, tồn kho hiện tại
	- [x] Highlight đỏ khi stock ≤ 2
- [x] Auto-refresh data (dữ liệu cache 5 phút ở BE)

---

## Phase 6 — Polish & UX Enhancements

- [ ] Responsive design (test trên mobile, tablet, desktop)
- [ ] Dark mode toggle (optional bonus)
- [ ] Skeleton loading cho tất cả trang có fetch data
- [ ] Smooth page transitions (CSS transitions)
- [ ] Scroll to top khi chuyển trang
- [ ] SEO: meta tags cho các trang Guest
- [ ] Error boundary component (catch React errors)
- [ ] 404 Not Found page (thiết kế đẹp)
- [ ] Favicon + App title
- [ ] Accessibility: focus states, ARIA labels, keyboard navigation

---

## Tóm tắt Routes

| Route                        | Page                     | Phân quyền |
| ---------------------------- | ------------------------ | ---------- |
| `/`                          | Trang chủ                | Public     |
| `/products`                  | Danh sách sản phẩm       | Public     |
| `/products/:slug`            | Chi tiết sản phẩm        | Public     |
| `/cart`                      | Giỏ hàng                 | Public     |
| `/checkout`                  | Đặt hàng                 | Public     |
| `/order-success`             | Đặt hàng thành công      | Public     |
| `/track-order`               | Tra cứu đơn hàng         | Public     |
| `/admin/login`               | Đăng nhập Admin          | Public     |
| `/admin/dashboard`           | Dashboard                | Admin      |
| `/admin/categories`          | Quản lý danh mục         | Admin      |
| `/admin/products`            | Quản lý sản phẩm         | Admin      |
| `/admin/products/create`     | Tạo sản phẩm             | Admin      |
| `/admin/products/:id/edit`   | Sửa sản phẩm             | Admin      |
| `/admin/orders`              | Quản lý đơn hàng         | Admin      |
| `/admin/orders/:id`          | Chi tiết đơn hàng        | Admin      |
| `*`                          | 404 Not Found             | Public     |
