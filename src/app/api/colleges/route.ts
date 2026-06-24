import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { CollegeType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const state = searchParams.get("state") || "";
    const minFees = searchParams.get("minFees");
    const maxFees = searchParams.get("maxFees");
    const minRating = searchParams.get("minRating");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);

    const where: Record<string, unknown> = {};

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    if (type && Object.values(CollegeType).includes(type as CollegeType)) {
      where.type = type as CollegeType;
    }

    if (state) {
      where.state = { equals: state, mode: "insensitive" };
    }

    if (minFees || maxFees) {
      where.fees = {};
      if (minFees) (where.fees as Record<string, number>).gte = parseInt(minFees, 10);
      if (maxFees) (where.fees as Record<string, number>).lte = parseInt(maxFees, 10);
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating) };
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { rating: "desc" },
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      colleges,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    return NextResponse.json(
      { error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}
