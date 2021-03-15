import   mongoose,{ Model, Schema, Document ,Types} from "mongoose";
import bcrypt from "bcryptjs"
import { Role } from "../types/role";
export interface Iuser extends Document{
  name: string;
  email: string;
  password: string;
  imageURL: string;
  role: Role;
  carts: Types.ObjectId[]
  googleId:String
  comparePassword(candidatepassword: string): Promise<boolean>;
}
  
export interface UserModel extends Model<Iuser> {
  
  
}

const UserSchema :Schema= new Schema(
  {
    name:{
        type:String,
        required: [true, 'Please enter a full name']

    }, 
    email: {
        type:String,
        required:true,
    },
    
    password:{
        type :String,
        required:true

    },
    role:{
        type:String
       

    },
    googleId:{
      types:String
  },
  imageURL: String,
  
  
    carts: [
      {
        type: "ObjectId",
        ref: "Cart",
      },
    ],
  },
  {
    timestamps: true,
  }
);


UserSchema.pre<Iuser>("save", async function (next) {
  const user = this;

  if (!user.isModified ("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;

  next();
});

UserSchema.methods.comparePassword = async function (candidatepassword: string): Promise<boolean> {
  const user = <Iuser>this;
  return await bcrypt.compare(candidatepassword, user.password);
};

const User=  mongoose.model<Iuser , UserModel >("User", UserSchema);
export default User;