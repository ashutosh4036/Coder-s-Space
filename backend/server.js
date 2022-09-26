require('dotenv').config();
const express = require('express');
const router = require('./routes');
const app = express();
const DbConnect = require('./database')
const cors = require('cors');

const corsOption ={
      origin:['http://localhost:3000'],
}
app.use(cors(corsOption))

const PORT = process.env.PORT || 5500;
DbConnect();
app.use(express.json());
app.use(router);

app.get('/',(req,res)=>{
      res.send('Hello')
});


app.listen(PORT, () =>console.log(`Listensing on port ${PORT}`));