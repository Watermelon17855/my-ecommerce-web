import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaRobot, FaTimes, FaMinus, FaCommentDots } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const welcomeMessage = {
    role: 'ai',
    content: 'Chào mừng Quý khách đến with MERN Tech. Tôi là chuyên viên tư vấn ảo, rất hân hạnh được hỗ trợ Anh/Chị. Hôm nay Anh/Chị đang quan tâm đến dòng sản phẩm nào để tôi có thể tư vấn chi tiết ạ?',
    products: []
};

const AIChat = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([welcomeMessage]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleMinimize = () => {
        setIsOpen(false);
    };

    const handleClose = () => {
        setMessages([welcomeMessage]);
        setIsOpen(false);
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        // Lưu lại lịch sử hiện tại TRƯỚC KHI thêm tin nhắn mới để gửi lên server
        const currentHistory = [...messages];

        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            // SỬA Ở ĐÂY: Gửi kèm history để AI nhớ được câu trước
            const res = await axios.post('http://localhost:5001/api/ai/chat', {
                message: currentInput,
                history: currentHistory // Gửi cả mảng tin nhắn cũ lên
            });

            const aiMsg = {
                role: 'ai',
                content: res.data.reply,
                products: res.data.products || []
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', content: 'Dạ lỗi rồi sếp ơi, đợi công tử sạc pin tí!', products: [] }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-5 right-5 w-16 h-16 bg-gradient-to-r from-yellow-600 to-yellow-400 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 border-2 border-white"
                >
                    <FaCommentDots size={28} />
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-5 right-5 w-96 h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col border border-gold-500 overflow-hidden z-50 animate-in fade-in zoom-in duration-300">
                    <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-yellow-600 shadow-md">
                                <FaRobot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Chat AI</h3>
                                <p className="text-[10px] opacity-80">Đang Online</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleMinimize}
                                className="p-1 hover:bg-white/20 rounded transition"
                                title="Thu nhỏ"
                            >
                                <FaMinus size={16} />
                            </button>
                            <button
                                onClick={handleClose}
                                className="p-1 hover:bg-red-500 rounded transition"
                                title="Đóng và xóa lịch sử"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${msg.role === 'user'
                                    ? 'bg-yellow-500 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                    {msg.products && msg.products.length > 0 && (
                                        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                            {msg.products.map((p, i) => (
                                                <div key={i} className="min-w-[140px] bg-gray-50 rounded-lg p-2 border border-yellow-200">
                                                    {/* Sếp check lại p.img hay p.image nhé, tui giữ p.img theo file sếp đưa */}
                                                    <img src={p.img || p.image} alt={p.name} className="w-full h-20 object-contain mb-2 rounded" />
                                                    <h4 className="text-[11px] font-bold truncate text-black">{p.name}</h4>
                                                    <p className="text-[10px] text-red-500 font-semibold">
                                                        {new Intl.NumberFormat('vi-VN').format(p.price)}đ
                                                    </p>
                                                    <button
                                                        onClick={() => navigate(`/product/${p._id}`)}
                                                        className="w-full mt-1 py-1 bg-yellow-600 text-white text-[9px] rounded hover:bg-yellow-700 transition shadow-sm"
                                                    >
                                                        Xem ngay
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start text-xs text-gray-400 italic px-2">Đợi tí nha...</div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    <div className="p-3 border-t bg-white flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Hỏi bất cứ thứ gì"
                            className="flex-1 p-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-yellow-500 text-black"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="p-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition shadow-md"
                        >
                            <FaPaperPlane size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChat;