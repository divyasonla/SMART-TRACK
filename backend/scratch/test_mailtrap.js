const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

const TOKEN = "8b9e6ec56a5db21d017b2b64d1f21db7"; // Let's use placeholder or let user edit it

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

const sender = {
  address: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};
const recipients = [
  "divyasonla@navgurukul.org",
];

transport
  .sendMail({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);
