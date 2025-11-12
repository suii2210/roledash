const { ObjectId } = require("mongodb");
const { verifyToken } = require("../utils/jwt");
const { getDb } = require("../lib/mongo");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = verifyToken(token);

    let userId;
    try {
      userId = new ObjectId(decoded.sub);
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }

    const db = await getDb();
    const userDoc = await db.collection("users").findOne(
      { _id: userId },
      { projection: { password: 0 } }
    );

    if (!userDoc) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
      createdAt: userDoc.createdAt,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
