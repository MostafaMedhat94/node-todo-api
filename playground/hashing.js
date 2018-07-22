const {SHA256} = require('crypto-js');
const {SHA512} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc!';

bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, (error, hash) => {
        console.log(hash);
    });
});

const hashedPassword = '$2a$10$uro68vif/KdyMVqUIoPs.uAehcTZ5T1oOJ1HEnJto4a6XF9/kpcmi';

bcrypt.compare(password, hashedPassword, (error, res) => {
    console.log(res);
});


// const data ={
//   id: 10
// }
//
// const token = jwt.sign(data, '123abc');
// console.log(token);
// const decoded = jwt.verify(token, '123abc');
// console.log(decoded);


//
// const message = 'I am user number 3';
// const hash = SHA512(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);


// const data = {
//   id: 4
// };
// const token = {
//   data,
//   hash: SHA512(JSON.stringify(data) + 'somesecret').toString()
// };
//
// const resultHash = SHA512(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data wasn\'t changed. Safe to go.');
// } else {
//   console.log('Data was changed. Don\'t trust.');
// }
