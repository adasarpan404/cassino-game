import axios from 'axios';

/**
 * 
 * @param {*} phonenumber string
 * @param {*} password string
 * @description responsible for login 
 */
export const login = async (phonenumber, password) => {
    console.log(phonenumber, password)
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/auth/login',
            data: {
                phonenumber: phonenumber,
                password: password,
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