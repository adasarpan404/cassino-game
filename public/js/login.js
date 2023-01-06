import axios from 'axios';

/**
 * 
 * @param {*} phonenumber string
 * @param {*} password string
 * @description responsible for login 
 */
export async function login(phonenumber, password){
    try {
        console.log(phonenumber, password)
        const res = await axios({
            method: 'POST',
            url: '/api/v1/auth/login',
            data: {
                phonenumber,
                password,
            }
        })
        if (res.data.status === 'success') {
            console.log(res)
        }
    }
    catch (err) {
        alert('error');
    }
}