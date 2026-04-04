# Deploy Gundam Universe Store

Tai lieu nay chot theo phuong an:

- Frontend: Vercel
- Backend + Socket.io: Render
- Database: MongoDB Atlas
- Media upload: Cloudinary

## 1. Backend tren Render

### Cach tao service

1. Push repo len GitHub.
2. Vao Render, chon `New +` -> `Blueprint` neu muon dung [render.yaml](/D:/Gundam_Universe_Store/render.yaml), hoac `Web Service` neu muon tao tay.
3. Neu tao tay:
   - Root Directory: `server`
   - Build Command: `npm ci`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`

### Environment variables can set tren Render

Can set cac bien sau:

```env
NODE_ENV=production
MONGODB_URI=<mongodb atlas uri>
JWT_ACCESS_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=<cloud name>
CLOUDINARY_API_KEY=<api key>
CLOUDINARY_API_SECRET=<api secret>
CLIENT_URL=https://your-project.vercel.app
CLIENT_URLS=https://your-project.vercel.app,https://your-custom-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Ghi chu:

- `PORT` khong can khai bao tren Render. Render se inject san.
- `CLIENT_URLS` dung khi ban muon cho phep nhieu origin frontend.

### Sau khi deploy backend

Kiem tra:

- `https://your-render-service.onrender.com/api/health`

Neu health check tra ve JSON thanh cong thi backend san sang.

## 2. Frontend tren Vercel

### Project settings

1. Import repo vao Vercel.
2. Chon Root Directory la `client`.
3. Framework Preset: `Vite`.  
4. Build Command: `npm run build`
5. Output Directory: `dist`

File [client/vercel.json](/D:/Gundam_Universe_Store/client/vercel.json) da duoc them de SPA route nhu `/trade`, `/orders/123`, `/admin/reports` khong bi 404 khi refresh.

### Environment variables can set tren Vercel

```env
VITE_API_URL=https://your-render-service.onrender.com/api
VITE_SOCKET_URL=https://your-render-service.onrender.com
```

Khuyen nghi:

- Khi co custom domain cho frontend, them domain do vao `CLIENT_URLS` tren Render.
- Neu ban tao preview environments, co the bo sung them preview domain vao `CLIENT_URLS`.

## 3. MongoDB Atlas

Can dam bao:

- IP access cho phep Render ket noi.
- Database user co quyen doc/ghi dung database cua du an.
- Connection string dung database production rieng, khong xai chung local.

## 4. Cloudinary

Can tao:

- Cloud name
- API key
- API secret

Sau do nap vao env tren Render.

## 5. Local env mau

- Backend mau: [server/.env.example](/D:/Gundam_Universe_Store/server/.env.example)
- Frontend mau: [client/.env.example](/D:/Gundam_Universe_Store/client/.env.example)

## 6. Thu tu deploy khuyen nghi

1. Deploy backend tren Render.
2. Lay URL Render production.
3. Set `VITE_API_URL` va `VITE_SOCKET_URL` tren Vercel.
4. Deploy frontend tren Vercel.
5. Copy URL Vercel production vao `CLIENT_URL` va `CLIENT_URLS` tren Render.
6. Redeploy Render de CORS/socket ap dung origin moi.

## 7. Checklist smoke test sau deploy

Kiem tra cac flow sau:

1. Mo trang chu va product listing.
2. Dang ky / dang nhap / refresh token.
3. Them vao gio hang va checkout.
4. Tao trade listing va gui trade offer.
5. Vao chat sau khi offer duoc tao.
6. Admin login va mo dashboard.
7. Upload avatar va upload anh san pham neu dung Cloudinary.

## 8. Luu y production

- Render free plan co the cold start, request dau tien se cham hon.
- Socket.io se on dinh hon neu dung plan khong bi sleep.
- Nen tao JWT secret dai, ngau nhien.
- Nen dung custom domain cho frontend roi bo sung vao `CLIENT_URLS`.
