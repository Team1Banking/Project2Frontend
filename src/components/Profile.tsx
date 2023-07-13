/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, ChangeEvent } from 'react';
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
    if (user) {
      getUserInfo();
    }
  }, [user]);

  useEffect(() => {
    console.log('User:', user);
    console.log('Profile Picture:', profilePicture);
    console.log('Error Message:', errorMessage);
    console.log('User Info:', userInfo);
  }, [user, profilePicture, errorMessage, userInfo]);

  return (
    <>
      <Spacer />

      <Grid.Container
        gap={2}
        direction='column'
        alignContent='center'
        alignItems='center'
      >
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

        <Grid xs={24} md={12}>
          <Card
            className='flex-row justify-evenly'
            variant='bordered'
            css={{
              width: '65vw',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Card.Body>
              <div className='flex items-center justify-between '>
                <div className='flex p-5 pr-12 space-between'>
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
                  {userInfo && (
                    <>
                      <h1>
                        {userInfo.firstName} {userInfo.lastName}
                      </h1>
                      <div>
                        <h3>Phone Number: {userInfo.phoneNumber}</h3>
                        <h3>Email: {userInfo.email}</h3>
                        {/* <h3>Home Address: {userInfo.homeAddress}</h3>
                        <h3>Mailing Address: {userInfo.mailingAddress}</h3> */}
                      </div>
                    </>
                  )}
                  <div className='flex flex-col pl-20'>
                    <h1 className=''>
                      {user?.firstName} {user?.lastName}
                    </h1>
                  </div>
                  <div className='flex flex-col mt-4'>
                    <Spacer y={2} />
                    {errorMessage && <Text color='error'>{errorMessage}</Text>}
                  </div>
                </div>
              </div>

              <Grid.Container gap={2} className='flex'>
                <Spacer y={6} />
                <div className='flex'>
                  {/* <div className='flex flex-col w-56'>
                    <Input
                      clearable
                      bordered
                      labelPlaceholder='Update First Name'
                    />
                    <Spacer y={2.5} />
                    <Input
                      clearable
                      bordered
                      labelPlaceholder='Update Last Name'
                    />
                  </div>
                  <Spacer y={2.5} />
                  <div className='flex flex-col w-56'>
                    <Input
                      clearable
                      bordered
                      labelPlaceholder='Update Username'
                    />

                    <Spacer y={2.5} />
                    <Input
                      clearable
                      bordered
                      labelPlaceholder='Update Password'
                    />
                  </div>
                  <Spacer y={2.5} />
                  <div className='flex flex-col w-56'>
                    <Input clearable bordered labelPlaceholder='Update Email' />
                    <Spacer y={2.5} />
                    <Input
                      clearable
                      bordered
                      labelPlaceholder='Update Phone Number'
                    />
                  </div>
                  <Spacer y={2.5} />
                  <div className='flex flex-col w-56'>
                    <Input
                      clearable
                      bordered
                      labelPlaceholder='Update Phone Number'
                    />

                    <Spacer y={2.5} />
                    <Input
                      clearable
                      bordered
                      labelPlaceholder='Update Mailing Address'
                    />
                  </div> */}
                </div>
              </Grid.Container>
            </Card.Body>

            <Card.Footer>
              <Button
                variant='contained'
                color='secondary'
                sx={{ marginLeft: 'auto' }}
              >
                <label htmlFor='profilePictureUpload' className='upload-button'>
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
            </Card.Footer>
          </Card>
        </Grid>
      </Grid.Container>
    </>
  );
}
