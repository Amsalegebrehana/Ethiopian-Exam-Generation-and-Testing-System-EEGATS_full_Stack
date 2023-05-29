import nodemailer from "nodemailer";

export async function sendNewInvite({
  email,
  url,
  pool,
  
}: {
  email: string;
  url: string;
  pool: string;
  
}) {
  try{
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
      html: `<p>Greetings,<br></p> <p>You have been invited to contribute and review questions for the Ethiopian Exam Generation and Testing System's ${pool} pool.<br></p><p> Create your contributor account by clicking <a href="${url}">HERE</a></p>`,
    });
  }
  catch(err){
    console.log("Error2: ", err);
  }
  

  // console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}
export async function sendReturnEmail({
  email,
  url,
  pool
}: {
  email: string;
  url: string;
  pool :string;
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
    html: `<p>Greetings,<br></p> <p>You have been invited to contribute and review questions for the Ethiopian Exam Generation and Testing System's ${pool} pool.<br></p><p>Log into your account by clicking <a href="${url}">HERE</a></p>`,
  });

  // console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}

export async function sendNotificationEmail({
  email,
  url,
  pool,
  category,
  numberOfQuestions
}: {
  email: string;
  url: string;
  pool :string;
  category:string;
  numberOfQuestions:number;
}) {
  try{
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
      subject: "EEGTS Contribution Activity Update",
      html: `<p>Greetings,<br></p> <p>The number of questions you have been assigned for the Ethiopian Exam Generation and Testing System's in the ${pool} pool, with regards to ${category} category has been changed to ${numberOfQuestions}.<br></p><p>You can check the new update by logging into your account by clicking <a href="${url}">HERE</a></p>`,
    });
  }
  catch(err){
    console.log("Error: ", err);
  }
  

}

export async function sendStatusNotificationEmail({
  email,
  url,
  pool,
  status,
}: {
  email: string;
  url: string;
  pool :string;
  status: string;
}) {

  try{
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
  
      service: "gmail",
      auth: {
        user: "invite.eegts@gmail.com",
        pass: process.env.MAILER_PASSWORD,
      },
    });
  
    if (status === 'Active'){
      const info = await transporter.sendMail({
        from: ' <no-reply@eegts.com>',
        to: email,
        subject: "EEGTS Account Update",
        html: `<p>Greetings,<br></p> <p>Your account at EEGTS, with regards to ${pool} pool, has been activated. <br></p><p>You can login to your account by clicking <a href="${url}">HERE</a></p>`,
      });
    }
    else{
      const info = await transporter.sendMail({
        from: ' <no-reply@eegts.com>',
        to: email,
        subject: "EEGTS Account Update",
        html: `<p>Greetings,<br></p> <p>Your account at EEGTS, with regards to ${pool} pool, has currently been deactivated. If there is any further update, we will notify you. Thank you.</p>`,
      });
    }
  }
  catch(err){
    console.log("Error: ",err);
  }
  
  
  

}