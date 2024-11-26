import { Request, Response } from "express";
import { User } from "../models/User.js";


// Register a new user
export const newUser = async (req: Request, res: Response) => {
  try {
    const { email, uid, photo, name } = req.body;
    
    const isExist = await User.findOne({ uid });
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    
    const user = await User.create({ email, uid, photo, name });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Failed to register",
      });
    }

    res.status(201).json({
      success: true,
      user,
      message: "Registration successful",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Login user
export const getUser = async (req: Request, res: Response) => {
  try {
    const { email, uid } = req.body;
    const user = await User.findOne({ email, uid });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email or UID is incorrect",
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Check if user exists
export const isExist = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;
    const user = await User.findOne({ uid });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }
    
    return res.json({
      success: true,
      message: "User found",
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
