import React, { useEffect, useState } from 'react';
import { Card, Col, Text } from '@nextui-org/react';

const images = [
  'https://images.pexels.com/photos/3206079/pexels-photo-3206079.jpeg',
  'https://images.pexels.com/photos/7149136/pexels-photo-7149136.jpeg',
  'https://images.pexels.com/photos/5926252/pexels-photo-5926252.jpeg',
];

export default function CardLogin() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Card css={{ width: '100%', height: 'auto' }}>
        <Card.Image
          src={images[currentImageIndex]}
          width='100%'
          height={600}
          objectFit='cover'
          alt='Card image background'
        />
        <Card.Footer css={{ position: 'absolute', zIndex: 1, top: 5 }}>
          <Col>
            <Text
              size={12}
              weight='bold'
              transform='uppercase'
              color='#ffffffAA'
            >
              MAD-J
            </Text>
            <Text h4 color='white'>
              America's favorite bank
            </Text>
          </Col>
        </Card.Footer>
      </Card>
    </div>
  );
}
