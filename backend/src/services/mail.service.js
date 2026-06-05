const nodemailer = require("nodemailer");

exports.sendVerificationOtp = async (email, otp) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from =
    process.env.SMTP_FROM ||
    "NestArrival Verification <no-reply@nestarrival.ca>";

  const isConfigured = !!(host && user && pass);

  if (isConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port || "587"),
        secure: port === "465",
        auth: { user, pass },
      });

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
            <h2 style="color: #0f172a; margin: 0;">Nest<span style="color: #d4ff4d; background: #000; padding: 2px 6px; border-radius: 4px;">Arrival</span></h2>
            <p style="font-size: 12px; color: #64748b; margin: 5px 0 0 0;">Verification-First Newcomer Housing</p>
          </div>
          <p style="font-size: 14px; color: #334155; line-height: 1.5;">Hello,</p>
          <p style="font-size: 14px; color: #334155; line-height: 1.5;">Thank you for registering with NestArrival. To complete your account activation, please use the following one-time verification code (OTP):</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #000; letter-spacing: 5px; padding: 10px 20px; border: 2px dashed #000; border-radius: 6px; background-color: #f8fafc;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #64748b; line-height: 1.5;">This verification code is valid for 15 minutes. If you did not request this email, please ignore it or contact our support.</p>
        </div>
      `;

      await transporter.sendMail({
        from,
        to: email,
        subject: `[NestArrival] Verify Your Email - OTP: ${otp}`,
        html: htmlContent,
      });
      return true;
    } catch (err) {
      console.error("[NestArrival SMTP] Error sending mail via SMTP:", err);
    }
  }

  console.log(`\n==================================================`);
  console.log(`[NestArrival SMTP Fallback Console Logger]`);
  console.log(`To: ${email}`);
  console.log(`OTP Code: ${otp}`);
  console.log(
    `Status: SMTP credentials missing or failed. Printed here for testing.`,
  );
  console.log(`==================================================\n`);
  return true;
};
