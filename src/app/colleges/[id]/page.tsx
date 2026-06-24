import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CollegeDetailClient from "./CollegeDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const college = await prisma.college.findUnique({
    where: { id },
    select: { name: true, location: true, state: true },
  });

  if (!college) {
    return { title: "College Not Found" };
  }

  return {
    title: `${college.name} — CollegeDiscover`,
    description: `Explore ${college.name} in ${college.location}, ${college.state}. View courses, placements, reviews, and more.`,
  };
}

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      courses: true,
      placements: { orderBy: { year: "desc" } },
      reviews: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!college) {
    notFound();
  }

  return <CollegeDetailClient college={JSON.parse(JSON.stringify(college))} />;
}
