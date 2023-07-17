import { sheets } from "@/utils/constants";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  return NextResponse.json(
    sheets.map((sheet) => {
      return {
        id: uuidv4(),
        nombre: sheet,
      };
    })
  );
}
