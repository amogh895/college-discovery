import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        { error: "Please provide college IDs via ?ids=id1,id2,id3" },
        { status: 400 }
      );
    }

    const ids = idsParam.split(",").filter(Boolean);

    if (ids.length < 2 || ids.length > 3) {
      return NextResponse.json(
        { error: "Please provide 2 or 3 college IDs to compare" },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      include: {
        courses: true,
        placements: {
          orderBy: { year: "desc" },
          take: 1,
        },
      },
    });

    if (colleges.length < 2) {
      return NextResponse.json(
        { error: "One or more colleges not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error("Error comparing colleges:", error);
    return NextResponse.json(
      { error: "Failed to fetch comparison data" },
      { status: 500 }
    );
  }
}
