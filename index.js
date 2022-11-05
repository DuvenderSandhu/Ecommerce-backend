const express= require('express')
const jwt= require('jsonwebtoken')
const bp= require('body-parser')
const { body, validationResult } = require('express-validator');
const db= require('./db')
const app= express()
app.use(bp.json())
let cart= []
app.get('/',(req,res)=>{
  res.send("Hello World ")
})

app.get('/contact',(req,res)=>{
  res.send("Contact Page")
})
app.get('/shop',(req,res)=>{
  res.json({shop:db})
})

app.get('/shop/:id',[
  body('_id',("Enter a Valid Order")).exists(),
],(req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let id= parseInt(req.params.id)-1
    if(db[id]){
      res.json(db[id])
    }
    else{
      res.status(400).json({error:"Invalid Order"})
    }
})
app.get('/cart',(req,res)=>{
  if(cart.length==0){
    res.send("Nothing Found on Cart")
  }
  else{
    res.send(cart)
  }

})
app.post('/cart',(req,res)=>{
  let LoggedUser="Test"; // Use that is Logged In 
  if(req.params.id){
    cart.push({user:LoggedUser,id:req.params.id})
    res.send(cart)
  }
  else{
    res.render("/login")
  }
})

app.get('/signup',(req,res)=>{
  res.send("Signup GET")
})
app.get('/login',(req,res)=>{
  res.send("Login GET")
})


app.post('/signup',(req,res)=>{
  res.send("Signup POST")
})
app.post('/login',(req,res)=>{
  
  res.send("Login POST")
})




app.listen(80,()=>{
  console.log("http://localhost")
})