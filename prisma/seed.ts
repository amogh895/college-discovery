// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connStr = (process.env.DATABASE_URL || "").replace(
  /[?&]sslmode=[^&]*/g,
  ""
);
const pool = new Pool({
  connectionString: connStr,
  ssl: { rejectUnauthorized: true },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  const authors = [
    "Rahul M.", "Priya S.", "Amit K.", "Sneha R.", "Arun K.", "Lakshmi R.",
    "Vikram J.", "Ananya P.", "Karthik V.", "Meera L.", "Rohit D.", "Divya N.",
    "Suresh B.", "Pooja M.", "Nitin S.", "Riya G."
  ];

  console.log("Creating users for review authors...");
  const hashedDummyPassword = await bcrypt.hash("password123", 10);
  const userMap: Record<string, string> = {};

  for (const author of authors) {
    const email = `${author.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: author,
        email,
        password: hashedDummyPassword
      }
    });
    userMap[author] = user.id;
  }

  const colleges = [
    {
      name: "IIT Bombay",
      location: "Mumbai",
      state: "Maharashtra",
      fees: 250000,
      rating: 4.8,
      type: "GOVERNMENT",
      description: "Premier engineering institute known for cutting-edge research and innovation.",
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 250000 },
        { name: "B.Tech Electrical", duration: "4 years", fees: 250000 },
        { name: "M.Tech AI", duration: "2 years", fees: 150000 },
      ],
      placements: [
        { year: 2023, avgPackage: 2100000, highestPackage: 6500000 },
        { year: 2022, avgPackage: 1900000, highestPackage: 5800000 },
      ],
      reviews: [
        { rating: 5, comment: "Best institute in India. World class faculty.", author: "Rahul M." },
        { rating: 4.5, comment: "Amazing research opportunities and campus life.", author: "Priya S." },
      ],
    },
    {
      name: "IIT Delhi",
      location: "New Delhi",
      state: "Delhi",
      fees: 240000,
      rating: 4.7,
      type: "GOVERNMENT",
      description: "Top-ranked technical university with excellent industry connections.",
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 240000 },
        { name: "B.Tech Mechanical", duration: "4 years", fees: 240000 },
        { name: "MBA", duration: "2 years", fees: 400000 },
      ],
      placements: [
        { year: 2023, avgPackage: 2000000, highestPackage: 6200000 },
        { year: 2022, avgPackage: 1850000, highestPackage: 5500000 },
      ],
      reviews: [
        { rating: 5, comment: "Excellent placements and faculty.", author: "Amit K." },
        { rating: 4, comment: "Great campus but high academic pressure.", author: "Sneha R." },
      ],
    },
    {
      name: "IIT Madras",
      location: "Chennai",
      state: "Tamil Nadu",
      fees: 260000,
      rating: 4.9,
      type: "GOVERNMENT",
      description: "Consistently ranked number 1 in NIRF. Known for research excellence.",
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 260000 },
        { name: "B.Tech Aerospace", duration: "4 years", fees: 260000 },
        { name: "M.Tech Data Science", duration: "2 years", fees: 160000 },
      ],
      placements: [
        { year: 2023, avgPackage: 2200000, highestPackage: 7000000 },
        { year: 2022, avgPackage: 2000000, highestPackage: 6200000 },
      ],
      reviews: [
        { rating: 5, comment: "Best in the country. Period.", author: "Arun K." },
        { rating: 5, comment: "World class research environment.", author: "Lakshmi R." },
      ],
    },
    {
      name: "BITS Pilani",
      location: "Pilani",
      state: "Rajasthan",
      fees: 520000,
      rating: 4.6,
      type: "DEEMED",
      description: "Autonomous university famous for its WILP and practice school programs.",
      courses: [
        { name: "B.E. Computer Science", duration: "4 years", fees: 520000 },
        { name: "B.E. Electronics", duration: "4 years", fees: 520000 },
        { name: "M.Sc Mathematics", duration: "2 years", fees: 300000 },
      ],
      placements: [
        { year: 2023, avgPackage: 1800000, highestPackage: 5500000 },
        { year: 2022, avgPackage: 1600000, highestPackage: 4800000 },
      ],
      reviews: [
        { rating: 4.5, comment: "Great autonomy and internship culture.", author: "Vikram J." },
        { rating: 4, comment: "Expensive but worth every rupee.", author: "Ananya P." },
      ],
    },
    {
      name: "NIT Trichy",
      location: "Tiruchirappalli",
      state: "Tamil Nadu",
      fees: 180000,
      rating: 4.4,
      type: "GOVERNMENT",
      description: "One of the top NITs with strong alumni network and industry ties.",
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 180000 },
        { name: "B.Tech Civil", duration: "4 years", fees: 180000 },
      ],
      placements: [
        { year: 2023, avgPackage: 1400000, highestPackage: 4200000 },
        { year: 2022, avgPackage: 1200000, highestPackage: 3800000 },
      ],
      reviews: [
        { rating: 4, comment: "Solid placements, good faculty.", author: "Karthik V." },
        { rating: 4.5, comment: "Best NIT in South India.", author: "Meera L." },
      ],
    },
    {
      name: "VIT Vellore",
      location: "Vellore",
      state: "Tamil Nadu",
      fees: 420000,
      rating: 4.1,
      type: "PRIVATE",
      description: "Large private university known for its tech fest and diverse student community.",
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 420000 },
        { name: "B.Tech Biotech", duration: "4 years", fees: 380000 },
        { name: "MBA", duration: "2 years", fees: 500000 },
      ],
      placements: [
        { year: 2023, avgPackage: 900000, highestPackage: 3200000 },
        { year: 2022, avgPackage: 820000, highestPackage: 2900000 },
      ],
      reviews: [
        { rating: 4, comment: "Great infrastructure and tech opportunities.", author: "Rohit D." },
        { rating: 3.5, comment: "Good for networking, average academics.", author: "Divya N." },
      ],
    },
    {
      name: "Manipal Institute of Technology",
      location: "Manipal",
      state: "Karnataka",
      fees: 480000,
      rating: 4.0,
      type: "PRIVATE",
      description: "Well-known private university with global collaborations and modern facilities.",
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 480000 },
        { name: "B.Tech Mechatronics", duration: "4 years", fees: 460000 },
      ],
      placements: [
        { year: 2023, avgPackage: 850000, highestPackage: 2800000 },
        { year: 2022, avgPackage: 780000, highestPackage: 2500000 },
      ],
      reviews: [
        { rating: 4, comment: "Excellent campus life and facilities.", author: "Suresh B." },
        { rating: 3.5, comment: "Good college but fees are high.", author: "Pooja M." },
      ],
    },
    {
      name: "Delhi Technological University",
      location: "New Delhi",
      state: "Delhi",
      fees: 160000,
      rating: 4.2,
      type: "GOVERNMENT",
      description: "State government university with strong engineering programs.",
      courses: [
        { name: "B.Tech Computer Science", duration: "4 years", fees: 160000 },
        { name: "B.Tech Electronics", duration: "4 years", fees: 160000 },
      ],
      placements: [
        { year: 2023, avgPackage: 1100000, highestPackage: 3500000 },
        { year: 2022, avgPackage: 980000, highestPackage: 3100000 },
      ],
      reviews: [
        { rating: 4, comment: "Great value for money.", author: "Nitin S." },
        { rating: 4, comment: "Good placements for a state university.", author: "Riya G." },
      ],
    },
  ];

  for (const collegeData of colleges) {
    const { courses, placements, reviews, ...college } = collegeData;
    
    // Map reviews to connect to user ids
    const reviewsWithUserId = reviews.map(r => ({
      rating: r.rating,
      comment: r.comment,
      userId: userMap[r.author]
    }));

    try {
      const created = await prisma.college.upsert({
        where: { name: college.name },
        update: {},
        create: {
          ...college,
          type: college.type as "GOVERNMENT" | "PRIVATE" | "DEEMED",
          courses: { create: courses },
          placements: { create: placements },
          reviews: { create: reviewsWithUserId },
        },
      });
      console.log("Upserted college:", created.name);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Failed to create college:", college.name, message);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
