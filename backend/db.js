const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            writeConcern: { w: "majority" },
           
        });
        console.log("Connected to DB successfully :)");
    } catch (err) {
        console.error("An error occurred while connecting to the DB:", err.message);
    }
};

module.exports ={connectDB} 
