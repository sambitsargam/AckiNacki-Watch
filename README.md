# Acki Watch Notification System

Acki Watch Notification System is a Node.js application that tracks wallet transactions on the Acki Nacki blockchain and sends email notifications to users about incoming and outgoing transactions, as well as interactions with web applications.

## Features

- Fetches wallet addresses and emails from Firebase.
- Queries the Acki Nacki blockchain for transactions associated with the wallet addresses.
- Filters transactions based on a specified time window.
- Sends email notifications for incoming, outgoing, and web application interaction transactions.
- Uses Nodemailer for sending emails via Gmail.
- Scheduled to run every 30 seconds using cron jobs.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- Firebase Realtime Database
- Gmail account for sending emails

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/sambitsargam/AckiNacki-Watch.git
    cd AckiNacki-Watch
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root of the project and add the following environment variables:
    ```bash
    PORT=3030
    GMAIL_USER=your-email@gmail.com
    GMAIL_PASS=your-email-password
    FIREBASE_DATABASE_URL=https://your-firebase-database-url.com
    ```

### Running the Application

1. Start the server:
    ```bash
    node server.js
    ```

2. The server will start on the port specified in the `.env` file (default is 3030).

## API Endpoints

- **POST /subscribe**: Subscribe a user to Acki Watch.
    - Request body:
        ```json
        {
          "email": "user@example.com"
        }
        ```
    - Response:
        ```json
        {
          "status": "Congrats! Signup Successful! Go ahead to your profile by clicking the profile icon."
        }
        ```

- **POST /receipt**: Notify a user of an incoming transaction.
    - Request body:
        ```json
        {
          "email": "user@example.com",
          "owner": "walletOwnerAddress",
          "transid": "transactionId",
          "fees": "transactionFees",
          "quantity": "transactionQuantity",
          "transactionTimestamp": "transactionTimestamp"
        }
        ```
    - Response:
        ```json
        {
          "status": "Congrats! Notification Successful!"
        }
        ```

- **POST /owner**: Notify a user of an outgoing transaction.
    - Request body:
        ```json
        {
          "email": "user@example.com",
          "receipt": "transactionRecipient",
          "transid": "transactionId",
          "fees": "transactionFees",
          "quantity": "transactionQuantity",
          "transactionTimestamp": "transactionTimestamp"
        }
        ```
    - Response:
        ```json
        {
          "status": "Congrats! Notification Successful!"
        }
        ```

- **POST /contract**: Notify a user of an interaction with a web application.
    - Request body:
        ```json
        {
          "email": "user@example.com",
          "transid": "transactionId",
          "fees": "transactionFees",
          "appName": "ApplicationName",
          "quantity": "transactionQuantity",
          "transactionTimestamp": "transactionTimestamp"
        }
        ```
    - Response:
        ```json
        {
          "status": "Congrats! Notification Successful!"
        }
        ```

## Cron Job

The application uses a cron job to fetch data from Firebase and query the Acki Nacki blockchain every 30 seconds. This ensures that the notifications are sent promptly.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Nodemailer for email handling.
- Firebase for database services.
- Acki Nacki for blockchain services.

