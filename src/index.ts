import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import paymentRoutes from './routes/payment';

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para todas las rutas
app.use(cors());

app.use(bodyParser.json());
app.use("/api", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});