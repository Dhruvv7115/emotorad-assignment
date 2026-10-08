import { NextRequest, NextResponse } from "next/server";
import { heroSection } from "@/db/schema";
import { db } from "@/index";

export async function GET(req: NextRequest, res: NextResponse) {
	try {
		const [heroData] = await db.select().from(heroSection);
		if (!heroData) {
			return NextResponse.json(
				{ error: "Hero section not found" },
				{ status: 404 },
			);
		}
		return NextResponse.json(heroData);
	} catch (error) {
		console.error("Error fetching hero section:", error);
		return NextResponse.json(
			{ error: "Failed to fetch hero section" },
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest) {
	try {
		// Protect PUT: only requests with a valid CRM API secret are allowed
		const apiKey = req.headers.get("x-api-key");
		const expectedKey = process.env.CRM_API_SECRET;

		if (!apiKey || apiKey !== expectedKey) {
			return NextResponse.json(
				{
					error:
						"Unauthorized. Only the CRM application can update the hero section.",
				},
				{ status: 401 },
			);
		}

		const { title, subtitle, buttonText, buttonLink, heroImage } =
			await req.json();

		const heroData = await db
			.insert(heroSection)
			.values({
				id: 1,
				title,
				subtitle,
				btnText: buttonText,
				btnLink: buttonLink,
				imgSrc: heroImage,
				updatedAt: new Date(),
			})
			.onConflictDoUpdate({
				target: heroSection.id,
				set: {
					title,
					subtitle,
					btnText: buttonText,
					btnLink: buttonLink,
					imgSrc: heroImage,
					updatedAt: new Date(),
				},
			});
		console.log(
			`calling revalidate api at ${process.env.LANDING_URL}/api/revalidate with secret : ${process.env.REVALIDATE_SECRET}`,
		);
		const res = await fetch(`${process.env.LANDING_URL}/api/revalidate`, {
			method: "POST",
			headers: {
				"x-secret": process.env.REVALIDATE_SECRET!,
			},
		});
		console.log("revalidate response : ", res);
		return NextResponse.json(heroData);
	} catch (error) {
		console.error("Error updating hero section:", error);
		return NextResponse.json(
			{ error: "Failed to update hero section" },
			{ status: 500 },
		);
	}
}
