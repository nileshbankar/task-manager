const mailgun = require("mailgun-js");
const DOMAIN = "sandboxe20256f781894985a6af0ef7eb088540.mailgun.org";
const mg = mailgun({
  apiKey: process.env.MAILGAIN_API_KEY,
  domain: DOMAIN,
});
const data = {
  from: "nilesh.bankr@gmail.com",
  to: "nilesh.bankr@gmail.com",
  subject: "Hello",
  text: "Testing some Mailgun awesomness!",
};
mg.messages().send(data, function (error, body) {
  console.log(body);
});
