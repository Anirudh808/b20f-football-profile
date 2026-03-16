import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const courses = [
    {
      title: "Mastering the Step-Back Dribble",
      description: "Learn how to create space and evade defenders with this essential dribbling move.",
      skillFocus: "Dribbling",
      videoInstructionUrl: "https://www.youtube.com/watch?v=kYI9vI-B0k8",
    },
    {
      title: "Power Shooting: Techniques for distance",
      description: "Improve your strike power and accuracy from outside the box.",
      skillFocus: "Shooting",
      videoInstructionUrl: "https://www.youtube.com/watch?v=kYI9vI-B0k8",
    },
    {
      title: "Precision Passing: One-touch drills",
      description: "Develop faster reaction times and cleaner passes in tight spaces.",
      skillFocus: "Passing",
      videoInstructionUrl: "https://www.youtube.com/watch?v=kYI9vI-B0k8",
    },
    {
      title: "Defensive Stance & Jockeying",
      description: "Learn the fundamentals of contained defending and winning the ball back.",
      skillFocus: "Defending",
      videoInstructionUrl: "https://www.youtube.com/watch?v=kYI9vI-B0k8",
    },
  ];

  console.log("Seeding courses...");
  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.title }, // This won't work because id is CUID, but for seed we can use title as identifier if we hack it
      update: {},
      create: {
        title: course.title,
        description: course.description,
        skillFocus: course.skillFocus,
        videoInstructionUrl: course.videoInstructionUrl,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
