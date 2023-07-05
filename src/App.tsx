import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  Modal,
  Input,
  Button,
  Text,
  Spacer,
  PressEvent,
} from '@nextui-org/react';
import CardLogin from './components/CardLogin';
import Tilt from 'react-parallax-tilt';

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log('closed');
  };

  const register = async () => {
    const user = { firstName, lastName, username, password };
    console.log(user);

    try {
      const registerUrl = process.env.REACT_APP_REGISTER_API_URL;
      if (!registerUrl) {
        throw new Error('REGISTER URL is not defined.');
      }

      const response = await axios.post(registerUrl, user);

      if (response.status >= 200 && response.status < 300) {
        setSubmissionStatus(`${user.username} was successfully registered!`);
        navigate('/');
      } else {
        throw new Error('User is already registered');
      }
    } catch (error) {
      console.log(error);
      setSubmissionStatus('User is already registered');
    }
  };

  const login = async (e: PressEvent) => {
    const credentials = { username, password };
    console.log(credentials);
    try {
      const loginUrl = process.env.REACT_APP_LOGIN_API_URL;
      if (!loginUrl) {
        throw new Error('LOGIN URL is not defined.');
      }

      const response = await axios.post(loginUrl, credentials);

      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);

      const parsedToken = parseJwt(accessToken);
      console.log(parsedToken);
      if (parsedToken.Role === 'Account Holder') {
        navigate('/accountHolder');
      } else {
        setErrorMessage('Please register an account.');
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          setErrorMessage('Invalid username or password. Please try again.');
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      } else {
        setErrorMessage(
          'An error occurred. Please check your internet connection and try again.'
        );
      }
    }
  };

  function parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
      }}
    >
      <Grid.Container gap={2} justify='center' style={{ marginTop: '70px' }}>
        <Grid direction='column'>
          <Spacer y={5} />
          <Text
            h1
            size={30}
            css={{
              textGradient: '45deg, $purple600 -20%, $blue600 100%',
            }}
            weight='bold'
          >
            Welcome to MAD-J
          </Text>
          <Text
            h1
            size={70}
            css={{
              textGradient: '45deg, $purple600 -20%, $blue600 100%',
            }}
            weight='bold'
          >
            America's favorite
            <br />
            way to Bank.
          </Text>

          <Spacer y={2} />
          <div>
            <div className='flex row-auto'>
              <Input
                clearable
                bordered
                size='xl'
                value={username}
                labelPlaceholder='Username'
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Spacer y={2.5} />
              <Input.Password
                clearable
                bordered
                size='xl'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                labelPlaceholder='Password'
                required
              />
              <Spacer y={1.6} />
              <Button
                auto
                color='gradient'
                size='lg'
                shadow
                onPress={(e) => login(e)}
              >
                LOGIN
              </Button>
            </div>
            <Spacer y={2} />
            <div className='flex'>
              <div>
                <h3>New here? Sign up!</h3>
                <Spacer />
                <Button auto color='warning' size='lg' shadow onPress={handler}>
                  REGISTER
                </Button>
              </div>
              <Spacer x={3} />
              <div>
                <h3>Create new bank account ?</h3>
                <Spacer />
                <Button
                  auto
                  color='secondary'
                  size='lg'
                  shadow
                  onPress={handler}
                >
                  CREATE ACCOUNT
                </Button>
              </div>
            </div>
          </div>
          <Spacer y={1.6} />
          {errorMessage && (
            <div style={{ textAlign: 'center' }}>
              <Text color='#ff0000'>{errorMessage}</Text>
            </div>
          )}
          <Spacer />

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Modal
              closeButton
              blur
              aria-label='Registration Modal'
              open={visible}
              onClose={closeHandler}
            >
              <Modal.Header>
                <Text
                  h1
                  size={30}
                  css={{
                    textGradient: '45deg, $purple600 -20%, $blue600 100%',
                  }}
                  weight='bold'
                >
                  Registration
                </Text>
              </Modal.Header>
              <Modal.Body>
                <Input
                  clearable
                  bordered
                  fullWidth
                  color='primary'
                  size='lg'
                  placeholder='First Name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  clearable
                  bordered
                  fullWidth
                  color='secondary'
                  size='lg'
                  placeholder='Last Name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <Input
                  clearable
                  bordered
                  fullWidth
                  color='warning'
                  size='lg'
                  placeholder='Username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <Input
                  clearable
                  bordered
                  fullWidth
                  color='success'
                  size='lg'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Modal.Body>
              <Modal.Footer>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    auto
                    color='primary'
                    shadow
                    size='lg'
                    onClick={register}
                  >
                    Sign Up
                  </Button>
                </div>
              </Modal.Footer>
              {submissionStatus && (
                <Text
                  color='#FF0000'
                  css={{
                    textAlign: 'center',
                  }}
                >
                  {submissionStatus}
                </Text>
              )}
              <Spacer x={1} />
            </Modal>
          </div>
        </Grid>
        <Spacer x={3} />

        <div style={{ width: '475px', marginTop: '95px' }}>
          <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4}>
            <CardLogin />
          </Tilt>
        </div>
      </Grid.Container>
    </div>
  );
}
