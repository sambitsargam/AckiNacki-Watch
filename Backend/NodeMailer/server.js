const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 3030;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const contactEmail = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "artrackrhub@gmail.com",
    pass: "password", // Use environment variables for sensitive information
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

let form = 'Acki Watch Team <artrackrhub@gmail.com>';

router.post("/subscribe", (req, res) => {
  const email = req.body.email;
  const mail = {
    from: form,
    to: email,
    subject: "Welcome to Acki Watch powered by Acki Nacki",
    html: `<center><h1> Welcome to Acki Watch powered by Acki Nacki </h1></center>
    <br></br>
    <br></br>
    <h3> Hello  </h3>
    <p> Thank you for signing up for quiz me powered by Unstoppable Domain. We're really happy to have you! Click the link below to test your knowledge and expand your mind:</p>
    <a href="https://ackiwatch.vercel.app">Take a Look</a>
        <br></br>
    <h4>Best regards,</h4>
    <p>Sambit Sargam Ekalabya</p>
    <p>Team Acki Watch</p>
    `,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Congrats! Signup Successful! Go ahead to your profile by clicking the profile icon." });
    }
  });
});

router.post("/receipt", (req, res) => {
  const email = req.body.email;
  const owner = req.body.owner;
  const transid = req.body.transid;
  const fees = req.body.fees;
  const quantity = req.body.quantity;
  const transactionTimestamp = req.body.transactionTimestamp;
  const mail = {
    from: form,
    to: email,
    subject: "A deposit has been made to your wallet address",
    html: `
    <h1>Incoming Transaction Alert</h1>
    <p>Dear User,</p>
    <p>We are excited to inform you that there has been an incoming transaction to your wallet address. Here are the details:</p>
  
    <ul>
      <li>Transaction Amount: ${quantity} AR</li>
      <li>Transaction ID: ${transid}</li>
      <li>Transaction Sender: ${owner}</li>
      <li>Transaction Timestamp: ${transactionTimestamp}</li>
      <li>Transaction Fees: ${fees} AR</li>
    </ul>
  
    <p>Please click the button below to view the transaction on Acki Nacki:</p>
    <p>
      <a href="https://ackinacki-testnet.tvmlabs.dev/messages/messageDetails?id=${transid}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">View Transaction</a>
    </p>
  
    <p>Thank you for using our service!</p>
    <p>Best regards,</p>
    <p>Acki Watch</p>
  `,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Congrats! Notification Successful!" });
    }
  });
});

router.post("/owner", (req, res) => {
  const email = req.body.email;
  const receipt = req.body.receipt;
  const transid = req.body.transid;
  const fees = req.body.fees;
  const quantity = req.body.quantity;
  const transactionTimestamp = req.body.transactionTimestamp;
  const mail = {
    from: form,
    to: email,
    subject: "A Withdrawal has been made from your wallet address",
    html: `
    <h1>Outgoing Transaction Alert</h1>
    <p>Dear User,</p>
    <p>We are excited to inform you that there has been an outgoing transaction from your wallet address. Here are the details:</p>
  
    <ul>
      <li>Transaction Amount: ${quantity} AR</li>
      <li>Transaction ID: ${transid}</li>
      <li>Transaction Receiver: ${receipt}</li>
      <li>Transaction Timestamp: ${transactionTimestamp}</li>
      <li>Transaction Fees: ${fees} AR</li>
    </ul>
  
    <p>Please click the button below to view the transaction on Acki Nacki:</p>
    <p>
      <a href="https://ackinacki-testnet.tvmlabs.dev/messages/messageDetails?id=${transid}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">View Transaction</a>
    </p>
  
    <p>Thank you for using our service!</p>
    <p>Best regards,</p>
    <p>Acki Watch</p>
  `,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Congrats! Notification Successful!" });
    }
  });
});

router.post("/contract", (req, res) => {
  const email = req.body.email;
  const transid = req.body.transid;
  const fees = req.body.fees;
  const appName = req.body.appName;
  const quantity = req.body.quantity;
  const transactionTimestamp = req.body.transactionTimestamp;
  const mail = {
    from: form,
    to: email,
    subject: `Interaction with ${appName} App using Your Wallet Address`,
    html: `
    <h1>Interaction with ${appName} App</h1>
    <p>Hello,</p>
    <p>We would like to inform you that there has been an interaction with ${appName} App using your wallet address.</p>
    <p>Here are the details of the transaction:</p>
    <ul>
      <li>Transaction ID: ${transid}</li>
      <li>Transaction Amount: ${quantity} AR</li>
      <li>Transaction Fees: ${fees} AR</li>
      <li>Transaction Timestamp: ${transactionTimestamp}</li>
    </ul>
    <p>If this interaction was not initiated by you, please take appropriate action to secure your wallet.</p>
    <p>Please click the button below to view the transaction on Acki Nacki:</p>
    <p>
      <a href="https://ackinacki-testnet.tvmlabs.dev/messages/messageDetails?id=${transid}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none;">View Transaction</a>
    </p>
    <p>Thank you for using our service!</p>
    <p>Best regards,</p>
    <p>Acki Watch</p>
  `,
  };

  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: "ERROR" });
    } else {
      res.json({ status: "Congrats! Notification Successful!" });
    }
  });
});
