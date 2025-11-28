# Payments and Subscriptions
Billing routes simulate payments with HMAC signatures checked by `backend/billing/fraudMiddleware.js`. Users call `/billing/subscribe` with {orderId,timestamp,signature,userId}. Successful requests set subscription to premium. `/billing/cancel` reverts to free. TON balances are tracked per user and globally in `tonPool` with `/ton/send` simulating payouts.
