import '@babel/polyfill';

import {login} from './login.js'

const loginForm = document.querySelector('.loginForm')


if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const phonenumber = document.getElementById('phonenumber').value;
        const password = document.getElementById('password').value;
        login(phonenumber, password)
    })
}
