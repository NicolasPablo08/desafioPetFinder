import nodemailer from "nodemailer";

async function testEmail() {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
		tls: {
			rejectUnauthorized: false,
		},
		debug: true,
		logger: true,
	});

	try {
		const info = await transporter.sendMail({
			from: `"Test" <${process.env.EMAIL_USER}>`,
			to: process.env.EMAIL_USER, // te lo mandás a vos mismo para testear
			subject: "Test de envío desde Render",
			text: "Si recibís este mail, el envío funciona!",
		});
		console.log("Mail enviado:", info);
	} catch (error) {
		console.error("Error enviando mail:", error);
	}
}

testEmail();
