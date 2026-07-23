import type { Request, Response } from "express";
import { loginSchema } from "../validators/auth.validator.js";
import { loginUser } from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";

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