const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');

const app = express();
const port = 3000

app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    optionSuccessStatus: 200
    })
  );
  
  const verifyToken = (req, res, next) => {
    const token = req.cookies?.token
    if(!token) return res.status(401).send({ message: "unauthorized access" })
  
  
    jwt.verify(token, process.env.TOKEN, (err, decoded) => {
      if(err) return res.status(403).send({ message: "unauthorized access" })
        req.user = decoded;
      next();
    })
  
  }

  


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_KEY}@payswift.6tdsiqc.mongodb.net/?retryWrites=true&w=majority&appName=PaySwift`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const database = client.db("PaySwift");
    const usersCollection = database.collection("users");


    
    // login 
    app.post("/jwt" , async (req, res) => {

      const {email, password} = req.body;        
        
        const user = await usersCollection.findOne({ email });
                
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return res.status(401).send({ message: "Invalid email or password" });
        }
        
        const token = jwt.sign(user, process.env.TOKEN, { expiresIn: '365d' });
        
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        }).send({ success: true });
      })


      app.get('/verify-token', verifyToken, async (req, res) => {
        const userEmail = req.user.email;
        console.log(userEmail);
        const user = await usersCollection.findOne({ email: userEmail });
        console.log(user)
        if (!user) return res.status(404).send({ message: "User not found" });
        res.send({ user });
      });

      
      
      // creating a user 
      app.post("/signup", async (req, res) => {
        const { email, password, name, role, number } = req.body;
        
        // Check if the user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(400).send({ message: "User already exists" });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user
        const newUser = {
          email,
          password: hashedPassword,
          name,
          role,
          number
        };
        
        // Insert the new user into the database
        const result = await usersCollection.insertOne(newUser);
        
        // Create a JWT token for the new user
        const token = jwt.sign({ id: result.insertedId, email: newUser.email }, process.env.TOKEN, { expiresIn: '365d' });
        
        // Set the token in the cookies
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        }).send({ success: true });
      });
      
      
      // Removing a token from browser after a user logouts 
      app.get('/logout', async (req, res) => {
        try {
          res.clearCookie("token", {
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          }).send({ success: true });
        }catch(err) {
          console.error("Error logging out: ", err);
          return res.status(500).send(err);
        }
      })
      

      app.get('/user/:email', async (req, res) => {
        const email = req.params.email;
        const user = await usersCollection.findOne({ email });
        if (!user) return res.status(404).send({ message: "User not found" });
        res.send(user);
      })









    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})