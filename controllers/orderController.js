const crypto = require("crypto");
const { instance } = require("../config/razorpay.js");
const { Order } = require("../models/order");

const getAllUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.findAll({
      where: { userId },
    });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId);


    if (!order) {
      return res.status(404).json({ message: "No order found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  await Order.create({
    topic: req.body.topic,
    razorpay_order_id: order.id,
    userId: req.body.userId,
    slotId: req.body.slotId,
    amount: req.body.amount,
    currency: "INR",
    status: "Pending",
  });

  res.status(200).json({
    success: true,
    order,
  });
};

const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const order = await Order.findOne({
      where: { razorpay_order_id },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    order.status = "Successful";

    await order.save();

    res.redirect(
      `http://localhost:3000/chatting/paymentStatus?status=successful&orderId=${order.id}`
    );
  } else {
    const { error } = req.body;
    const metadata = JSON.parse(error["error[metadata]"]);
    const { payment_id, order_id } = metadata;
    const order = await Order.findOne({
      where: { razorpay_order_id: order_id },
    });
    order.razorpay_payment_id = payment_id;
    order.status = "Failed";
    await order.save();
    res.redirect(
      `http://localhost:3000/chatting/paymentStatus?status=failed&orderId=null`
    );
  }
};

const invoice = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    const doc = generateInvoice(order);
    const pdfData = doc.output("blob");

    res.setHeader("Content-disposition", "attachment; filename=invoice.pdf");
    res.setHeader("Content-type", "application/pdf");
    res.send(pdfData);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

module.exports = {
  getOrder,
  getAllUserOrders,
  invoice,
  checkout,
  paymentVerification,
};
