const express = require("express");
const {users} = require("../data/users.json");

const router = express.Router();

// 
// route: /users
// method: GET
// description: get all the users in the system
// access: public
// parameters: none

router.get("/",(req,res)=>{
    res.status(200).json({
        success: true,
        data:users
       
       
 })
})

// route: /users/:id
// method: GET
// description: get a single user by id
// access: public
// parameters: id

router.get('/:id',(req,res)=>{

    const {id} = req.params;
    const user = users.find((each)=>each.id === id);

    if(!user){
        return res.status(404).json({
            success: false,
            message: `user not found for id: ${id}`
        })
    }

    res.status(200).json({
        success: true,
        data: user
})
})


// route: /
// method: POST
// description: Create/register a new user
// access: public
// parameters: id

router.post('/',(req,res)=>{
    // id": "1",
    // "name": "John Doe",
    // "email": "john@example.com",
    // "phone": "555-0101",
    // "membershipDate": "2024-01-15",
    // "status": "active",
    // "subscriptionType": "premium",
    // "subscriptionDate": "2024-01-15"

    const {id,name,email,phone,membershipDate,status,subscriptionType,subscriptionDate} = req.body;
    if(!id || !name || !email || !phone || !membershipDate || !status || !subscriptionType || !subscriptionDate){
        return res.status(400).json({
            success: false,
            message: "all fields are required"
        })
    }
    const user= users.find((each)=>each.id === id);
    if(user){
        return res.status(400).json({
            success: false,
            message: `user already exists for id: ${id}`
        })
    }
    users.push({id,name,email,phone,membershipDate,status,subscriptionType,subscriptionDate});
    res.status(201).json({
        success: true,
        message: "user created successfully"
    })
})

// route: /users
// method: POST
// description: Create/register a new user
// access: public
// parameters: id

router.put('/:id',(req,res)=>{
    const {id} = req.params;
    const {data} = req.body;

    // check if user exists
    const user = users.find((each)=>each.id === id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: `user not found for id: ${id}`
        })

    }
    // with spread operator
    const updatedUser = users.map((each)=>{
        if(each.id === id){
            return {
                ...each,
                ...data
            }
        }
        return each;
})
res.status(200).json({
    success: true,
    message: "user updated successfully",
    
})
})


// route: /users/:id
// method: DELETE
// description: delete a user by id
// access: public
// parameters: id

router.delete('/:id',(req,res)=>{
    const {id} = req.params;

    // check if user exists
    const user = users.find((each)=>each.id === id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: `user not found for id: ${id}`
        })
    }
    // if user exists,filter it out frm the users array
    // const updatedUsers = users.filter((each)=>each.id !== id);
    
   
  


    const updatedUsers = users.filter((each)=>each.id !== id);
    res.status(200).json({
        success: true,
        message: "user deleted successfully",
        data: updatedUsers
    })
})

//route: /users/subscription-details/:id 
// method: get
// description: get subscription details of a user by id
// access: public
// parameters: id

router.get('/subscription-details/:id', (req, res) => {
    const { id } = req.params;

    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User not found for id: ${id}`
        });
    }

    const getDateInDays = (data = '') => {
        let date;
        if (data) {
            date = new Date(data);
        }else {
            date = new Date();
        }
        let days = Math.floor((date / (1000 * 60 * 60 * 24)));
        return days;
    };

    const subscriptionType = (date) => {
        if(user.subscriptionType === 'Basic') {
            date = date + 90;
        } else if(user.subscriptionType === 'Standard') {
            date = date + 180;
        } else if(user.subscriptionType === 'Premium') {
            date = date + 365;
        }
        return date;
    };

    // subscription expiration calculation
    // january 1, 1970 UTC //milliseconds since epoch
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        subscriptionDaysLeft: subscriptionExpiration - currentDate ,
        daysLeftForExpiration: returnDate - currentDate,
        returnDate: returnDate < currentDate ? "No book issued" : returnDate,
        fine: returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200 : 100 : 0
    };
    
    
    res.status(200).json({
        success: true,
        data: data
    });
});

module.exports = router;
