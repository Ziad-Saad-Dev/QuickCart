import { inngest } from "@/config/inngest";

export async function POST(req) {
  const body = await req.json();

  await inngest.send({
    name: `clerk/${body.type}`,
    data: body.data,
  });

  return new Response("OK");
}