import React, { useState, useEffect, ChangeEvent } from 'react';
import { Text, Grid, Avatar, Badge, Spacer } from '@nextui-org/react';
import './Profile.css';
import Button from '@mui/material/Button';
import { openDB } from 'idb';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export default function Profile() {
  const accessToken = localStorage.getItem('accessToken');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    console.log('jsonPayload:', jsonPayload);
    return JSON.parse(jsonPayload);
  }

  console.log('accessToken:', accessToken);

  const user = accessToken ? parseJwt(accessToken) : null;

  useEffect(() => {
    const loadProfilePicture = async () => {
      const db = await openDB('myDatabase', 1, {
        upgrade(db) {
          db.createObjectStore('profiles');
        },
      });
      const tx = db.transaction('profiles', 'readonly');
      const store = tx.objectStore('profiles');
      const picture = await store.get(user?.sub || '');
      setProfilePicture(picture || null);
    };

    if (user) {
      loadProfilePicture();
    }
  }, [user]);

  const handleProfilePictureUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size <= MAX_IMAGE_SIZE) {
        const reader = new FileReader();
        reader.onload = async () => {
          const imageDataUrl = reader.result as string;

          const db = await openDB('myDatabase', 1, {
            upgrade(db) {
              db.createObjectStore('profiles');
            },
          });
          const tx = db.transaction('profiles', 'readwrite');
          const store = tx.objectStore('profiles');
          await store.put(imageDataUrl, user?.sub || '');
          await tx.done;

          setProfilePicture(imageDataUrl);
          setErrorMessage(null);
        };
        reader.readAsDataURL(file);
      } else {
        setErrorMessage('Please upload an image smaller than 2MB.');
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Grid.Container className='flex justify-center p-6'>
      <Grid xs={12} sm={10} md={8} lg={6} xl={4}>
        <div className='p-6 text-center rounded-xl glass-background'>
          <Avatar
            css={{
              width: '150px',
              height: '150px',
              transition: 'width 0.3s, height 0.3s',
              objectFit: 'contain',
            }}
            zoomed
            size='xl'
            src={
              profilePicture ||
              '/ant-high-resolution-logo-color-on-transparent-background_(4).png'
            }
            alt='account holder'
            color='gradient'
            bordered
            className='mx-auto mb-6 cursor-none'
            pointer
          />

          <Text h1>
            {user.firstName} {user.lastName}
          </Text>
          <Spacer />
          <Badge>{user.Role}</Badge>
          <Spacer y={2} />
          <Text>Username: {user.sub}</Text>
          <Text>Account Number: {user.iat}</Text>
          <Spacer y={2} />
          {errorMessage && <Text color='error'>{errorMessage}</Text>}
          <Button
            variant='contained'
            color='secondary'
            sx={{ marginLeft: 'auto' }}
          >
            <label htmlFor='profilePictureUpload' className='upload-button'>
              Upload
            </label>
          </Button>
          <input
            type='file'
            id='profilePictureUpload'
            accept='image/*'
            className='hidden'
            onChange={handleProfilePictureUpload}
          />
        </div>
      </Grid>
    </Grid.Container>
  );
}
