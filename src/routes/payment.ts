import express, { Request, Response } from "express";
import { supabase } from "../supabase";
import { randomUUID } from "crypto";
import { bridgeToCChain } from '../bridge-cchain-orchestation';
import { setOrder } from '../call-fuji-contract';
import { parseUnits } from 'viem';


const router = express.Router();

// Endpoint para bridgeToCChain
router.post('/bridge', async (req: Request, res: Response) => {
  try {
      const receipt = await bridgeToCChain();
      res.json({ success: true, receipt });
  } catch (error) {
      console.error('Error en bridge:', error);
      res.status(500).json({ error: 'Error al ejecutar bridge' });
  }
});


// Endpoint para setOrder
router.post('/order', async (req: Request, res: Response) => {
  try {
      const { orderId, amount } = req.body;
      
      if (!orderId || !amount) {
          return res.status(400).json({ error: 'Se requieren orderId y amount' });
      }

      // Convertir amount a bigint usando parseUnits
      const amountInWei = parseUnits(amount.toString(), 6);

      const receipt = await setOrder(orderId, amountInWei);
      res.json({ success: true, receipt });
  } catch (error) {
      console.error('Error en setOrder:', error);
      res.status(500).json({ error: 'Error al ejecutar setOrder' });
  }
});

// Endpoint para verificar el estado de una transacción
router.get('/transaction/:hash', async (req: Request, res: Response) => {
  try {
      const { hash } = req.params;
      // Aquí podrías implementar la lógica para verificar el estado de la transacción
      res.json({
          success: true,
          hash: hash,
          status: 'pending' // Implementar lógica real de verificación
      });
  } catch (error) {
      console.error('Error al verificar transacción:', error);
      res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido'
      });
  }
});


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