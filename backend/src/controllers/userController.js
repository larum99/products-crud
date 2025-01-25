const User = require("../models/User");
const jwt = require("jsonwebtoken");

// user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "El usuario ya está registrado"})
        }

        const newUser = new User({
            name,
            email,
            password,
            role,
        });

        await newUser.save();

        res.status(201).json({ message: "Usuario registrado exitosamente"});
    } catch (error) {
        res.status(500).json({ message: "Error para registrar usuario", error: error.message});
    }
};

// login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email});
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado"});
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta"});
        }

        // create token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "10m",
        });

        res.status(200).json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        res.status(500).json({ message: "Inicio de sesión fallido", error: error.message });
    }
};

// get profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado"});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo perfil", error: error.message });
    }
};

module.exports = { registerUser, loginUser, getProfile };