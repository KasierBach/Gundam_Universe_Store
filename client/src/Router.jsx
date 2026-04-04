import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import AuthGuard from './guards/AuthGuard'
import GuestGuard from './guards/GuestGuard'
import RoleGuard from './guards/RoleGuard'

const HomePage = lazy(() => import('./pages/Home/HomePage'))
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/Auth/ResetPasswordPage'))
const ProductPage = lazy(() => import('./pages/Products/ProductPage'))
const ProductDetailPage = lazy(() => import('./pages/Products/ProductDetailPage'))
const CheckoutPage = lazy(() => import('./pages/Order/CheckoutPage'))
const OrdersPage = lazy(() => import('./pages/Order/OrdersPage'))
const OrderDetailPage = lazy(() => import('./pages/Order/OrderDetailPage'))
const CartPage = lazy(() => import('./pages/Cart/CartPage'))
const TradeMarketPage = lazy(() => import('./pages/Trade/TradeMarketPage'))
const TradeDetailPage = lazy(() => import('./pages/Trade/TradeDetailPage'))
const CreateTradePage = lazy(() => import('./pages/Trade/CreateTradePage'))
const ChatConsole = lazy(() => import('./pages/Chat/ChatConsole'))
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'))
const MyTradesPage = lazy(() => import('./pages/Profile/MyTradesPage'))
const PublicProfilePage = lazy(() => import('./pages/Profile/PublicProfilePage'))
const WishlistPage = lazy(() => import('./pages/Wishlist/WishlistPage'))
const SellerDashboardPage = lazy(() => import('./pages/Seller/SellerDashboardPage'))
const NotificationPage = lazy(() => import('./pages/Notifications/NotificationPage'))
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))
const ProductManagementPage = lazy(() => import('./pages/Admin/ProductManagementPage'))
const CategoryManagementPage = lazy(() => import('./pages/Admin/CategoryManagementPage'))
const UserManagementPage = lazy(() => import('./pages/Admin/UserManagementPage'))
const TradeModerationPage = lazy(() => import('./pages/Admin/TradeModerationPage'))
const OrderManagementPage = lazy(() => import('./pages/Admin/OrderManagementPage'))
const ReportManagementPage = lazy(() => import('./pages/Admin/ReportManagementPage'))

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gundam-bg-primary">
          <div className="w-12 h-12 border-4 border-gundam-cyan border-t-transparent rounded-full animate-spin shadow-cyan-glow" />
        </div>
      }>
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ProductPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/trade" element={<TradeMarketPage />} />
          <Route path="/trade/:id" element={<TradeDetailPage />} />
          
          {/* Protected Trade Routes */}
          <Route
            path="/trade/new"
            element={
              <AuthGuard>
                <CreateTradePage />
              </AuthGuard>
            }
          />

          
          {/* Guest Routes (Login/Register) */}
          <Route
            path="/login"
            element={
              <GuestGuard>
                <LoginPage />
              </GuestGuard>
            }
          />
          <Route
            path="/register"
            element={
              <GuestGuard>
                <RegisterPage />
              </GuestGuard>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestGuard>
                <ForgotPasswordPage />
              </GuestGuard>
            }
          />
          <Route
            path="/reset-password"
            element={
              <GuestGuard>
                <ResetPasswordPage />
              </GuestGuard>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <AuthGuard>
                <CartPage />
              </AuthGuard>
            }
          />
          <Route
            path="/checkout"
            element={
              <AuthGuard>
                <CheckoutPage />
              </AuthGuard>
            }
          />
          <Route
            path="/orders"
            element={
              <AuthGuard>
                <OrdersPage />
              </AuthGuard>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <AuthGuard>
                <OrderDetailPage />
              </AuthGuard>
            }
          />
          <Route
            path="/wishlist"
            element={
              <AuthGuard>
                <WishlistPage />
              </AuthGuard>
            }
          />
          <Route
            path="/notifications"
            element={
              <AuthGuard>
                <NotificationPage />
              </AuthGuard>
            }
          />
          <Route
            path="/chat"
            element={
              <AuthGuard>
                <ChatConsole />
              </AuthGuard>
            }
          />

          <Route
            path="/profile"
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            }
          />
          <Route
            path="/profile/trades"
            element={
              <AuthGuard>
                <MyTradesPage />
              </AuthGuard>
            }
          />
          <Route path="/seller/:id" element={<PublicProfilePage />} />
          <Route
            path="/seller/dashboard"
            element={
              <RoleGuard allowedRoles={['seller', 'admin']}>
                <SellerDashboardPage />
              </RoleGuard>
            }
          />

          {/* Admin Routes Example */}
          <Route
            path="/admin"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/products"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <ProductManagementPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <CategoryManagementPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <UserManagementPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <OrderManagementPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <ReportManagementPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/trades"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <TradeModerationPage />
              </RoleGuard>
            }
          />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default Router
