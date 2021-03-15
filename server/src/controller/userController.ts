import { Request, Response } from "express";
import User  from "../model/user"
import {upload}from  '../lib/Aws'

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, image } = req.body;

    let user = await User.findById(id);

    if (!user)
      return res.status(404).json({ error: { message: "User not found" } });

    if (user.id !== id) {
      return res
        .status(402)
        .json({ error: { message: "Ops user id mismatch" } });
    }

    if (image) {
      // upload base64 image to cloudinary
      const imageURL = await  upload.AWS.single(image)
     const  user = await User.findOneAndUpdate(
        imageURL ,
        {name ,email,id}
        
        
      );
    } else {
      user = await User.findOneAndUpdate(
        { _id: id },
        { name, email },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    res
      .status(500)
      .json({ error: { message: "Error in updating user details" } });
  }
};
