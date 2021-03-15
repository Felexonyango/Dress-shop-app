import mongoose from 'mongoose';

export const connectDb = async () => {
  const conn = await mongoose.connect('mongodb+srv://Test2:Db@test.8zhgx.mongodb.net/test?w=majority&retryWrites=true',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }).then(() => console.log('Database connected'))
  .catch(err => console.log(err));

 
};