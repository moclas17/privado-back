import express from "express";
import { supabase } from "../supabase";
import { randomUUID } from "crypto";

const router = express.Router();

router.post("/payment-link", async (req, res) => {
  const { amount, token, orderId, wallet } = req.body;

  if (!amount || !token || !orderId || !wallet) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { error } = await supabase
    .from("payment_links")
    .insert([{ id: randomUUID(), order_id: orderId, amount, token, wallet }]);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not store payment link" });
  }

  const paymentUrl = `http://localhost:3000/api/pay/${orderId}`;
  res.json({ paymentUrl });
});

router.get("/pay/:orderId", async (req, res) => {
  const { orderId } = req.params;

  const { data, error } = await supabase
    .from("payment_links")
    .select("amount, token")
    .eq("order_id", orderId)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Payment not found" });
  }

  res.json({
    orderId,
    amount: data.amount,
    token: data.token
  });
});

export default router;