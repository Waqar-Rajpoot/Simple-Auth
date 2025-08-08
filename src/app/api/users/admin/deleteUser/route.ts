import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDatatFromToken } from "@/helpers/getDataFromToken";
import {connect} from "@/dbConfig/dbConfig";

export async function DELETE(req: NextRequest) {
  try {
    await connect();

    const adminId = getDatatFromToken(req);
    const adminUser = await User.findById(adminId);

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Admins only." }, { status: 403 });
    }

    // Get target user ID
    const { userId } = await req.json();

    // Delete the user
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "User deleted successfully." });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
