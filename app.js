const express = require('express');
const app = express();
const userModel= require('./models/user');
require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get('/resgiter',(req,res)=>{
  res.send('Regiter Yourself First')
  
});

app.post('/register', async(req,res)=>{  
  let {username , password, phone , email}= req.body;
  let user = await userModel.create({
    username,
    email,
    phone, 
    password
  });
  res.send(user);  
  console.log(user);
});

app.get('/login',(req,res)=>{
  res.send('Login Yourself First')
  
});

app.post('/login', async(req,res)=>{  
  let user = userModel.findOne({email: req.body.email});
  if(!user) {
    console.log(user);
    
    return res.send('Something Went Wrong');
  }
  else {
    res.send('You Can login!!');
  }
});

PORT = 3002;
app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`);
  
});