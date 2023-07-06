import React from 'react';
import { Text } from '@nextui-org/react';

export default function RecentTransactions() {
  return (
    <>
      {' '}
      <Text
        h1
        size={40}
        css={{
          textGradient: '45deg, $yellow600 -20%, $red600 100%',
        }}
        weight='bold'
      >
        Recent Transactions
      </Text>
    </>
  );
}
