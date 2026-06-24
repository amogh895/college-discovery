import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.college.count();
    if (count > 0) {
      return NextResponse.json({ message: `Already has ${count} colleges` });
    }

    // Ensure the review author exists as a user
    const user = await prisma.user.upsert({
      where: { email: "rahul.m@example.com" },
      update: {},
      create: {
        name: "Rahul M.",
        email: "rahul.m@example.com",
        password: "hashedPasswordPlaceholder", // Placeholder password
      },
    });

    await prisma.college.create({
      data: {
        name: "IIT Bombay",
        location: "Mumbai",
        state: "Maharashtra",
        fees: 250000,
        rating: 4.8,
        type: "GOVERNMENT",
        description: "Premier engineering institute.",
        courses: { create: [{ name: "B.Tech Computer Science", duration: "4 years", fees: 250000 }] },
        placements: { create: [{ year: 2023, avgPackage: 2100000, highestPackage: 6500000 }] },
        reviews: {
          create: [{
            rating: 5,
            comment: "Best institute in India.",
            userId: user.id,
          }],
        },
      },
    });

    return NextResponse.json({ message: "Success! College created." });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}