const express = require('express');
const app = express();
const userModel= require('./models/user');
require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get('/',(req,res)=>{
  res.send('working')
  
});

app.post('/', async(req,res)=>{  // No space between async and parameters
  let {username , password, phone , email}= req.body;
  let user = await userModel.create({
    username,
    email,
    phone, 
    password
  });
  res.send(user);  // Does not add a status code
  console.log(user);
});

PORT = 3002;
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`);
  
});