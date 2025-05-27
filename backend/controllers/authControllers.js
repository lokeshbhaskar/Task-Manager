import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register a new user
//@route POST /api/auth/register
//@access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken } =
      req.body;
    // check if user exist
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    //determine user role: admin if correct token is provided, otherwise member
    let role = "member";
    if (
      adminInviteToken &&
      adminInviteToken == process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    //Create new user
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      profileImageUrl,
      role,
    });
    // return userdata with jwt
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// @desc Login user
//@route POST /api/auth/login
//@access Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  //checking user
  if (!user) {
    return res.status(401).json({ message: " Invalid email or password " });
  }
  //matching password or comparing password
  const isMtach = await bcrypt.compare(password, user.password);
  if (!isMtach) {
    return res.status(401).json({ message: " Invalid email or password " });
  }
  // return user data with jwt
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImageUrl: user.profileImageUrl,
    token: generateToken(user._id),
  });
};

//@desc Get user profile
//@route Get /api/auth/profile
//@access Private ( require JWT)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@desc Get user profile
//@route Get /api/auth/profile
//@access Private ( require JWT)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({ message: "user not found" });
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password,salt);
        }
        const updateUser = await user.save();
        res.json({
            _id: updateUser._id,
            name:updateUser.name,
            email:updateUser.email,
            role:updateUser.role,
            token:generateToken(updateUser._id)
        });
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message });
    }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile };
