const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "El correo debe tener un formato válido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
      maxlength: [16, "La contraseña no puede tener más de 16 caracteres"],
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[*$\-#]).{8,16}$/.test(
            value
          );
        },
        message:
          "La contraseña debe tener al menos una minúscula, una mayúscula, un número y un carácter especial (*, $, -, #)",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: [true, "El rol es obligatorio"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  });

// Middleware to encrypt the password before saving

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema, "users");

module.exports = User;