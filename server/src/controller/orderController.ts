import { Request, Response } from 'express';
import {Iuser as UserTypes } from "../model/user"
import { Order } from "../model/Order"

export const index = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserTypes;
    const orders = await Order.find({ user: user._id })
      .populate('products.product')
      .sort('-createdAt');
    res.status(200).json({ data: { orders } });
  } catch (error) {
    return res.status(500).json({ message: 'Error in getting orders' });
  }
};
