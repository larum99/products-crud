const User = require("../models/User");
const jwt = require("jsonwebtoken");

// user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "The user is already registered."})
        }

        const newUser = new User({
            name,
            email,
            password,
            role,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered succesfully"});
    } catch (error) {
        res.status(500).json({ message: "Error to register user", error: error.message});
    }
};

// login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email});
        if (!user) {
            return res.status(400).json({ message: "User not found"});
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password"});
        }

        // create token
        const token = jwt.sign({ id: user._id, role: user.role }, )
    }
}