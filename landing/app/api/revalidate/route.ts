import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
	if (req.headers.get("x-secret") !== process.env.REVALIDATE_SECRET) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	revalidateTag("hero", "max");

	return Response.json({ revalidated: true, at: new Date().toISOString() });
}
