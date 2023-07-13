import { useState } from 'react';
import axios from 'axios';

import { Input, Button, Modal, Text, Spacer } from '@nextui-org/react';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [visible, setVisible] = useState(false);

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
      } else {
        throw new Error('User is already registered');
      }
    } catch (error) {
      console.log(error);
      setSubmissionStatus('User is already registered');
    }
  };

  return (
    <div>
      <div className='flex flex-row'>
        <h3>New here? Sign up!</h3>
        <Spacer />
        <Button
          auto
          color='warning'
          size='lg'
          shadow
          onPress={() => setVisible(true)}
        >
          REGISTER
        </Button>
      </div>

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
            <Button auto color='primary' shadow size='lg' onClick={register}>
              Sign Up
            </Button>
          </div>
        </Modal.Footer>
        {submissionStatus && (
          <Text
            color='#00ff33'
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
  );
}
