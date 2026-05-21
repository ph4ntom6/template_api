import dayjs from "../helpers/dayjs";
import mailer from "nodemailer";

import translate from "../helpers/translate";

async function sendMail(key, receiver, params) {
  params = {
    ...params,
    "{{YEAR}}": dayjs().year().toString(),
    "{{LOGO}}": process.env.APP_URL + "logo.png",
    "{{LOGO_FOOTER}}": process.env.APP_URL + "logo.png",
    "{{LOCK}}": process.env.APP_URL + "lock.png",
    "{{COVER}}": process.env.APP_URL + "email-cover.png",
    "{{TRIANGLE}}": process.env.APP_URL + "triangle.png",
    "{{ABOUT}}": process.env.APP_URL + "about",
    "{{FAQS}}": process.env.APP_URL + "faqs",
    "{{CONTACT}}": process.env.APP_URL + "contact",
    "{{TERMS}}": process.env.APP_URL + "terms-of-use",
    "{{PRIVACY}}": process.env.APP_URL + "privacy-policy",
    "{{TWITTER_LINK}}": process.env.TWIITER_LINK,
    "{{INSTAGRAM_LINK}}": process.env.INSTAGRAM_LINK,
    "{{FACEBOOK_LINK}}": process.env.FACEBOOK_LINK,
  };

  const subject = translate("templates", `${key}.subject`, params);
  const emailTemplate = translate("templates", `${key}.html`, params);

  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: !!process.env.SMTP_SECURE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    };

    const mailTransport = mailer.createTransport(smtpConfig);

    const mailOptions = {
      from: {
        name: process.env.EMAIL_SENDER_NAME,
        address: process.env.EMAIL_SENDER,
      },
      to: receiver,
    };
    if (params?.attachments) {
      mailOptions.attachments = params?.attachments;
    }

    mailOptions.html = emailTemplate;
    mailOptions.subject = subject;

    // send email
    return await mailTransport.sendMail(mailOptions);
  } else {
    // eslint-disable-next-line no-console
    console.log("Credentials not found", subject, emailTemplate);
  }
}

export default sendMail;
