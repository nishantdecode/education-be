const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/getkey", (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});
router.get("/getOrder/:orderId", orderController.getOrder);
router.post("/checkout", orderController.checkout);
router.post("/paymentverification", orderController.paymentVerification);
router.get("/:userId", orderController.getAllUserOrders);

module.exports = router;
