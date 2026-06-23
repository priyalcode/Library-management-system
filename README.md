# Library-management-system

 This is a library management API backend for the 
 management of users and the books

# Routes and the Endpoints

# /users
GET:get all the list of users in the system
POST:Create/register a new user

## /users{id}
GET:get a user by their ID
PUT:Updating a user by their ID
DELETE:Deleting a user by their ID(check if the user still has an issued book)&&{is there any fine/penaltyto be collected}

## /users/subscription-details/{id}
GET:get a user subscription details by their ID
>> Date of subscription
>> Valid till??
>> Fine if any??


## /books
GET: GET all the books in the system
POST: Add a new book to the system

## /books/{id}
GET:Get a book by its ID
PUT:Update a book by its ID
DELETE:Delete a book by its ID

## /books/issued
GET:Get all the issued books

## /books/issued/withfine
GET:Get all issued books with their fine amount

### subscirption data

>> basic (3 months)
>> standard(6 months)
>> premium(12 months)


>> If a user misses the renewal date, then user should be collected with $100
>> If a user misses his subscription , then user is expected to pay $100
>> If a user misses both renewal & subscription , then the collected amount should be $200

# commands
npm init
npm i express
npm i nodemon  --save-dev

npm run dev

to restore nodemodule and package locl json -->npm i/npm install