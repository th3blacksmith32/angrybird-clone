import crypto from 'crypto';
const secret = process.env.FRAUD_SECRET || 'fraud';
const recentOrders = new Set();

export default function fraudMiddleware(req, res, next) {
  const { orderId, timestamp, signature } = req.body;
  if (!orderId || !timestamp || !signature) return res.status(400).json({ error: 'missing fraud fields' });
  if (recentOrders.has(orderId)) return res.status(400).json({ error: 'duplicate order' });
  const payload = `${orderId}:${timestamp}`;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (expected !== signature) return res.status(403).json({ error: 'bad signature' });
  recentOrders.add(orderId);
  setTimeout(() => recentOrders.delete(orderId), 60000);
  next();
}
