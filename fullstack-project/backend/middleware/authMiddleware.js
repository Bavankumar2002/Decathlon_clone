const { verifyToken } = require("../utils/jwt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Middleware to authenticate requests using JWT Bearer tokens.
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: No Token Provided"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: Invalid or Expired Token"
      });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: User Not Found"
      });
    }

    if (!user.status) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Account has been suspended"
      });
    }

    // Attach user information to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during Authentication",
      error: error.message
    });
  }
}

module.exports = authMiddleware;
