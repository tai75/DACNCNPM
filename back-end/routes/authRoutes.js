const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { createRateLimiter } = require("../middleware/rateLimit");

const registerLimiter = createRateLimiter({
	windowMs: 15 * 60 * 1000,
	max: 20,
	message: "Too many register attempts. Please try again later.",
});

const loginLimiter = createRateLimiter({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: "Too many login attempts. Please try again later.",
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: ÄÄƒng kÃ½ ngÆ°á»i dÃ¹ng má»›i
 *     tags: [XÃ¡c thá»±c]
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
 *         description: ÄÄƒng kÃ½ thÃ nh cÃ´ng
 *       400:
 *         description: Dá»¯ liá»‡u khÃ´ng há»£p lá»‡
 */
router.post("/register", registerLimiter, authController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: ÄÄƒng nháº­p ngÆ°á»i dÃ¹ng
 *     tags: [XÃ¡c thá»±c]
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
 *         description: ÄÄƒng nháº­p thÃ nh cÃ´ng
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
 *         description: ThÃ´ng tin Ä‘Äƒng nháº­p khÃ´ng Ä‘Ãºng
 */
router.post("/login", loginLimiter, authController.login);

module.exports = router;
