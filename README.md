# Gundam Universe Store

Website bán hàng và sàn trao đổi giao dịch Gundam, được xây dựng theo hướng full-stack thực tế với kiến trúc module hóa, UI phong cách mecha/HUD/futuristic, có thể dùng cho đồ án và tiếp tục mở rộng thành sản phẩm thật.

## Mục lục

- [1. Tổng quan](#1-tổng-quan)
- [2. Tính năng chính](#2-tính-năng-chính)
- [3. Công nghệ sử dụng](#3-công-nghệ-sử-dụng)
- [4. Kiến trúc hệ thống](#4-kiến-trúc-hệ-thống)
- [5. Cấu trúc thư mục](#5-cấu-trúc-thư-mục)
- [6. Domain và dữ liệu chính](#6-domain-và-dữ-liệu-chính)
- [7. API nổi bật](#7-api-nổi-bật)
- [8. Bảo mật và hiệu suất](#8-bảo-mật-và-hiệu-suất)
- [9. Thiết kế UI/UX](#9-thiết-kế-uiux)
- [10. Cài đặt local](#10-cài-đặt-local)
- [11. Biến môi trường](#11-biến-môi-trường)
- [12. Seed dữ liệu](#12-seed-dữ-liệu)
- [13. Deploy](#13-deploy)
- [14. Trạng thái hiện tại](#14-trạng-thái-hiện-tại)
- [15. Hướng phát triển tiếp theo](#15-hướng-phát-triển-tiếp-theo)

## 1. Tổng quan

`Gundam Universe Store` kết hợp 2 mảng chính trong cùng một hệ thống:

- `Website bán hàng Gundam`: duyệt sản phẩm, tìm kiếm, lọc, giỏ hàng, thanh toán, lịch sử mua hàng, đánh giá, wishlist.
- `Sàn trao đổi Gundam`: đăng tin trao đổi, gửi đề nghị trade, thương lượng realtime qua chat, báo cáo vi phạm, theo dõi lịch sử trao đổi.

Mục tiêu của dự án là tạo ra một hệ thống:

- có kiến trúc đủ sạch để bảo trì và mở rộng
- có UI đậm chất Gundam/mecha/sci-fi
- có thể deploy thực tế với `Vercel + Render + MongoDB Atlas + Cloudinary`
- phù hợp cho đồ án nhưng không dừng ở mức demo sơ sài

## 2. Tính năng chính

### 2.1. Xác thực và tài khoản

- Đăng ký
- Đăng nhập
- Đăng xuất
- Refresh token
- Quên mật khẩu
- Đặt lại mật khẩu
- Đổi mật khẩu
- Cập nhật hồ sơ người dùng
- Upload avatar qua Cloudinary
- Ghi nhớ email đăng nhập và phục hồi session
- Phân quyền theo vai trò:
  - `guest`
  - `customer`
  - `seller`
  - `trader`
  - `admin`

### 2.2. Website bán hàng

- Trang chủ
- Danh mục sản phẩm
- Tìm kiếm, lọc, sắp xếp
- Chi tiết sản phẩm
- Gợi ý sản phẩm liên quan
- Định giá mô phỏng rare item
- Giỏ hàng
- Checkout
- Lịch sử đơn hàng
- Chi tiết đơn hàng / tracking cơ bản
- Wishlist
- Review sản phẩm

### 2.3. Sàn trao đổi

- Đăng trade listing
- Upload ảnh thật cho listing
- Gửi trade offer
- Upload ảnh cho offer
- Chấp nhận / từ chối đề nghị trao đổi
- Chat realtime theo conversation
- Báo cáo listing vi phạm
- Gợi ý trade theo wishlist / collector profile

### 2.4. Seller

- Dashboard seller
- Theo dõi doanh thu, đơn hàng, tồn kho
- Quản lý sản phẩm seller
- Quản lý trạng thái và stock sản phẩm
- Quản lý đơn hàng liên quan đến inventory của seller
- Xem tín hiệu trade gần đây

### 2.5. Admin

- Dashboard thống kê cơ bản
- Quản lý user
- Quản lý category
- Quản lý product
- Quản lý order
- Quản lý trade listing
- Moderation trade status
- Quản lý report vi phạm
- Ghi chú xử lý report

### 2.6. Trải nghiệm người dùng

- Giao diện responsive cho mobile, tablet, desktop
- Tối ưu khi chia đôi màn hình hoặc dùng cùng ứng dụng khác
- Ghi nhớ state cho:
  - auth
  - cart
  - wishlist
  - notifications
  - order hiện tại
  - trade draft
  - checkout draft
  - chat draft theo conversation

## 3. Công nghệ sử dụng

### Frontend

- `React 18`
- `Vite`
- `TailwindCSS`
- `Framer Motion`
- `React Router DOM`
- `Zustand`
- `Axios`
- `Socket.io Client`

### Backend

- `Node.js`
- `Express 5`
- `MongoDB Atlas`
- `Mongoose`
- `Socket.io`
- `JWT`
- `Joi`
- `bcrypt`
- `Multer`
- `Cloudinary`

### Hạ tầng

- `Vercel` cho frontend
- `Render` cho backend + websocket
- `MongoDB Atlas` cho database
- `Cloudinary` cho media upload

## 4. Kiến trúc hệ thống

### 4.1. Kiến trúc tổng thể

- Frontend React gọi REST API qua Axios.
- Backend Express xử lý business logic theo module/domain.
- MongoDB lưu dữ liệu nghiệp vụ.
- Socket.io phục vụ realtime chat và notification event.
- Cloudinary lưu ảnh cho avatar, product, trade listing, trade offer.

### 4.2. Nguyên tắc thiết kế

- `OOP`: service/controller/repository rõ trách nhiệm
- `SOLID`: giảm coupling, tách logic theo domain
- `DRY`: tái sử dụng store, service, middleware, helper
- `KISS`: tránh controller phình to, tránh nesting sâu không cần thiết
- `Clean Code`: tách route/controller/service/repository/model/validator/middleware

### 4.3. Data flow

1. User thao tác từ frontend.
2. Frontend gửi request đến API.
3. Route chuyển vào controller.
4. Controller gọi service.
5. Service xử lý nghiệp vụ, truy cập repository/model.
6. Repository thao tác MongoDB.
7. Response trả về frontend theo format thống nhất.
8. Với chat/notification, backend phát thêm event qua Socket.io.

## 5. Cấu trúc thư mục

```text
Gundam_Universe_Store/
├─ client/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ config/
│  │  ├─ guards/
│  │  ├─ pages/
│  │  ├─ services/
│  │  ├─ shared/
│  │  ├─ stores/
│  │  ├─ styles/
│  │  ├─ utils/
│  │  ├─ App.jsx
│  │  └─ Router.jsx
│  ├─ .env.example
│  ├─ package.json
│  └─ vercel.json
├─ server/
│  ├─ scripts/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ modules/
│  │  │  ├─ admin/
│  │  │  ├─ auth/
│  │  │  ├─ cart/
│  │  │  ├─ chat/
│  │  │  ├─ notification/
│  │  │  ├─ order/
│  │  │  ├─ product/
│  │  │  ├─ report/
│  │  │  ├─ review/
│  │  │  ├─ seller/
│  │  │  ├─ trade/
│  │  │  ├─ upload/
│  │  │  ├─ user/
│  │  │  └─ wishlist/
│  │  └─ shared/
│  ├─ .env.example
│  └─ package.json
├─ DEPLOYMENT.md
├─ render.yaml
└─ README.md
```

## 6. Domain và dữ liệu chính

### 6.1. Collection chính

- `users`
- `categories`
- `products`
- `carts`
- `orders`
- `reviews`
- `wishlists`
- `tradeListings`
- `tradeOffers`
- `conversations`
- `messages`
- `notifications`
- `reports`

### 6.2. Quan hệ chính

- `User -> Product`: one-to-many qua `seller`
- `User -> Order`: one-to-many
- `User -> Wishlist`: one-to-one
- `Product -> Review`: one-to-many
- `TradeListing -> TradeOffer`: one-to-many
- `TradeOffer -> Conversation`: one-to-one gần đúng
- `Conversation -> Message`: one-to-many

### 6.3. Embed và reference

#### Embed

- `order.items`: snapshot item tại thời điểm thanh toán
- `product.images`
- `tradeListing.images`
- `tradeOffer.images`
- `shippingAddress` trong order

#### Reference

- `product.category`
- `product.seller`
- `order.user`
- `wishlist.products`
- `tradeListing.owner`
- `tradeOffer.offerer`
- `conversation.participants`
- `message.sender`
- `report.reporter`

## 7. API nổi bật

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh-token`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `PUT /api/auth/change-password`

### User

- `GET /api/users/me`
- `PUT /api/users/me`
- `PATCH /api/users/me/avatar`

### Product / Shop

- `GET /api/products`
- `GET /api/products/:slug`
- `GET /api/products/:slug/recommendations`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Cart / Order

- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:productId`
- `DELETE /api/cart/items/:productId`
- `POST /api/orders/checkout`
- `GET /api/orders/history`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`

### Trade

- `GET /api/trades`
- `GET /api/trades/:id`
- `POST /api/trades`
- `POST /api/trades/:id/offers`
- `GET /api/trades/:id/offers`
- `PATCH /api/trades/:id/offers/:offerId/status`
- `GET /api/trades/offers/me`
- `GET /api/trades/suggestions/me`
- `POST /api/trades/:id/report`

### Notification / Report / Seller / Admin

- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `POST /api/notifications/read-all`
- `GET /api/reports`
- `PATCH /api/reports/:id/status`
- `GET /api/seller/dashboard`
- `GET /api/seller/products`
- `PATCH /api/seller/products/:id`
- `GET /api/seller/orders`
- `PATCH /api/seller/orders/:id/status`
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/orders`
- `GET /api/admin/trades`
- `PATCH /api/admin/trades/:id/status`

## 8. Bảo mật và hiệu suất

### 8.1. Bảo mật

- Băm mật khẩu bằng `bcrypt`
- `JWT access token` + `refresh token`
- Refresh token rotation
- Rate limit cho API và auth
- `helmet` cho security headers
- `express-mongo-sanitize` chống NoSQL injection
- `hpp` chống HTTP parameter pollution
- Validate request bằng `Joi`
- Role guard cho seller/admin
- Upload được kiểm soát qua middleware
- Không trả stack trace nhạy cảm ra client

### 8.2. Hiệu suất

- Pagination cho product và trade listing
- Index MongoDB cho text search, price, seller, category, trade status
- Gzip compression
- Lazy loading page trên frontend
- Payload response tương đối gọn
- Realtime chat theo conversation room
- Persist state phía client để giảm UX friction

## 9. Thiết kế UI/UX

### Visual direction

- Tông màu: navy, charcoal, metallic gray
- Điểm nhấn: cyan, red, amber
- Phong cách: tactical HUD, cockpit panel, sci-fi interface

### Pattern chính

- Card viền phát sáng nhẹ
- Panel kính tối kiểu hệ điều khiển
- Button hover glow / shine
- Badge trạng thái kiểu mission control
- Loading state và skeleton gọn
- Hero section, chat panel, admin dashboard và trade UI đồng nhất chủ đề Gundam

## 10. Cài đặt local

### 10.1. Yêu cầu môi trường

- `Node.js >= 18`
- `npm`
- `MongoDB Atlas` hoặc MongoDB local
- `Cloudinary` nếu muốn dùng upload ảnh thật

### 10.2. Clone dự án

```bash
git clone https://github.com/KasierBach/Gundam_Universe_Store.git
cd Gundam_Universe_Store
```

### 10.3. Cài dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 10.4. Chạy backend

```bash
cd server
npm run dev
```

Mặc định backend chạy ở:

- `http://localhost:5001`

Health check:

- `http://localhost:5001/api/health`

### 10.5. Chạy frontend

```bash
cd client
npm run dev
```

Mặc định frontend chạy ở:

- `http://localhost:4000` hoặc port do Vite cấp

## 11. Biến môi trường

### 11.1. Backend

Tạo file `server/.env` từ `server/.env.example`.

```env
NODE_ENV=development
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:4000
CLIENT_URLS=http://localhost:4000,https://your-project.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 11.2. Frontend

Tạo file `client/.env` từ `client/.env.example`.

```env
VITE_API_URL=/api
VITE_SOCKET_URL=http://localhost:5001
VITE_DEV_API_TARGET=http://localhost:5001
```

## 12. Seed dữ liệu

### Seed tài khoản admin

```bash
cd server
npm run seed:admin
```

Thông tin mặc định:

- Email: `admin@gundamuniverse.com`
- Password: `Admin@123456`

### Seed dữ liệu sản phẩm mẫu

```bash
cd server
npm run seed:data
```

Seed hiện tại bao gồm catalog Gundam thực tế hơn với các dòng như:

- HG
- RG
- MG
- PG
- MGEX

## 13. Deploy

Phương án deploy được chuẩn bị sẵn cho:

- Frontend: `Vercel`
- Backend: `Render`
- Database: `MongoDB Atlas`
- Media: `Cloudinary`

Tài liệu chi tiết:

- [DEPLOYMENT.md](./DEPLOYMENT.md)

File hỗ trợ deploy:

- [render.yaml](./render.yaml)
- [client/vercel.json](./client/vercel.json)

## 14. Trạng thái hiện tại

Dự án hiện ở mức:

- `MVP mạnh`, có thể demo end-to-end phần lớn flow chính
- kiến trúc backend tương đối sạch
- frontend có bản sắc Gundam rõ ràng
- đã có nền tảng deploy thực tế

### Đã có tương đối đầy đủ

- auth
- profile
- product listing
- cart
- checkout
- order history
- trade listing
- trade offer
- chat realtime
- wishlist
- notifications
- seller dashboard
- admin management cơ bản

### Chưa full 100% production

- chưa có test suite bài bản
- dispute workflow còn có thể làm sâu hơn
- community layer còn mỏng
- recommendation engine mới ở mức heuristic/MVP
- notification realtime toàn app có thể mở rộng thêm

## 15. Hướng phát triển tiếp theo

- Bổ sung unit test, integration test, e2e test
- Xây dispute workflow nhiều bước
- Mở rộng recommendation engine theo hành vi người dùng
- Xây community feed / collector showcase
- Thêm analytics nâng cao cho seller và admin
- Tối ưu notification center và realtime event
- Tách upload module hoàn chỉnh hơn
- Bổ sung email service thật cho reset password

---

Nếu bạn dùng repo này cho đồ án, README hiện tại đủ để:

- giới thiệu hệ thống
- mô tả kiến trúc
- hướng dẫn cài đặt
- hướng dẫn seed dữ liệu
- hướng dẫn deploy
- mô tả rõ phạm vi hiện tại của dự án
