# Garden Care Rebuild Blueprint (Repo-fit)

## 1) Muc tieu
Tai cau truc va nang cap du an Garden Care theo huong production-ready, giu tuong thich voi frontend hien tai, bo sung nghiep vu booking day du cho 3 vai tro: customer, staff, admin.

## 2) Kien truc chuan
- Backend: Node.js + Express + MySQL
- Kieu: MVC + RESTful API
- Auth: JWT Bearer
- Validate: Joi
- Upload: local storage (co san), co the nang cap Cloudinary sau
- Frontend: React + Vite

## 3) Scope rebuild theo phase

### Phase A (bat buoc)
- Chuan hoa database schema (3NF) + FK + index
- Hoan thien booking workflow:
  - pending -> confirmed -> in_progress -> completed / cancelled
- Bo sung assign staff cho booking
- Bo sung completion_note, before_image, after_image
- Bo sung endpoint admin bookings
- Giu backward compatibility cho API dang duoc frontend goi

### Phase B
- Service filter/search/sort/rating
- Thong bao he thong co ban (notifications table + insert khi state change)
- Dashboard thong ke dung nghiep vu

### Phase C
- Socket.io realtime notifications
- Payment gateway that (VNPay/Momo)
- Audit logging + error tracking

## 4) API contract can giu tuong thich
- GET /api/bookings
- POST /api/bookings
- PUT /api/bookings/:id/status
- PUT /api/bookings/:id/payment
- DELETE /api/bookings/:id

## 5) API moi bo sung
- GET /api/admin/bookings
- PUT /api/bookings/:id/assign-staff
- PUT /api/bookings/:id/completion

## 6) Rule role-based
- Customer:
  - Tao booking
  - Xem booking cua chinh minh
  - Huy booking neu dang pending/confirmed va la chu booking
- Staff:
  - Xem booking da assign cho minh (va booking chua assign de admin nhin)
  - Cap nhat trang thai theo workflow duoc phep
  - Cap nhat ghi chu hoan thanh + anh
- Admin:
  - Xem toan bo booking
  - Assign staff
  - Cap nhat moi trang thai hop le
  - Cap nhat payment status

## 7) Definition of Done
- Co file SQL khoi tao schema day du
- API booking/admin chay theo workflow moi
- Frontend staff/admin load booking khong loi
- Test backend pass
- README cap nhat huong dan chay

## 8) Quy uoc response
- Thanh cong:
  {
    "success": true,
    "message": "...",
    "data": {...},
    "pagination": {...}
  }
- Loi:
  {
    "success": false,
    "message": "..."
  }

## 9) Chi tiet nong can fix ngay (hien trang)
- Thieu schema SQL tao bang goc
- booking status chua co in_progress
- Chua co assign staff trong API
- Frontend admin dashboard goi /api/admin/bookings nhung backend chua co
- Staff page cho phep update status qua rong, chua rang buoc theo workflow

## 10) Demo focus
- Uu tien cho demo: auth, booking workflow, assign staff, revenue summary.
- Neu can demo nhanh, bo qua phan realtime va gateway thanh toan.
