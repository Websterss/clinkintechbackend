const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const login = require("./router/login");

dotenv.config();



mongoose.connect(process.env.MONGO)
.then(() => { console.log(`connected`) })
.catch((err) => console.log(err))

app.use(express.json())
app.use(cors());

app.use(login)


const PORT = process.env.PORT;



app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));

// Password -clikintechweb