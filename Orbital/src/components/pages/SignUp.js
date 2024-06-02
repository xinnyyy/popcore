import React from 'react';
import './SignUp.css';
import { Button } from '../Button'; 
import { Link } from 'react-router-dom';

function SignUp() {
  return (
    <div className='signup-container'>
      <section className='signup-login'>
        <p className='signup-heading'>
          POPCORE
        </p>
        <div className='input-areas'>
          <form>
            <div className='input-row'>
              <input
                className='signup-input'
                name='email'
                type='email'
                placeholder='Email'
              />
            </div>
            <div className='input-row'>
              <input
                className='signup-input'
                name='password'
                type='password'
                placeholder='Password'
              />
            </div>
            <div className='input-row'>
              <Button buttonSize='btn--small'>LOGIN</Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
