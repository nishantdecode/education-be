const crypto = require("crypto");
const { instance } = require("../config/razorpay.js");
const { Order } = require("../models/order");
const { Slot } = require("../models/slot.js");
const { Meeting } = require("../models/meeting.js");
const { User } = require("../models/user.js");
const { createZoomMeeting } = require("../api/zoomAPI.js");

const BASE_URL =
  process.env.ENV === "PROD" ? process.env.CLIENT_PROD : process.env.CLIENT_DEV;

const getAllUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: User }, { model: Slot }, { model: Meeting }],
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
    const order = await Order.findByPk(orderId, {
      include: [{ model: User }, { model: Slot }, { model: Meeting }],
    });

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

  const slotFetched = await Slot.findByPk(req.body.slotId);

  if (slotFetched.status === "Available") {
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
  } else {
    res.status(200).json({
      success: false,
      order: null,
    });
  }
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
      include: [{ model: User }, { model: Slot }],
    });

    const user = order.User;
    const slot = order.Slot;

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    order.status = "Successful";

    await order.save();

    const zoomMeeting = await createZoomMeeting(
      2,
      user.email,
      slot.startTime,
      order.topic
    );

    if (slot.status === "Available" && zoomMeeting) {
      const slot = await Slot.findOne({
        where: { id: order.slotId },
      });

      slot.status = "Booked";
      slot.bookingUserId = user.userId;

      await slot.save();

      const meeting = await Meeting.create({
        topic: order.topic,
        userId: order.userId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        hostLink: zoomMeeting.start_url,
        attendeeLink: zoomMeeting.join_url,
        status: "Join",
      });

      order.meetingId = meeting.id;
      order.save();

      res.redirect(
        `${BASE_URL}chatting/paymentStatus?status=successful&orderId=${order.id}`
      );
    } else {
      res.redirect(
        `${BASE_URL}chatting/paymentStatus?status=failed&orderId=null`
      );
    }
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
      `${BASE_URL}chatting/paymentStatus?status=failed&orderId=null`
    );
  }
};

module.exports = {
  getOrder,
  getAllUserOrders,
  checkout,
  paymentVerification,
};
