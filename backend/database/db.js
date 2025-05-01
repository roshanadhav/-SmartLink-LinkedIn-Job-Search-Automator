import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connection = async () => {
  await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('connection successful'))
    .catch(err => console.log('mongo connection err', err));
};

export default connection;
