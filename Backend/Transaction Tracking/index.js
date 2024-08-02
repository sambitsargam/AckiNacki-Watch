const axios = require('axios');
const CronJob = require('cron').CronJob;

const firebaseDatabaseURL = 'https://ackiwatch-default-rtdb.firebaseio.com/';
const ackiNackiGraphQLURL = 'https://ackinacki-testnet.tvmlabs.dev/graphql';

const fetchDataFromFirebase = async () => {
  try {
    const response = await axios.get(`${firebaseDatabaseURL}/data.json`);
    const data = response.data;
    console.log('Fetched data from Firebase:', data);
    const walletAddresses = Object.values(data).map(entry => entry.walletAddress);
    const emails = Object.values(data).map(entry => entry.email);
    
    console.log('Wallet addresses and emails:', walletAddresses, emails);
    
    // Fetch transactions for all wallet addresses
    for (let i = 0; i < walletAddresses.length; i++) {
      const walletAddress = walletAddresses[i];
      const email = emails[i];
      console.log('Fetching transactions for wallet address:', walletAddress);
    
      // Call the fetchTransactions function with the extracted wallet address and email
      await fetchTransactions(walletAddress, email);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching data from Firebase:', error.message);
    return null;
  }
};

// Use the extracted wallet address to fetch transactions from the Acki Nacki blockchain
const fetchTransactions = async (walletAddress, email) => {
  try {
    const transactionsQuery = `{
      blockchain {
        account(address: "${walletAddress}") {
          transactions(first: 25) {
            edges {
              node {
                id
                now
                tr_type
                tr_type_name
                account_addr
                balance_delta(format: DEC)
              }
              cursor
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }
    }`;

    const response = await axios.post(ackiNackiGraphQLURL, {
      query: transactionsQuery,
    });

    const transactions = response.data.data.blockchain.account.transactions.edges.map(edge => edge.node);

    // Filter transactions by timestamp (last 30 seconds)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const filteredTransactions = transactions.filter(transaction => {
      const transactionTimestamp = transaction.now; // Assuming `now` is in UNIX format
      return currentTimestamp - transactionTimestamp <= 30;
    });

    // Now check if the filtered transactions are more than 0
    if (filteredTransactions.length > 0) {
      console.log('Filtered transactions found', filteredTransactions);
      // Send individual emails to each owner with their corresponding transactions
      for (const transaction of filteredTransactions) {
        const ownerEmail = email;
        const transid = transaction.id;
        const balanceDelta = transaction.balance_delta;
        const transactionTimestamp = new Date(transaction.now * 1000).toUTCString();

        // Send the transaction details to the nodemailer API
        const response = await axios.post('https://trackrhub.onrender.com/receipt', {
          email: ownerEmail,
          transid: transid,
          balanceDelta: balanceDelta,
          transactionTimestamp: transactionTimestamp,
        });
        console.log("Response is", response);
        console.log('Email sent successfully', ownerEmail);
        console.log('Transaction:', transaction);
      }
    } else {
      console.log('No transactions found within the last 30 seconds');
    }
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
  }
};

// Schedule the job to run every 30 seconds
const cronJob = new CronJob('*/30 * * * * *', fetchDataFromFirebase);

// Start the cron job
cronJob.start();
