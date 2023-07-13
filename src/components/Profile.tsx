/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { Text, Grid, Avatar, Spacer, Card } from '@nextui-org/react';
import Button from '@mui/material/Button';
import { openDB } from 'idb';
import axios from 'axios';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

interface UserInfo {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  homeAddress: string;
  mailingAddress: string;
}

export default function Profile() {
  const accessToken = localStorage.getItem('accessToken');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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

  const getUserInfo = async () => {
    try {
      const userId = user?.Id;
      const response = await axios.get(
        `http://localhost:8080/user/${userId}/UserInfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('User Info Response:', response.data);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error retrieving user information:', error);
    }
  };

  useEffect(() => {
    const prevUser = prevUserRef.current;

    if (user && JSON.stringify(prevUser) !== JSON.stringify(user)) {
      getUserInfo();
    }
  }, [user]);

  useEffect(() => {
    console.log('User:', user);
    console.log('Profile Picture:', profilePicture);
    console.log('Error Message:', errorMessage);
    console.log('User Info:', userInfo);
  }, [user, profilePicture, errorMessage, userInfo]);

  const prevUserRef = useRef();

  useEffect(() => {
    prevUserRef.current = user;
  }, [user]);

  return (
    <>
      <Spacer />

      <Grid.Container
        gap={2}
        direction='column'
        alignContent='center'
        alignItems='center'
      >
        <Grid xs={24} md={12}>
          <Card
            className='flex-row justify-center'
            variant='bordered'
            css={{
              width: '55vw',
              background: 'rgba(255, 255, 255, 0.039)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Card.Body>
              <div className='flex flex-row items-center justify-center '>
                <div className='flex flex-col items-center justify-center'>
                  <Spacer />
                  <Text
                    h1
                    size={40}
                    css={{
                      textGradient: '45deg, $blue800 -20%, $purple800 100%',
                      paddingLeft: 15,
                    }}
                    weight='bold'
                  >
                    {user.sub}
                  </Text>
                  <Avatar
                    zoomed
                    css={{
                      mw: '700px',
                      height: '22vh',
                      width: '22vh',
                    }}
                    size='xl'
                    src={
                      profilePicture ||
                      '/ant-high-resolution-logo-color-on-transparent-background_(4).png'
                    }
                    alt='account holder'
                    color='gradient'
                    bordered
                    className='flex mx-auto rounded-full md:w-full cursor-none'
                    pointer
                  />
                  <Spacer y={2} />
                  <Button variant='contained' color='secondary'>
                    <label
                      htmlFor='profilePictureUpload'
                      className='upload-button'
                    >
                      Upload Image
                    </label>
                  </Button>
                  <input
                    type='file'
                    id='profilePictureUpload'
                    accept='image/*'
                    className='hidden'
                    onChange={handleProfilePictureUpload}
                  />

                  <div className='flex flex-col mt-4'>
                    <Spacer y={2} />
                    {errorMessage && <Text color='error'>{errorMessage}</Text>}
                  </div>
                </div>
                <Spacer x={5} />
                <div className='flex flex-col justify-start'>
                  <Text
                    h1
                    size={50}
                    css={{
                      textGradient: '45deg, $blue800 -20%, $purple800 100%',
                    }}
                    weight='bold'
                  >
                    {user?.firstName} {user?.lastName}
                  </Text>
                  {userInfo && (
                    <>
                      <h1>
                        {userInfo.firstName} {userInfo.lastName}
                      </h1>
                      <div>
                        <h3>Phone Number: {userInfo.phoneNumber}</h3>
                        <h3>Email: {userInfo.email}</h3>
                        <h3>Home Address: {userInfo.homeAddress}</h3>
                        <h3>Mailing Address: {userInfo.mailingAddress}</h3>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card.Body>

            <Card.Footer></Card.Footer>
          </Card>
        </Grid>
      </Grid.Container>
    </>
  );
}
