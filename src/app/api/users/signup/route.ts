import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (!email && !password && !username) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        { status: 400 }
      );
    }

    console.log(reqBody);

    const user = await User.findOne({ email });

    console.log("hello one");
    
    if (user) {
      return NextResponse.json(
        {
          message: "email is already registered",
          success: false,
        },
        { status: 400 }
      );
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    // send email

    await sendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });

    return NextResponse.json(
      {
        message: "user created successfully",
        success: true,
        savedUser,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
