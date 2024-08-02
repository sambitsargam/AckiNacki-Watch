import React, { useState, useContext } from "react";
import { Card, Grid, Row, Text, Loading } from "@nextui-org/react";
import PageTitle from "../components/Typography/PageTitle";
import {
  Input,
  Button,
  HelperText,
  Label,
  Select,
  Textarea,
} from "@windmill/react-ui";
import axios from "axios";
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css";
import { useUserAddress } from "../context/UserAddressContext";

const convertTimestampToUTC = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert the timestamp to milliseconds
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' };
    return date.toLocaleString('en-US', options);
};

const ConvertBalance = (balance) => {
// make it to devided by 1000000000
    return balance / 1000000000;
};

export default function Transaction() {
  const { userAddress } = useUserAddress();
  const [balance, setBalance] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // GraphQL query for Acki Nacki blockchain
      const query = `
        query {
          blockchain {
            account(address: "${userAddress}") {
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
        }
      `;

      const response = await axios.post("https://gra01.network.gosh.sh/graphql", { query });
      const transactionsData = response.data.data.blockchain.account.transactions.edges.map(edge => edge.node);

      // Assuming the balance can be fetched separately or is part of the transactions data
      const balance = transactionsData.reduce((acc, tx) => acc + parseFloat(tx.balance_delta), 0);
      setBalance(balance);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error while fetching transactions:", error);
      setBalance("");
      setTransactions([]);
    }
    setLoading(false);
  };



  const columns = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Transaction Type',
      accessor: 'tr_type_name',
    },
    {
      Header: 'Account Address',
      accessor: 'account_addr',
    },
    {
      Header: 'Balance Delta',
      accessor: 'balance_delta',
    },
    {
      Header: 'Timestamp (UTC)',
      accessor: 'now',
      Cell: ({ value }) => convertTimestampToUTC(value),
    },
  ];

  return (
    <>
      <PageTitle>MY Dashboard</PageTitle>
      <div className="w-max"></div>
      <div className="grid md:grid-cols-5 grid-col-9 lg:grid-cols-1 gap-7">
        <div>
          <div className="block overflow-hidden border border-gray-100 rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex flex-row items-center justify-between">
                <h5 className="text-xl font-bold dark:text-white">Your Wallet Address</h5>
              </div>
              <h5 className="text-md font-bold w-5/12 dark:text-white text-white rounded-full bg-blue-400">
                {userAddress}
              </h5>
            </div>
            <div className="p-6">
              <div className="flex flex-row items-center justify-between">
                <h5 className="text-xl font-bold dark:text-white">Your Wallet Balance</h5>
              </div>
              <h5 className="text-md font-bold w-2/12 dark:text-white text-white rounded-full bg-blue-400">
                {balance} ACK
              </h5>
            </div>
            <div className="p-6">
              <Button onClick={fetchTransactions} disabled={loading}>
                {loading ? <Loading size="xs" /> : "Fetch Transactions"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <PageTitle>MY Transaction</PageTitle>
      <div className="w-max"></div>
      <div className="grid md:grid-cols-5 grid-col-9 lg:grid-cols-1 gap-7">
        <div>
          <div className="block overflow-hidden border border-gray-100 rounded-lg shadow-sm">
            <ReactTable data={transactions} columns={columns}>
              {(state, makeTable, instance) => {
                return (
                  <div
                    style={{
                      background: 'lightblue',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      padding: '5px'
                    }}
                  >
                    {makeTable()}
                  </div>
                )
              }}
            </ReactTable>
          </div>
        </div>
      </div>
    </>
  );
}
