const { PrismaClient } = require("@prisma/client");
const { hashPassword, comparePassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/jwt");
const { z } = require("zod");

const prisma = new PrismaClient();

// Zod schemas for input validation
const registerSchema = z.zodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().regex(/^\d+$/, "Phone must contain numbers only").optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
}).refine(data => data.email || data.phone, {
  message: "Either email or phone number is required",
  path: ["email"]
});

const emailLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

const phoneLoginSchema = z.object({
  phone: z.string().regex(/^\d+$/, "Phone must contain numbers only"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

/**
 * Register a new user
 */
async function register(req, res) {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message
      });
    }

    const { name, email, phone, password } = parseResult.data;

    // Check email uniqueness if provided
    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered"
        });
      }
    }

    // Check phone uniqueness if provided
    if (phone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone } });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already registered"
        });
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save user
    const user = await prisma.user.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        password: hashedPassword
      }
    });

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during registration",
      error: error.message
    });
  }
}

/**
 * Login user
 */
async function login(req, res) {
  try {
    const { email, phone, password } = req.body;
    let user = null;

    if (email) {
      // Email Login Validation
      const parseResult = emailLoginSchema.safeParse({ email, password });
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: parseResult.error.errors[0].message
        });
      }

      user = await prisma.user.findUnique({ where: { email } });
    } else if (phone) {
      // Phone Login Validation
      const parseResult = phoneLoginSchema.safeParse({ phone, password });
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: parseResult.error.errors[0].message
        });
      }

      user = await prisma.user.findUnique({ where: { phone } });
    } else {
      return res.status(400).json({
        success: false,
        message: "Email or Phone number is required to login"
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials"
      });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials"
      });
    }

    if (!user.status) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Account has been suspended"
      });
    }

    // Generate JWT Token
    const token = generateToken({ id: user.id, email: user.email });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during login",
      error: error.message
    });
  }
}

/**
 * Get profile of logged-in user
 */
async function getMe(req, res) {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message
    });
  }
}

/**
 * Logout
 */
async function logout(req, res) {
  return res.json({
    success: true,
    message: "Logged out successfully"
  });
}

/**
 * Stub Forgot Password
 */
async function forgotPassword(req, res) {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or Phone is required"
      });
    }

    // Verify user exists
    const user = email 
      ? await prisma.user.findUnique({ where: { email } })
      : await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    // Mock reset token / flow
    console.log(`[Auth] Password reset link requested for user: ${email || phone}`);
    
    return res.json({
      success: true,
      message: "Reset link has been sent successfully (simulated)"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error processing request",
      error: error.message
    });
  }
}

/**
 * Stub Reset Password
 */
async function resetPassword(req, res) {
  try {
    const { email, phone, newPassword } = req.body;
    if ((!email && !phone) || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    const user = email 
      ? await prisma.user.findUnique({ where: { email } })
      : await prisma.user.findUnique({ where: { phone } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return res.json({
      success: true,
      message: "Password reset successful! You can now log in."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message
    });
  }
}

module.exports = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword
};
