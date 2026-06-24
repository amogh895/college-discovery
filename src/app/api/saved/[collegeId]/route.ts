import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ collegeId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { collegeId } = await params;

    const existing = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Saved college not found" },
        { status: 404 }
      );
    }

    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
    });

    return NextResponse.json({ message: "College unsaved successfully" });
  } catch (error) {
    console.error("Error unsaving college:", error);
    return NextResponse.json(
      { error: "Failed to unsave college" },
      { status: 500 }
    );
  }
}
