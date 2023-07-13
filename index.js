const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const login = require("./router/login");
const blogrouter = require("./router/blog");
const compression = require("compression");


dotenv.config();



mongoose.connect(process.env.MONGO)
.then(() => { console.log(`connected`) })
.catch((err) => console.log(err))

app.use(compression({
    level: 6,
    threshold: 10 * 1000,
    filter: (req, res) => {
         if(req.headers['x-no-compression']){
            return false
         }
         return compression.filter(req, res)
    }
}))
app.use(express.json({limit: '1000000mb'}));
app.use(express.urlencoded({limit: '1000000mb'}));
app.use(cors());

app.use(login);
app.use(blogrouter);


const PORT = process.env.PORT;



app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));

// Password -clikintechweb