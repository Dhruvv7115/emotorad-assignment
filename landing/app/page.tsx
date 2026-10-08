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
	title: "Welcome to Emotorad!",
	imgSrc: "/fallback.avif",
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

	return (
		<main className="relative text-white min-h-screen w-full overflow-hidden bg-neutral-950">
			<img
				src={hero.imgSrc}
				width={2000}
				height={2000}
				alt={hero.title}
				className="absolute inset-0 h-full w-full object-cover opacity-100 mask-b-from-50% mask-b-to-90%"
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
							<button className="flex cursor-pointer items-center justify-center rounded-xl px-4 py-2 transition-all duration-200 active:scale-98 bg-linear-to-b from-blue-500 to-blue-600 text-white shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)_inset] ring ring-white/20 ring-inset ring-offset-2 ring-offset-blue-600 hover:shadow-[0px_0px_20px_0px_rgba(255,255,255,0.4)_inset] hover:ring-white/30">
								{hero.btnText}
							</button>
						</Link>
					)}
				</div>
			</section>
		</main>
	);
}
