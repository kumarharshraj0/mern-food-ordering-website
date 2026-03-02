const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const templates = {
  verification: (token, name) => ({
    subject: 'Verify your email',
    html: `
      <p>Hello ${name || 'User'},</p>
      <p>Thanks for signing up. Please verify your email by clicking the link below:</p>
      <p><a href="${FRONTEND_URL}/verify-email?token=${token}">Verify email</a></p>
      <p>If you didn't create an account, ignore this email.</p>
    `
  }),
  resetPassword: (otp) => ({
    subject: 'Reset your password',
    html: `
      <p>We received a password reset request.</p>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>
    `
  }),
  orderCreated: (order) => ({
    subject: `Order ${order._id} created`,
    html: `<p>Thanks for your order. Order ID: ${order._id}. Total: ${order.total}</p>`
  }),
  orderStatusUpdate: (order, status) => ({
    subject: `Order ${order._id} status: ${status}`,
    html: `<p>Your order ${order._id} status changed to <strong>${status}</strong></p>`
  }),
  deliveryOtp: (otp) => ({
    subject: 'Your delivery OTP',
    html: `<p>Your OTP to confirm delivery is: <strong>${otp}</strong></p>`
  })
};

module.exports = templates;
