const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { createRateLimiter } = require("../middleware/rateLimit");

const registerLimiter = createRateLimiter({
	windowMs: 15 * 60 * 1000,
	max: 20,
	message: "Bạn đã thử đăng ký quá nhiều lần. Vui lòng thử lại sau.",
});

const loginLimiter = createRateLimiter({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: "Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.",
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Xác thực]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *                 pattern: '^[0-9]{10,11}$'
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/register", registerLimiter, authController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Xác thực]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Thông tin đăng nhập không đúng
 */
router.post("/login", loginLimiter, authController.login);

module.exports = router;