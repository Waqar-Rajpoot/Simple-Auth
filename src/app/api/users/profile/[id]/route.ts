import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import {connect} from "@/dbConfig/dbConfig";

connect(); 
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {

  try {
    const user = await User.findById(params.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {    
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}
