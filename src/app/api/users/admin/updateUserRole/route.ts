import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDatatFromToken } from "@/helpers/getDataFromToken";
import {connect} from "@/dbConfig/dbConfig";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const adminId = getDatatFromToken(req);
    const adminUser = await User.findById(adminId);

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Admins only." }, { status: 403 });
    }

    // Extract the target user ID and new role from request
    const { userId: targetUserId, role } = await req.json();
    
    // Validate the new role
    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    // Update the user's role
    await User.findByIdAndUpdate(targetUserId, { role });

    return NextResponse.json({ message: `User role updated to ${role}.` });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
