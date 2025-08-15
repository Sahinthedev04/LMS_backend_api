const bcrypt = require("bcrypt");
const User = require("../models/user");

// ✅ Create user
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone , role} = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !phone || role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email duplicate check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // User create
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: role || "student" 
    });

    res.status(201).json(user); // thanks to toJSON, password hide hoga
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "Invalid user ID" });
  }
};

// ✅ Update user
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "Invalid data" });
  }
};

// ✅ Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid user ID" });
  }
};
