const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

exports.sendContact = async (req, res) => {
  console.log("🔥 CONTACT API HIT");
  console.log("📩 DATA RECEIVED:", req.body);

  const { name, phone, email, message } = req.body;

  try {
    // 1️⃣ Save to MongoDB
    const saved = await Contact.create({
      name,
      phone,
      email,
      message,
    });

    console.log("✅ SAVED TO DB:", saved._id);

    // 2️⃣ Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3️⃣ Email to YOU
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact from ${name}`,
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    console.log("📧 EMAIL SENT TO OWNER");

    // 4️⃣ Auto-reply to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thanks for contacting Aditya 👋",
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out. I received your message and will reply soon.</p>
        <br/>
        <p>Regards,<br/>Aditya Thakur</p>
      `,
    });

    console.log("🤖 AUTO-REPLY SENT");

    res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ CONTACT ERROR:", error);
    res.status(500).json({ success: false });
  }
};
