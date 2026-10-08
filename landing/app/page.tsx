import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";

type Hero = {
	title: string;
	imgSrc: string;
	subtitle?: string;
	btnText?: string;
	btnLink?: string;
};

const FALLBACK: Hero = {
	title: "Welcome",
	imgSrc: "https://images.unsplash.com/photo-1554629947-334ff61d85dc?q=80&w=1336&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

async function getHero(): Promise<Hero> {
	"use cache";
	cacheTag("hero");
	cacheLife({ stale: 300, revalidate: 604800, expire: 2592000 });

	const res = await fetch(`${process.env.CMS_URL}/api/hero`);
	if (!res.ok) throw new Error(`CMS responded with ${res.status}`);
	return res.json();
}

// export const revalidate = 60
export default async function Home() {
	let hero: Hero;
	try {
		hero = await getHero();
	} catch {
		// Errors thrown inside "use cache" are not cached, so a CMS outage
		// never gets stuck in the cache. Show the fallback for this request only.
		hero = FALLBACK;
	}

	console.log(hero);

	return (
		<main className="relative text-white min-h-screen w-full overflow-hidden bg-neutral-950">
			<img
				src={
					hero.imgSrc
				}
				width={2000}
				height={2000}
				alt={hero.title}
				className="absolute inset-0 h-full w-full object-cover"
			/>

			<section className="relative flex min-h-screen items-end px-6 pb-16 sm:px-12 sm:pb-24">
				<div className="flex flex-col items-start gap-y-4">
					<h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
						{hero.title}
					</h1>
					{hero.subtitle && <p className="max-w-2xl">{hero.subtitle}</p>}
					{hero.btnText && hero.btnLink && (
						<Link
							href={hero.btnLink}
							className="inline-block rounded-md text-base font-medium text-white"
						>
							<button className="bg-blue-500 ring-blue-500 ring-2 shadow-[inset_1px_1px_0px_0px_rgba(255,255,255,0.2),inset_-1px_-1px_0px_0px_rgba(255,255,255,0.2)] rounded-md px-4 py-2">
								{hero.btnText}
							</button>
						</Link>
					)}
				</div>
			</section>
		</main>
	);
}
