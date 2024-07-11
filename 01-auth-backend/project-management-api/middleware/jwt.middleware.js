const jwt = require("jsonwebtoken");

// Create a middleware function that intercepts the request
// And checks if it contains a JWT authentication token and if it is valid

function isAuthenticated (req, res, next) {
    try {
        // Get the request and check if it has a JWT token on in Headers - "Bearer eyJhbGciOiJIUzI1N..."
        const token = req.headers.authorization.split(" ")[1]  // "Bearer eyJhbGciOiJIUzI1N..." -> ["Bearer", "eyJhbGciOiJIUzI1N..."]
        
        // Verify the JWT: if ok returns token payload, otherwise it throws an error
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);
        
        // Create a custom property on the req object and store the token payload
        req.payload = payload;
        
        // Call next() to pass the request to the next route or middleware
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Invalid token" })
    }
}


module.exports = {
    isAuthenticated
}