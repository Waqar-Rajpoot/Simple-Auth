import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log(reqBody);


    //! Done on frontend

    // if (!email && !password) {
    //   return NextResponse.json(
    //     {
    //       error: "All fields are required",
    //     },
    //     { status: 400 }
    //   );
    // }


    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          error: "User does not exist",
        },
        { status: 400 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      console.log("Invalid password");
      return NextResponse.json(
        {
          error: "Invalid password",
        },
        { status: 400 }
      );
    }

    const tokenData = {
      id: user._id,
      role: user.role,
      username: user.username,
      email: user.email,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1h",
    });
    const response = NextResponse.json({
      message: "login successfully",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
