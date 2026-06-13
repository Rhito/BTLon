**2. PHẠM VI CHỨC NĂNG**  
**2.1. Vai trò trong hệ thống**  
Hệ thống chỉ có 2 vai trò:  
**• Guest (Khách mua hàng):** không cần đăng ký, có thể duyệt sản phẩm, thêm vào giỏ, đặt hàng. Khi checkout chỉ cần nhập họ tên, số điện thoại, email và địa chỉ giao hàng. Có thể tra cứu đơn hàng bằng _mã đơn + email_ đã dùng khi đặt.  
**• Admin (Quản trị viên):** đăng nhập qua trang riêng để quản lý toàn bộ hệ thống (danh mục, sản phẩm, đơn hàng).  
  
**Lưu ý quan trọng:** Hệ thống KHÔNG có chức năng đăng ký / quản lý người dùng cho khách hàng. Bảng _users_ chỉ chứa các tài khoản admin (được seed sẵn hoặc do super-admin tạo).  
**2.2. Tính năng phía Guest (khách mua hàng)**  
**A. Duyệt sản phẩm & danh mục**  
**•**  Trang chủ: sản phẩm nổi bật, danh mục, banner.  
**•**  Danh sách sản phẩm với pagination (12 sp/trang).  
**•**  Tìm kiếm theo tên sản phẩm.  
**•**  Lọc theo: danh mục, khoảng giá.  
**•**  Sắp xếp: mới nhất, giá tăng/giảm, bán chạy.  
**•**  Trang chi tiết sản phẩm: ảnh, mô tả, giá, tồn kho, nút thêm vào giỏ.  
  
**B. Giỏ hàng (lưu phía client)**  
**•**  Cart lưu trong localStorage / Context, không cần gọi API và không cần đăng nhập.  
**•**  Thêm sản phẩm vào giỏ (kiểm tra tồn kho trước khi thêm bằng API check).  
**•**  Cập nhật số lượng, xóa sản phẩm khỏi giỏ.  
**•**  Tự động tính tổng tiền, hiển thị badge số lượng trên icon giỏ.  
**•**  Giữ giỏ hàng khi reload trang (persist localStorage).  
**•**  Có nút "Xóa toàn bộ giỏ".  
  
**C. Đặt hàng (Guest Checkout)**  
**•**  Trang checkout: form nhập họ tên, số điện thoại, email, địa chỉ giao hàng, ghi chú.  
**•**  Chọn phương thức thanh toán: COD hoặc chuyển khoản (hiển thị thông tin tài khoản).  
**•**  Khi submit: gửi 1 request POST /api/v1/orders với thông tin khách + danh sách sản phẩm trong giỏ.  
**•**  Backend validate: kiểm tra tồn kho, tính lại tổng tiền theo giá hiện tại (không tin client), tạo order trong transaction.  
**•**  Sau khi đặt thành công: hiển thị trang "Đặt hàng thành công" với mã đơn (order_code), khuyến khích lưu lại mã + email để tra cứu.  
**•**  Xóa giỏ hàng phía client sau khi đặt thành công.  
  
**D. Tra cứu đơn hàng**  
**•**  Trang "Tra cứu đơn hàng": form nhập mã đơn + email.  
**•**  Hệ thống kiểm tra và trả về thông tin đơn nếu khớp cả mã đơn và email.  
**•**  Hiển thị: trạng thái, danh sách sản phẩm, tổng tiền, thông tin giao hàng, lịch sử trạng thái.  
**•**  Cho phép guest hủy đơn nếu đơn đang ở trạng thái pending (cần xác nhận lại bằng email).  
  
**2.3. Tính năng phía Admin**  
**E. Đăng nhập Admin**  
**•**  Trang đăng nhập riêng (/admin/login).  
**•**  Sử dụng Laravel Sanctum, trả về token; lưu token ở localStorage / httpOnly cookie.  
**•**  Rate limit cho endpoint login (chống brute-force).  
**•**  Đăng xuất, thu hồi token.  
**•**  Admin được tạo sẵn qua seeder (mặc định 1 admin: admin@shopmini.test / password).  
  
**F. Quản lý Danh mục**  
**•**  CRUD danh mục: tạo, sửa, xóa (soft delete), liệt kê có pagination, search.  
**•**  Validation: tên duy nhất, slug tự động generate từ tên.  
**•**  Hiển thị số sản phẩm trong mỗi danh mục.  
  
**G. Quản lý Sản phẩm**  
**•**  CRUD sản phẩm: name, slug, description, price, sale_price, stock, category_id, is_active.  
**•**  Upload và resize ảnh (Intervention Image): ảnh gốc + thumbnail 300x300. 
**•**  Mỗi sản phẩm có thể có nhiều ảnh (1 ảnh chính + nhiều ảnh phụ).   
**•**  Form Request validate; Policy đảm bảo chỉ admin được CRUD.  
**•**  Hiển thị cảnh báo khi stock ≤ 5 (sắp hết).  
  
**H. Quản lý Đơn hàng**  
**•**  Liệt kê tất cả đơn hàng với filter theo trạng thái, ngày đặt, từ khóa (mã đơn, tên khách, sđt).  
**•**  Xem chi tiết đơn hàng: thông tin khách, sản phẩm, tổng tiền, ghi chú.  
**•**  Cập nhật trạng thái: pending → confirmed → shipping → delivered, hoặc cancelled (kèm lý do).  
**•**  Mỗi lần đổi trạng thái: ghi log lịch sử (admin nào đổi, vào lúc nào, từ trạng thái nào).  
**•**  Export đơn hàng ra CSV (bonus).  
  
**I. Dashboard & Thống kê (cơ bản)**  
**•**  Tổng số đơn hàng / doanh thu hôm nay / tuần này / tháng này.  
**•**  Số đơn hàng theo từng trạng thái.  
**•**  Top 5 sản phẩm bán chạy.  
**•**  Sản phẩm sắp hết hàng (stock ≤ 5).  
**•**  Biểu đồ doanh thu 7 ngày gần nhất (bonus).