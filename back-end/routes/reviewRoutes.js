const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");
const { authMiddleware } = require("../middleware/auth");

// Create a review (user)
router.post("/", authMiddleware, reviewController.create);

// Get reviews for a service (public)
router.get("/service/:service_id", reviewController.getByService);

// Check if user already reviewed a booking (user)
router.get("/check/:id", authMiddleware, reviewController.checkUserReview);

// Get all reviews by current user
router.get("/user/my-reviews", authMiddleware, reviewController.getUserReviews);

module.exports = router;
