const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  wishlist: user.wishlist || [],
});

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    });

    res.status(201).json({
      message: "Registration Successful",
      token: signToken(newUser),
      user: serializeUser(newUser),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    res.json({
      token: signToken(user),
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== "primafashionbag@gmail.com" ||
      password !== "prima123"
    ) {
      return res.status(400).json({ message: "Invalid Admin Credentials" });
    }

    let adminUser = await User.findOne({ email });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      adminUser = await User.create({
        name: "Prima Admin",
        email,
        password: hashedPassword,
        role: "admin",
      });
    } else if (adminUser.role !== "admin") {
      adminUser.role = "admin";
      await adminUser.save();
    }

    res.json({
      token: signToken(adminUser),
      user: serializeUser(adminUser),
      message: "Admin Login Success",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
