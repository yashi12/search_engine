const mongoose = require('mongoose');

const config = require('config');
const mongoURI = process.env.MONGO_URL.toString();

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.log(err.message);
        //Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;
