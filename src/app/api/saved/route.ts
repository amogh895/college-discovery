import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: {
        college: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      savedColleges: savedColleges.map((sc) => sc.college),
    });
  } catch (error) {
    console.error("Error fetching saved colleges:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved colleges" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { collegeId } = body as { collegeId?: string };

    if (!collegeId) {
      return NextResponse.json(
        { error: "College ID is required" },
        { status: 400 }
      );
    }

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "College already saved" },
        { status: 200 }
      );
    }

    await prisma.savedCollege.create({
      data: {
        userId: session.user.id,
        collegeId,
      },
    });

    return NextResponse.json(
      { message: "College saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving college:", error);
    return NextResponse.json(
      { error: "Failed to save college" },
      { status: 500 }
    );
  }
}
