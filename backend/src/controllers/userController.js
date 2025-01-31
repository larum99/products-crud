const User = require("../models/User");
const jwt = require("jsonwebtoken");

// user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        // Ensure role is either 'user' or 'admin'
        if (role && !['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: "El rol debe ser 'user' o 'admin'" });
        }

        const newUser = new User({
            name,
            email,
            password,
            role: role || 'user', // Default role is 'user'
        });

        await newUser.save();

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar el usuario", error: error.message });
    }
};

// login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // Create token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "10h",
        });

        // 🔥 Agregar la información del usuario en la respuesta
        res.status(200).json({ 
            message: "Inicio de sesión exitoso", 
            token,
            user: { id: user._id, role: user.role }  // <--- Aquí agregamos el usuario
        });

    } catch (error) {
        res.status(500).json({ message: "Inicio de sesión fallido", error: error.message });
    }
};

module.exports = { registerUser, loginUser };
