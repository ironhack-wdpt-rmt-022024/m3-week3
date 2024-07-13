const express = require("express");
const bcrypt = require("bcryptjs"); // Used for encrypting passwords
const jwt = require("jsonwebtoken"); // Used for creating, signing and verifying JWTs
const User = require("./../models/User.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware");

const router = express.Router();
const saltRounds = 10;


// POST /auth/signup
router.post("/signup", async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
    
        // Check if email, password and name are provided as empty strings
        if (email === '' || password === '' || name === '') {
            res.status(400).json({ message: "Provide email, name, password" });
            return;
        }
        
        // Verify if the email is matching the required format  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
        if (emailRegex.test(email) === false) {
            res.status(400).json({ message: "Provide a valid email address" });
            return;
        }

        // Check if the user with the given email already exists
        const foundUser = await User.findOne({ email: email });

        if (foundUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        // Create the salt and encrypt the password asynchornously -  - genSalt() hash()
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user document with the email, encrypted password and name
        const createdUser = await User.create({ email: email, password: hashedPassword, name: name });
        
        // Destructure the document to omit the password
        const { email: userEmail, name: userName, _id } = createdUser;

        // Create a new object without the password
        const user = { email: userEmail, name: userName, _id: _id };
        
        // Return the response with the user data but without the password
        res.status(201).json({ user: user })
    }
    catch (error) {
        next(err)
    }



    // Check if the user with the given email already exists
    User.findOne({ email: email })
        .then((foundUser) => {
            if (foundUser) {
                res.status(400).json({ message: "User already exists" });
                return;
            }

            // We have to encrypt the password before saving in the DB
            
            // Create the salt and encrypt the password asynchornously -  - genSalt() hash()
            bcrypt.genSalt(saltRounds)
              .then((salt) => {
                  return bcrypt.hash(password, salt);
              })
              .then( (hashedPassword) => {

                  // Crate the new user document with the email, encrypted password and name
                  return User.create({ email: email, password: hashedPassword, name: name });
              })
              .then((createdUser) => {
                  // Destructure the document to omit the password
                  const { email, name, _id } = createdUser;
      
                  // Create a new object without the password
                  const user = { email, name, _id };
                  
                  // Return the response with the user data but without the password
                  res.status(201).json({ user: user })
              })
              .catch((err) => {
                  next(err)
              })


        })
})


// POST /auth/login
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (email === '' || password ===  '') {
            res.status(400).json({ message: "Provide email and password" });
            return;
        }
    
        // Check the users collection if the user with the email address exists
        const foundUser = await User.findOne({ email: email })
        if (!foundUser) {
            res.status(401).json({ message: "User not found" });
            return;
        }
    
        // Compare the password (asynchronously) with the one the password saved in the DB for the user
        const passwordCorrect = await bcrypt.compare(password, foundUser.password);
    
        if (passwordCorrect) {
            // Prepare the user data to include in the token
            const { email, name, _id } = foundUser;

            const user = { email, name, _id };

            // Create and sign a JWT token
            const authToken = jwt.sign(user, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: "90d" })

            // Send back the JWT token in the response
            res.status(200).json({ authToken: authToken });
        } else {
            res.status(400).json({ message: "Unable to authorize the user" })
        }

    }
    catch (error) {
        next(err)
    }
})


// GET /auth/verify - Used to verify the JWT stored on the client is valid
router.get("/verify", isAuthenticated, (req, res, next) => {
    // The middleware will verify if the token  exists and if it is valid

    // If so we just return back a response with the payload (user data)
    res.status(200).json(req.payload);
})


module.exports = router;