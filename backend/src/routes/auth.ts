import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/database";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name: name, email, password } = req.body;

    // Check if user already exists
    const existingUsersResult = await query(
      "SELECT * FROM users WHERE email = ? OR name = ?",
      [email, name]
    );
    const existingUsers = Array.isArray(existingUsersResult)
      ? existingUsersResult
      : [];

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user_id = uuidv4();
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await query(
      "INSERT INTO users (user_id, name, email, password_hash) VALUES (?, ?, ?, ?)",
      [user_id, name, email, hashedPassword]
    );

    // Generate JWT token
    const token = jwt.sign(
      { user_id, name },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user_id, name, email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const usersResult = await query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const users = Array.isArray(usersResult) ? usersResult : [];

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = users[0] as any;

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as {
      user_id: string;
      username: string;
    };

    // Get user from database
    const usersResult = await query("SELECT * FROM users WHERE user_id = ?", [
      decoded.user_id,
    ]);
    const users = Array.isArray(usersResult)
      ? (usersResult as unknown as {
          user_id: string;
          name: string;
          email: string;
        }[])
      : [];

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    res.json({
      id: user.user_id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Error getting current user" });
  }
});

export { router };
