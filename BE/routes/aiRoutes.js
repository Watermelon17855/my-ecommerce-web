const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product");

router.post("/chat", async (req, res) => {
    try {
        const { message, history } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "Bạn là chuyên viên tư vấn của MERN Tech. Hãy xưng Quý khách/Tôi. Nếu khách tìm đồ, PHẢI trả về JSON cuối câu: SEARCH_ACTION: {\"keyword\": \"...\", \"feature\": \"...\", \"minPrice\": 0, \"maxPrice\": 50000000}"
        });

        // 1. CHUẨN HÓA HISTORY
        let safeHistory = (history || []).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content || "" }]
        }));

        // 2. CHIÊU THỨC FIX LỖI: Nếu tin nhắn đầu tiên là của 'model', hãy xóa nó đi
        // Vì Gemini bắt buộc lịch sử phải bắt đầu bằng 'user'
        while (safeHistory.length > 0 && safeHistory[0].role === 'model') {
            safeHistory.shift();
        }

        // 3. Khởi tạo chat với safeHistory đã được "lọc sạch"
        const chat = model.startChat({
            history: safeHistory,
        });

        const result = await chat.sendMessage(message);
        const text = result.response.text();

        let products = [];
        let cleanReply = text;

        if (text.includes("SEARCH_ACTION:")) {
            const parts = text.split("SEARCH_ACTION:");
            cleanReply = parts[0].trim();
            try {
                let jsonStr = parts[1].trim().replace(/```json|```/g, "");
                const criteria = JSON.parse(jsonStr);

                const query = {
                    price: {
                        $gte: criteria.minPrice || 0,
                        $lte: (criteria.maxPrice > 0) ? criteria.maxPrice : 999999999
                    }
                };

                const conditions = [];
                if (criteria.keyword) {
                    conditions.push({ name: { $regex: criteria.keyword, $options: "i" } });
                    conditions.push({ category: { $regex: criteria.keyword, $options: "i" } });
                }
                if (criteria.feature) {
                    conditions.push({ description: { $regex: criteria.feature, $options: "i" } });
                }

                if (conditions.length > 0) {
                    query.$or = conditions;
                }

                products = await Product.find(query).populate("category").limit(10);
            } catch (e) {
                console.log("❌ Lỗi parse JSON:", e.message);
            }
        }

        res.json({ reply: cleanReply, products });

    } catch (error) {
        console.error("❌ LỖI GEMINI:", error.message);
        res.status(200).json({
            reply: "Dạ, hệ thống tư vấn đang bận một chút, Quý khách thử lại sau nhé!",
            products: []
        });
    }
});

module.exports = router;