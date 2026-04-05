import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiTruck, FiCreditCard, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import useCartStore from '../../stores/cartStore';
import useOrderStore from '../../stores/orderStore';
import ModelKitImage from '../../components/shared/ModelKitImage';
import useUiStore from '../../stores/uiStore';
import { useI18n } from '../../i18n/I18nProvider';
import { normalizeLocaleCopy } from '../../i18n/normalizeLocaleCopy';

const CheckoutPage = () => {
  const { locale } = useI18n();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, fetchCart } = useCartStore();
  const { checkout, loading } = useOrderStore();
  const { checkoutDraft, setCheckoutDraft, clearCheckoutDraft } = useUiStore();

  const [formData, setFormData] = useState({
    fullName: checkoutDraft.fullName,
    phone: checkoutDraft.phone,
    address: checkoutDraft.address,
    city: checkoutDraft.city,
    notes: checkoutDraft.notes,
    paymentMethod: checkoutDraft.paymentMethod
  });
  const copy = normalizeLocaleCopy(locale === 'vi'
    ? {
      title: 'XÁC NHẬN TRIỂN KHAI',
      subtitle: 'Khu vực: Thanh toán / Yêu cầu xác thực',
      verified: 'GIỎ HÀNG ĐÃ XÁC MINH',
      confirmation: 'XÁC NHẬN ĐƠN HÀNG',
      shippingTitle: 'Tọa độ giao hàng',
      fields: {
        fullName: 'Họ tên người nhận',
        phone: 'Số điện thoại',
        address: 'Địa chỉ nhận hàng',
        city: 'Thành phố / khu vực',
      },
      placeholders: {
        fullName: 'Ví dụ: Nguyễn Văn A',
        phone: '098-XXX-XXXX',
        address: 'Số nhà, đường, phường/xã...',
        city: 'TP. Hồ Chí Minh',
      },
      paymentTitle: 'Phương thức thanh toán',
      paymentMethods: {
        COD: 'Thanh toán khi nhận hàng',
        BANK_TRANSFER: 'Chuyển khoản ngân hàng',
      },
      unitsTitle: 'Sản phẩm đã chọn',
      qty: 'SL',
      subtotal: 'Tạm tính',
      shipping: 'Vận chuyển',
      free: 'Miễn phí',
      total: 'Tổng cộng',
      syncing: 'ĐANG ĐỒNG BỘ...',
      confirm: 'XÁC NHẬN ĐẶT HÀNG',
      footer: 'Thông tin xác nhận được bảo vệ bởi giao thức bảo mật nội bộ.',
    }
    : {
      title: 'MISSION DEPLOYMENT',
      subtitle: 'Sector: Checkout / Authorization Required',
      verified: 'CART VERIFIED',
      confirmation: 'DEPLOYMENT CONFIRMATION',
      shippingTitle: 'Shipping Coordinates',
      fields: {
        fullName: 'Pilot Full Name',
        phone: 'Comm Link (Phone)',
        address: 'Drop Zone (Address)',
        city: 'City / Colony',
      },
      placeholders: {
        fullName: 'E.G. AMURO RAY',
        phone: '098-XXX-XXXX',
        address: 'UNIT 01, WHITE BASE SECTOR',
        city: 'SIDE 7',
      },
      paymentTitle: 'Energy Transfer (Payment)',
      paymentMethods: {
        COD: 'Tactical Cash (COD)',
        BANK_TRANSFER: 'Neutral Bank Transfer',
      },
      unitsTitle: 'Loaded Units',
      qty: 'QTY',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'FREE',
      total: 'Total Power',
      syncing: 'SYNCING DATA...',
      confirm: 'CONFIRM DEPLOYMENT',
      footer: 'Authorized signature encrypted via UC-Protocol v2.4',
    });

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (items.length === 0 && !loading) {
      // navigate('/shop');
    }
  }, [items, navigate, loading]);

  const handleChange = (e) => {
    const nextState = { ...formData, [e.target.name]: e.target.value };
    setFormData(nextState);
    setCheckoutDraft(nextState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await checkout({
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      });
      clearCheckoutDraft();
      // Success: Cart is cleared by store/service
      navigate('/orders');
    } catch (error) {
      console.error('Deployment failed:', error);
    }
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-gundam-bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header HUD */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cyan-500/20 pb-8">
          <div>
            <h1 className="text-4xl font-black font-orbitron tracking-tighter text-white mb-2">{copy.title}</h1>
            <p className="text-cyan-400 font-rajdhani uppercase tracking-[0.3em] text-sm opacity-70">{copy.subtitle}</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {copy.verified}
            </div>
            <FiChevronRight className="text-gray-600" />
            <div className="text-gray-500 italic">{copy.confirmation}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Shipping HUD */}
          <div className="lg:col-span-2 space-y-8">
            <section className="glass-card p-8 border-cyan-500/20 bg-cyan-950/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500/50" />
              <h3 className="text-lg font-orbitron font-bold mb-8 flex items-center gap-3 uppercase tracking-widest text-cyan-400">
                <FiTruck /> {copy.shippingTitle}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron text-gray-400 uppercase tracking-widest">{copy.fields.fullName}</label>
                  <input
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-cyan-500/20 rounded p-3 focus:border-cyan-400 outline-none transition-colors font-rajdhani"
                    placeholder={copy.placeholders.fullName}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron text-gray-400 uppercase tracking-widest">{copy.fields.phone}</label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-cyan-500/20 rounded p-3 focus:border-cyan-400 outline-none transition-colors font-rajdhani"
                    placeholder={copy.placeholders.phone}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-orbitron text-gray-400 uppercase tracking-widest">{copy.fields.address}</label>
                  <input
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-cyan-500/20 rounded p-3 focus:border-cyan-400 outline-none transition-colors font-rajdhani"
                    placeholder={copy.placeholders.address}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron text-gray-400 uppercase tracking-widest">{copy.fields.city}</label>
                  <input
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-cyan-500/20 rounded p-3 focus:border-cyan-400 outline-none transition-colors font-rajdhani"
                    placeholder={copy.placeholders.city}
                  />
                </div>
              </div>
            </section>

            <section className="glass-card p-8 border-cyan-500/20 bg-cyan-950/5 relative">
              <h3 className="text-lg font-orbitron font-bold mb-8 flex items-center gap-3 uppercase tracking-widest text-cyan-400">
                <FiCreditCard /> {copy.paymentTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['COD', 'BANK_TRANSFER'].map((method) => (
                  <label 
                    key={method}
                    className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center gap-4 ${
                      formData.paymentMethod === method 
                        ? "border-cyan-500 bg-cyan-500/10" 
                        : "border-white/10 bg-black/20 hover:border-cyan-500/50"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === method ? "border-cyan-400" : "border-gray-600"}`}>
                       {formData.paymentMethod === method && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </div>
                    <span className="font-orbitron text-xs tracking-widest uppercase">
                      {copy.paymentMethods[method]}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Order Summary HUD */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-cyan-500/30 bg-[#112240] sticky top-28">
              <h3 className="text-sm font-orbitron font-bold mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                <FiPackage className="text-cyan-400" /> {copy.unitsTitle}
              </h3>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {items.map((item) => (
                  <div key={item.product?._id} className="flex gap-4 items-center border-b border-white/5 pb-4">
                    <div className="w-12 h-12 bg-black/40 rounded border border-white/5 overflow-hidden flex-shrink-0">
                      <ModelKitImage
                        src={item.product?.images?.[0]?.url}
                        alt={item.product?.name}
                        name={item.product?.name}
                        grade={item.product?.grade}
                        series={item.product?.series}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-cyan-400 uppercase truncate">{item.product?.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{copy.qty}: {item.quantity}</p>
                    </div>
                    <span className="text-[10px] font-mono text-white">${(item.product?.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-white/5 pt-6">
                <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
                  <span>{copy.subtotal}</span>
                  <span className="font-mono">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
                  <span>{copy.shipping}</span>
                  <span className="text-cyan-400 font-mono">{copy.free}</span>
                </div>
                <div className="pt-4 flex justify-between items-end">
                  <span className="text-sm font-bold text-white uppercase italic">{copy.total}</span>
                  <span className="text-2xl font-mono font-bold text-cyan-400 glow-text">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full mt-8 py-4 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] rounded hover:bg-cyan-400 transition-all shadow-cyan-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
              >
                {loading ? copy.syncing : copy.confirm}
                {!loading && <FiCheckCircle size={18} />}
              </button>
              
              <p className="mt-4 text-[9px] text-center text-gray-500 uppercase tracking-widest italic">
                {copy.footer}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
