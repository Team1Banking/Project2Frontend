import React from 'react';
import {
  Grid,
  Modal,
  Input,
  Row,
  Checkbox,
  Button,
  Text,
  Spacer,
} from '@nextui-org/react';
import CardLogin from './components/CardLogin';
import Tilt from 'react-parallax-tilt';

export default function App() {
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    console.log('closed');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
      }}
    >
      <Grid.Container
        gap={2}
        justify='center'
        className='w-20'
        style={{ marginTop: '50px' }}
      >
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
              textAlign: 'center',
              textGradient: '45deg, $purple600 -20%, $blue600 100%',
            }}
            weight='bold'
          >
            America's favorite bank.
          </Text>

          <Spacer y={2} />
          <Input
            clearable
            bordered
            size='xl'
            labelPlaceholder='Username'
            initialValue='Username'
          />
          <Spacer y={2.5} />
          <Input.Password
            size='xl'
            labelPlaceholder='Password'
            initialValue='nextui123'
          />
          <Spacer y={1.6} />
          <Button auto color='gradient' size='lg' shadow onPress={handler}>
            LOGIN
          </Button>

          <Spacer y={2} />

          <h3>New here? Sign up!</h3>
          <Spacer />
          <Button auto color='warning' size='lg' shadow onPress={handler}>
            REGISTER
          </Button>
          <Modal
            closeButton
            blur
            aria-labelledby='modal-title'
            open={visible}
            onClose={closeHandler}
          >
            <Modal.Header>
              <Text id='modal-title' size={18}>
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
              />
              <Input
                clearable
                bordered
                fullWidth
                color='primary'
                size='lg'
                placeholder='Last Name'
              />
              <Input
                clearable
                bordered
                fullWidth
                color='primary'
                size='lg'
                placeholder='Username'
              />
              <Input
                clearable
                bordered
                fullWidth
                color='success'
                size='lg'
                placeholder='Password'
              />
              <Row justify='space-between'>
                <Checkbox>
                  <Text size={14}>Remember me</Text>
                </Checkbox>
                <Text size={14}>Forgot password?</Text>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button auto onPress={closeHandler}>
                Sign Up
              </Button>
            </Modal.Footer>
          </Modal>
        </Grid>
        <Spacer x={5} />

        <div style={{ width: '400px', marginTop: '112px' }}>
          <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4}>
            <CardLogin />
          </Tilt>
        </div>
      </Grid.Container>
    </div>
  );
}
