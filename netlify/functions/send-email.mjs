import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { name, phone, email, projectType, description, files, attachments } = JSON.parse(event.body);

    const filesInfo = attachments && attachments.length
      ? `<p><strong>Archivos adjuntos:</strong> ${attachments.map(a => a.filename).join(', ')}</p>`
      : '';

    const emailData = {
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
    };

    if (attachments && attachments.length) {
      emailData.attachments = attachments.map(a => ({
        filename: a.filename,
        content: Buffer.from(a.content, 'base64'),
      }));
    }

    const data = await resend.emails.send(emailData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    console.error("Error enviando email:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
