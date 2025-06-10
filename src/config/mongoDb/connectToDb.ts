
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
export default  async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL! , {useNewUrlParser: true,
    } as any);
    console.log("connected successfully (mongo)")
  } catch (error) {
    console.log("error DB connect");
  }
};