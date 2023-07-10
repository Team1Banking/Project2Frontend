import React, { useState } from 'react';
import axios from 'axios';
import { Button, Spacer, Text, Checkbox } from '@nextui-org/react';

export default function RegisterAccount() {
  const [errorMessage, setErrorMessage] = useState('');
  const [checkingSelected, setCheckingSelected] = useState(false);
  const [savingsSelected, setSavingsSelected] = useState(false);
  const [accountMessage, setAccountMessage] = useState('');

  const createAccount = async () => {
    try {
      const url = 'http://localhost:8080/account/register';
      const accountType = checkingSelected
        ? 'Checking'
        : savingsSelected
        ? 'Savings'
        : '';

      const payload = {
        acctType: accountType,
      };

      const response = await axios.post(url, payload);

      setAccountMessage('Account created successfully.');
      console.log('Response data:', response.data);
    } catch (error) {
      console.error(error);
      setAccountMessage('Account could not be created.');
    }
  };

  return (
    <>
      <div>
        <Checkbox
          isSelected={checkingSelected}
          color='success'
          labelColor='success'
          onChange={() => setCheckingSelected(!checkingSelected)}
        >
          Checking
        </Checkbox>
        <Checkbox
          isSelected={savingsSelected}
          color='warning'
          labelColor='warning'
          onChange={() => setSavingsSelected(!savingsSelected)}
        >
          Savings
        </Checkbox>
        <Button auto color='gradient' size='lg' shadow onClick={createAccount}>
          SUBMIT
        </Button>
        <Spacer y={1.6} />
        <Text>{accountMessage}</Text>
      </div>
    </>
  );
}
