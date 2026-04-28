import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Cpu, ArrowRight, ChevronDown, Star } from 'lucide-react';

const TECH_IMAGE = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop";

const Landing = () => {
    return (
        <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-blue-100 overflow-x-hidden">

            {/* --- 1. HERO SECTION: HIỆU ỨNG CHÉM XÉO (DIAGONAL SPLIT) --- */}
            <section className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden">
                <div className="relative w-full h-full md:w-[90%] md:h-[85%] overflow-hidden md:rounded-[3rem] border-4 border-gray-900 bg-gray-950">

                    {/* MẢNH 1: BÊN TRÁI (Vết cắt xéo - Bay sang trái) */}
                    <motion.div
                        initial={{ x: "0%" }}
                        animate={{ x: "-3%" }} // Trượt ra cực nhỏ tạo đường nứt mảnh
                        transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ clipPath: 'polygon(0 0, 38% 0, 28% 100%, 0 100%)' }}
                        className="absolute inset-0 z-30 pointer-events-none"
                    >
                        <img src={TECH_IMAGE} alt="" className="w-full h-full object-cover brightness-50" />
                    </motion.div>

                    {/* MẢNH 2: Ở GIỮA (Mảnh chính - Đứng yên & Phóng to) */}
                    <motion.div
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ clipPath: 'polygon(38% 0, 68% 0, 58% 100%, 28% 100%)' }}
                        className="absolute inset-0 z-20 flex items-center justify-center"
                    >
                        <img src={TECH_IMAGE} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>

                        {/* Text nằm ở mảnh giữa */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1.2 }}
                            className="absolute z-50 text-center"
                        >
                        </motion.div>
                    </motion.div>

                    {/* MẢNH 3: BÊN PHẢI (Vết cắt xéo - Bay sang phải) */}
                    <motion.div
                        initial={{ x: "0%" }}
                        animate={{ x: "3%" }} // Trượt ra cực nhỏ
                        transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ clipPath: 'polygon(68% 0, 100% 0, 100% 100%, 58% 100%)' }}
                        className="absolute inset-0 z-10 pointer-events-none"
                    >
                        <img src={TECH_IMAGE} alt="" className="w-full h-full object-cover brightness-50" />
                    </motion.div>

                    {/* Nút vào shop hiện lên sau */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8 }}
                        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50"
                    >
                        <Link to="/home" className="px-12 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-3 group">
                            VÀO CỬA HÀNG <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                </div>


            </section>


            {/* --- 2. SECTION HIỆN/ẨN LIÊN TỤC (THEO YÊU CẦU SẾP) --- */}
            <section className="py-40 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <ContinuousRevealCard
                            icon={<Zap />}
                            title="SIÊU TỐC"
                            desc="Load trang thần tốc, trải nghiệm không độ trễ trên nền tảng Vite."
                        />
                        <ContinuousRevealCard
                            icon={<ShieldCheck />}
                            title="BẢO MẬT"
                            desc="Công nghệ mã hóa dữ liệu đa tầng, an toàn tuyệt đối cho người dùng."
                        />
                        <ContinuousRevealCard
                            icon={<Cpu />}
                            title="HIỆU NĂNG"
                            desc="Tối ưu hóa tài nguyên cực tốt, chạy mượt mà trên mọi thiết bị."
                        />
                    </div>
                </div>
            </section>

            {/* Banner CTA */}
            <section className="py-20">
                <div className="max-w-[95%] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }} // Cuộn lên mất, cuộn xuống hiện lại
                        className="bg-gray-900 rounded-[4rem] p-20 md:p-40 text-center relative overflow-hidden"
                    >
                        <h2 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase mb-12">
                            MERN <span className="text-blue-500">EXPERIENCE</span>
                        </h2>

                    </motion.div>
                </div>
            </section>

            <footer className="py-12 text-center border-t border-gray-100 bg-white">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">© 2026 MERN TECH SHOP</p>
            </footer>
        </div>
    );
};

// --- COMPONENT: HIỆN/ẨN LIÊN TỤC KHI CUỘN ---
const ContinuousRevealCard = ({ icon, title, desc }) => (
    <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }} // CHÌA KHÓA: once: false để hiện lại liên tục
        transition={{ duration: 0.8 }}
        className="text-center group"
    >
        <div className="w-24 h-24 bg-gray-50 text-gray-400 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
            {React.cloneElement(icon, { size: 40 })}
        </div>
        <h3 className="text-3xl font-black mb-6 italic uppercase tracking-tighter text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-gray-400 font-medium text-lg px-4">{desc}</p>
    </motion.div>
);

export default Landing;