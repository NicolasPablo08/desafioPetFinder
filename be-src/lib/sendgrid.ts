import * as sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmailReport = async (
	email,
	namePet,
	nombre,
	informacion,
	telefono
) => {
	const msg = {
		to: email,
		from: process.env.EMAIL_USER, // Cambialo por tu sender
		subject: `He visto a ${namePet}`,
		text: `Hola, soy ${nombre}. ${informacion}. Puedes contactarme al ${telefono}.`,
	};

	try {
		await sgMail.send(msg);
		return {
			status: "success",
			message: "Mensaje enviado, gracias por ayudar a encontrar una mascota!",
		};
	} catch (error) {
		console.error(error);
		return {
			status: "warning",
			message: "No se pudo enviar el mensaje, intenta más tarde!",
		};
	}
};

export const sendEmailCode = async (email, code) => {
	const msg = {
		to: email,
		from: process.env.EMAIL_USER, // Cambialo por tu sender
		subject: 'Código de verificación "Mascotas Perdidas"',
		text: `Ingresa el siguiente código de verificación en la app para restaurar tu contraseña: ${code}.`,
	};

	try {
		await sgMail.send(msg);
		return {
			status: "success",
			message: "Código enviado con éxito!",
		};
	} catch (error) {
		console.error(error);
		return {
			status: "warning",
			message: "No se pudo enviar el código, intenta más tarde!",
		};
	}
};
