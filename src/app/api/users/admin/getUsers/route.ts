import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDatatFromToken } from "@/helpers/getDataFromToken";
import {connect} from "@/dbConfig/dbConfig";

export async function GET(req: NextRequest) {
  try {
    await connect();
    
    // Get the logged-in user ID from the token
    const adminId = getDatatFromToken(req);
    const adminUser = await User.findById(adminId);

    // Check if the user is an admin
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Admins only." }, { status: 403 });
    }

    // Fetch all users
    const users = await User.find().select("-password"); // Exclude password
    return NextResponse.json({ users });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
