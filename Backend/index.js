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
    const transactions = database.collection("transactions");


    
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
        const user = await usersCollection.findOne({ email: userEmail });
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
          number,
          accountStatus: "pending",
          balance: 0
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

      // getting all by search users from db 
      app.get('/users', async (req, res) => {
        const search = req.query.search
        const query = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { number: { $regex: search, $options: 'i' } },
          ]
        }
        const users = await usersCollection.find(query).toArray();
        res.send(users);
      })

      // getting all users from db 
      app.get('/allUsers', async (req, res) => {
        const users = await usersCollection.find().toArray();
        res.send(users);
      })


      app.get('/sendAmount/:id', async (req, res) => {
        const id = req.params.id;
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        console.log(user)
        if (!user) return res.status(404).send({ message: "User not found" });
        res.send(user);
      })

      app.patch('/changeStatus', async (req, res) => {
        const {status, email} = req.body;

        const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    let newBalance = user.balance;

    if (user.role === 'user') {
      newBalance += 40;
    } else if (user.role === 'agent') {
      newBalance += 10000;
    }

    const updatedUser = await usersCollection.findOneAndUpdate(
      { email },
      { $set: { accountStatus: status, balance: newBalance } },
      { returnOriginal: false } 
    );

    res.send({ success: true, user: updatedUser.value });
      })


      app.patch('/sendMoney', async (req, res) => {
        const money = parseInt(req.body.money);
        const receiverEmail = req.body.email;
        const senderEmail = req.body.senderEmail;

        const receiver = await usersCollection.findOne({ email: receiverEmail });
        const sender = await usersCollection.findOne({ email: senderEmail });
        if (!receiver) {
          return res.status(404).send({ message: 'User not found' });
        }

        let senderBalance = parseInt(sender.balance) - money;
        let receiverBalance = parseInt(receiver.balance) + money;

        const updatedSender = await usersCollection.findOneAndUpdate(
          { email:senderEmail },
          { $set: { balance: parseInt(senderBalance) } },
          { returnOriginal: false } 
        );

        const updatedReceiver = await usersCollection.findOneAndUpdate(
          { email: receiverEmail },
          { $set: { balance: parseInt(receiverBalance) } },
          { returnOriginal: false } 
        );


        const transaction = {
          senderEmail,
          receiverEmail,
          amount: money,
          date: new Date(),
          senderNumber: sender.number,
          receiverNumber: receiver.number,
          status: 'completed'

        }

        const enterTransaction = await transactions.insertOne(transaction)

        res.send({success: true})

      })

      // Checking password by comparing the password
      app.get('/checkPassword', (req, res) => {
        const { email, checkingPassword } = req.body;
        
        const user = usersCollection.findOne({ email });
        
        if (!user || !bcrypt.compareSync(checkingPassword, user.password)) {
          return res.status(401).send({ message: "Invalid password" });
        }
        
        res.send({ success: true });
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