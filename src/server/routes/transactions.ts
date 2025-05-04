import express from "express";
import { executeQuery } from "../utils/db";

const router = express.Router();

router.delete("/transactions/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result: any = await executeQuery("DELETE FROM transactions WHERE id = ?", [id]);

    console.log("Delete query result:", result); // Log the result for debugging

    // Ensure affectedRows is checked correctly
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
