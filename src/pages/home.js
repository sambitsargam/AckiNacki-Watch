import React, { useState } from 'react';
import { Label, Input, Button } from '@windmill/react-ui';
import axios from 'axios';
import { useUserAddress } from "../context/UserAddressContext";

function Home() {
  const { userAddress, setUserAddress } = useUserAddress();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    // Prepare the data to be sent to the Firebase Realtime Database
    const data = {
      walletAddress: userAddress.trim(),
      email: email.trim(),
    };

    // Make the POST request to the Firebase Realtime Database
    axios.post('https://ackiwatch-default-rtdb.firebaseio.com/data.json', data)
      .then((response) => {
        alert('Your subscription has been saved successfully! Please check your email (including spam folder) for confirmation.');
        console.log('Response:', response);
      })
      .catch((error) => {
        console.error('Error saving data to Firebase:', error);
      });

    try {
      const response = await fetch('https://trackrhub.onrender.com/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      setMessage(result.status);
    } catch (error) {
      console.error('Error subscribing:', error);
      setMessage('Error subscribing. Please try again later.');
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src="https://cdn.dorahacks.io/static/files/1910bf4e7e99d840d3d45dd416495a75.png@256h.webp"
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src="https://cdn.dorahacks.io/static/files/1910bf4e7e99d840d3d45dd416495a75.png@256h.webp"
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Subscribe to Notification
              </h1>

              <Label>
                <span>Your Wallet Address</span>
                <Input
                  className="mt-1"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  placeholder="Enter your wallet address manually"
                />
              </Label>
              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sambit@gmail.com"
                />
              </Label>

              <Button onClick={handleSubscribe} block className="mt-4">
                Subscribe
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Home;
