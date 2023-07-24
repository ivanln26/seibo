import { db } from "@/db/db";
import { course } from "@/db/schema";

export async function GET(request: Request) {
    try {
        const query = await db.select().from(course);
        return new Response(JSON.stringify(query));
      } catch (e) {
        console.log(e)
        throw e
      }
  }

export async function POST(request: Request){
    const data = await request.json()
    await db.insert(course).values({
        name: data["content"],
        topics: data["topics"],
        schoolId: 1,
    });
    return new Response(new Blob(), {status: 200})
}