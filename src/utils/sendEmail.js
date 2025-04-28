const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

// Function to send email
const sendEmail = async () => {
  const params = {
    Source: "alerts@devvy.in", // Must be a verified sender email in SES
    Destination: {
      ToAddresses: ["kashifsheikh9598@gmail.com"],
    },
    Message: {
      Subject: {
        Data: "Hello from AWS SES and Node.js!",
      },
      Body: {
        Text: {
          Data: "This is a test email sent using AWS SDK v3 for Node.js 🚀",
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Email sent successfully!", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail };
