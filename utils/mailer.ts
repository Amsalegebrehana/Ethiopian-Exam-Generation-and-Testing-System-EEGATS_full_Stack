import nodemailer from "nodemailer";

export async function sendInviteEmail({
  email,
  url,
  
}: {
  email: string;
  url: string;
  
}) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({

    service: "gmail",
    auth: {
      user: "invite.eegts@gmail.com",
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: ' <no-reply@eegts.com>',
    to: email,
    subject: "Contribute at EEGTS",
    html: `<p>Greetings,<br></p> <p>You have been invited to contribute and review questions for the Ethiopian Exam Generation and Testing System.<br></p><p> Create your contributor account by clicking <a href="${url}">HERE</a></p>`,
  });

  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}
