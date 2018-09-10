const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

var password = '123abc!'

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//       console.log(hash);
//     });
// }) //bigger number, the longer it'll take (harder to brute force)


var hashedPassword = '$2a$10$cTxnJFESYGnDQiHqfcVXe.EJHt.5gRdmp23H.RU46LO05uzMnH.gW'

bcrypt.compare('123abc1', hashedPassword, (err, res) => {
  console.log(res);
})












// const {SHA256} = require('crypto-js');
//
// const jwt = require('jsonwebtoken');
//
// var data = {
//   id: 10
// }
//
// var token = jwt.sign(data, '123abc') //(obj, secret)
//
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
//
// console.log('decoded', decoded);


//to hash value, pass into SHA256 function

// var message = 'I am user number 3';
//
// var hash = SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// }; //want to send this data back to the client
// // need to ensure client doesn't change 4 to 5 and delete user 5's database
//
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString() //store resulting hash
// }
// //salt the hash -- add something unique that changes the value
// //use different salt every time
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust');
// }
