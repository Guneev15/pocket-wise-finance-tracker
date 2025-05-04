import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "../utils/db"; // Import MySQL database connection

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secure_jwt_secret"; // Use environment variable for production

// Sign Up Endpoint
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    const [existingUserRows]: any = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (Array.isArray(existingUserRows) && existingUserRows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

    // Retrieve the newly created user
    const [newUserRows]: any = await db.query("SELECT id, username FROM users WHERE username = ?", [username]);
    if (!Array.isArray(newUserRows) || newUserRows.length === 0) {
      throw new Error("Failed to retrieve the newly created user");
    }

    // Generate a JWT token
    const token = jwt.sign({ id: newUserRows[0].id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ token, user: { id: newUserRows[0].id, username: newUserRows[0].username } });
  } catch (error) {
    console.error("Error during sign up:", error && error.message ? error.message : error);
    res.status(500).json({ message: error && error.message ? error.message : "An unexpected error occurred during registration" });
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const [userRows]: any = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (!Array.isArray(userRows) || userRows.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const user = userRows[0];
    // Ensure user object has password and id fields
    if (!user || typeof user.password !== "string" || typeof user.id !== "number") {
      return res.status(400).json({ message: "Invalid user data" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error("Error during login:", error && error.message ? error.message : error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Current User Endpoint
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const [userRows]: any = await db.query("SELECT id, username FROM users WHERE id = ?", [decoded.id]);
    if (!Array.isArray(userRows) || userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userRows[0]);
  } catch (error) {
    console.error("Error fetching current user:", error && error.message ? error.message : error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default router;
