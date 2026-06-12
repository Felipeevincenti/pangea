import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { name, phone, email, projectType, description, files } = JSON.parse(event.body);

    const filesInfo = files ? `<p><strong>Archivos:</strong> ${files}</p>` : "";

    const data = await resend.emails.send({
      from: "Contacto Web <onboarding@resend.dev>",
      to: "felipevincentisalani@gmail.com",
      reply_to: email,
      subject: "Nuevo contacto desde Pangea",
      html: `
        <h2>Nuevo mensaje desde Pangea</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tipo de proyecto:</strong> ${projectType || "No especificado"}</p>
        <p><strong>Descripción:</strong><br/> ${(description || "").replace(/\n/g, "<br>")}</p>
        ${filesInfo}
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    console.error("Error enviando email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
