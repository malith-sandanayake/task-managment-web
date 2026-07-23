import type { Request, Response } from "express";
import { loginSchema } from "../validators/auth.validator.js";
import { getUserById, loginUser } from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function login(req: Request, res: Response): Promise <void>{
    // validate data based on instructions in loginSchema zod object -> return true/ false
    const result = loginSchema.safeParse(req.body);

    if (!result.success){
        res.status(400).json({
            success: false,
            message: "Validation Failed",
            errors: result.error.flatten().fieldErrors,
        });

        return;
    }
    
    const { email, password } = result.data;

    const user = await loginUser( email, password );
    
    if (!user){
        res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });

        return;
    }

    const token = generateToken(user.id);

    res.status(200).json({
        success: true,
        message: "Login Successful",
        data: {
            user, token,
        },
    });

}

export async function getCurrentUser(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });

    return;
  }

  const user = await getUserById(userId);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });

    return;
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
}