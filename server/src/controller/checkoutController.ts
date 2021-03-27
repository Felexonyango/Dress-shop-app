import { Request, Response } from "express";
import User  from "../model/user"
import {Cart} from "../model/Cart"
import {Order} from "../model/Order"
import { client } from "../lib/paypal";
import { User as UserType } from '../types/user'
import mongoose from "mongoose";

const paypal = require("@paypal/checkout-server-sdk");
const getCarts = async (req: Request) => {
  const user = req.user as UserType;
  return await Cart.find({ user: user._id }).populate("product");
};

const calculateCartTotal = async (req: Request): Promise<number> => {
  const carts = await getCarts(req);
  const total = carts.reduce(
    (acc: any, el: any) => acc + el.product.price * el.quantity,
    0
  );
  return total;
};

const createOrder = async (userId: string, amount: number) => {
  const carts = await Cart.find({ user: userId });
  const products = carts.map((cart) => ({
    quantity: cart.quantity,
    product: cart.product,
  }));

  await Order.create({ user: userId, total: amount, products });

  // remove user carts
  await User.findOneAndUpdate(
    { _id: userId },
    {
      carts: [],
    }
  );

  await Cart.remove({
    _id: {
      $in: carts.map((cart) => mongoose.Types.ObjectId(cart._id.toString())),
    },
  });
};


export const createPaypalTransaction = async (req: Request, res: Response) => {
  const total = await calculateCartTotal(req);
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "PHP",
          value: total,
        },
      },
    ],
  });

  let order;
  try {
    order = await client().execute(request);
  } catch (err) {
    return res.send(500);
  }

  res.status(200).json({
    data: {
      orderID: order.result.id,
    },
  });
};

export const capturePaypalTransaction = async (req: Request, res: Response) => {
  const user = req.user as UserType;
  const orderID = req.body.orderID;

  // 3. Call PayPal to capture the order
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client().execute(request);
    const amount = capture.result.purchase_units[0].payments.captures[0].amount.value;

    await createOrder(user._id, amount);
  } catch (err) {
    return res.send(500);
  }

  // 6. Return a successful response to the client
  res.send(200);
};
