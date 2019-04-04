const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({urlencoded: false}));
app.use(bodyParser.json());

const db = 'mongodb+srv://mayuri2305:mayuri@cluster0-mhqo2.mongodb.net/astrolabs?retryWrites=true';
mongoose
    .connect(db,{useNewUrlParser: true})
    .then(() => console.log('Connect to database'))
    .catch(err => console.log(err));

//Homepage
app.get('/',(req,res)=>{
    res.send("Welcome to the homepage");
});

//About
app.get('/about',(req,res)=>{
    res.send("<b>About Us</b>");
});

//Profile
app.get('/profile/:username',(req,res)=>{
    const userName = req.params.username;
    res.send("Welcom back " + userName);
});

//Contact
app.get('/contact',(req,res)=>{
    res.send(" Our Contact: 04 123 4444");
});

//Register User
app.post('/register',(req,res)=>{
    const newUser= new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });

    newUser.save()
        .then(user => res.json(user))
        .catch( err => console.log(err));
});

//GET request
app.get('/get-users', (req, res)=>{
    User.find({})
        .then(data =>{
            res.json(data);
        })
});

//GET a the user
app.get('/get-user/:userName', (req, res)=>{
    const paramUserName = req.params.userName
    User.find({userName: paramUserName})
        .then(data =>{
            res.json(data);
        })
});

//GET request for product
app.get('/get-product', (req, res) => {
    Product.find({})
          // .sort({price: -1}) 
         
           .then(data =>{
                /* For alphabets

              let names = ['Zebra', 'gorilla','mongoose', 'ape'];
              names.sort((nameA, nameB)=>{
	            if(nameA.toLowerCase() < nameB.toLowerCase()) {
	                	return -1
                } 
            	if (nameA.toLowerCase() > nameB.toLowerCase()){
	                	return 1;
                }
             }); */
            
            data.sort((objA, objB) => {
                if(objA.brand.toLowerCase() < objB.brand.toLowerCase()) {
                    return -1
                } 
                if (objA.brand.toLowerCase() > objB.brand.toLowerCase()){
                    return 1;
                }
             }); 

            /* For Numbers

             const prices = ['100', '500','25', '73'];
             prices.sort((numA, numB)=>{
                 return parseInt(numA) - parseInt(numB);
             }); */
             //ascending order
           /*   data.sort((objA, objB) => {
                
                    return parseInt(objA.price) - parseInt(objB.price);
            
             }); */
             //descending order
           /*   data.sort((objA, objB) => {
                
                return parseInt(objB.price) - parseInt(objA.price);
             }); */
            
               res.json(data);
           });
});

//Update Product
app.put('/update-product', (req, res) => {
    Product.findOneAndUpdate(
        {name: req.body.name},
        {brand: req.body.brand},
        {},
        (err, data) => {
            res.json(data);
        }
    )
});

//Add products
app.post('/add-product', (req,res) => {
    const newProduct= new Product({
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price
    });

    newProduct.save()
        .then(product => res.json(product))
        .catch( err => console.log(err));
});


//Everything else
app.get('*',(req, res) => {
    res.send('404');
});

const port =process.env.PORT || 5050;
app.listen(port, ()=>{
    console.log('Server is running on port', port);
    console.log(`http://localhost:${port}/`);
});