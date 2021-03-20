const mongoose = require('mongoose');

const config = require('config');
const mongoURI = `mongodb+srv://${config.get('MONGO_USER')}:${config.get('MONGO_PASSWORD')}@cluster0.jm3oc.mongodb.net/${config.get('MONGO_DEFAULT_DATABASE')}?retryWrites=true&w=majority`;
// const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.jm3oc.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

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