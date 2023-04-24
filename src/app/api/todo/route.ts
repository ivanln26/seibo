import { NextResponse } from "next/server";

import { prisma } from "@/db";

type Todo = {
  content: string;
};

export async function POST(request: Request) {
  const { content } = await request.json() as Todo;

  const todo = await prisma.todo.create({
    data: {
      content,
    },
  });

  return NextResponse.json(todo);
}
