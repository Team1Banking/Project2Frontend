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
        style={{ marginTop: '70px' }}
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
                labelPlaceholder='Username'
                initialValue='username'
              />
              <Spacer y={2.5} />
              <Input.Password
                clearable
                bordered
                size='xl'
                labelPlaceholder='Password'
                initialValue='password'
              />
              <Spacer y={1.6} />
              <Button auto color='gradient' size='lg' shadow onPress={handler}>
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
          <div className='flex justify-center'>
            <Modal
              closeButton
              blur
              aria-labelledby='modal-title'
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
                />
                <Input
                  clearable
                  bordered
                  fullWidth
                  color='secondary'
                  size='lg'
                  placeholder='Last Name'
                />
                <Input
                  clearable
                  bordered
                  fullWidth
                  color='warning'
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
                <Button auto color='primary' size='lg' onPress={closeHandler}>
                  Sign Up
                </Button>
              </Modal.Footer>
              <Spacer />
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
