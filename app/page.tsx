import { prisma } from "@/lib/prisma";
import HomeClient from "./HomeClient";

export default async function Home() {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <HomeClient  />;
}


