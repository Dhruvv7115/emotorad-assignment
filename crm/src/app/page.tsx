"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon, LinkIcon, TypeIcon, PencilIcon, SparklesIcon } from "lucide-react";

interface HeroFormData {
	title: string;
	image: string;
	subtitle: string;
	btn_text: string;
	btn_link: string;
}

export default function Home() {
	const [form, setForm] = useState<HeroFormData>({
		title: "",
		image: "",
		subtitle: "",
		btn_text: "",
		btn_link: "",
	});
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const update = (field: keyof HeroFormData, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleConfirmUpdate = async () => {
		setIsSubmitting(true);
		setSubmitStatus(null);

		try {
			const res = await fetch("/api/hero", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": process.env.NEXT_PUBLIC_CRM_API_SECRET || "",
				},
				body: JSON.stringify({
					title: form.title,
					subtitle: form.subtitle,
					buttonText: form.btn_text,
					buttonLink: form.btn_link,
					heroImage: form.image,
				}),
			});

			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || "Failed to update hero section");
			}

			setSubmitStatus({
				type: "success",
				message: "Hero section updated successfully!",
			});
			setIsDialogOpen(false);
		} catch (err) {
			setSubmitStatus({
				type: "error",
				message:
					err instanceof Error ? err.message : "Something went wrong",
			});
			setIsDialogOpen(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	const isFormEmpty =
		!form.title.trim() &&
		!form.subtitle.trim() &&
		!form.image.trim() &&
		!form.btn_text.trim() &&
		!form.btn_link.trim();

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/40 p-4">
			<div className="w-full max-w-lg space-y-6">
				{/* Header */}
				<div className="text-center space-y-2">
					<div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-2">
						<SparklesIcon className="size-3" />
						Content Management
					</div>
					<h1 className="text-3xl font-bold tracking-tight">
						Hero Section Editor
					</h1>
					<p className="text-muted-foreground text-sm">
						Update the hero section of your landing page in real time.
					</p>
				</div>

				{/* Status Banner */}
				{submitStatus && (
					<div
						className={`rounded-lg border px-4 py-3 text-sm transition-all animate-in fade-in slide-in-from-top-2 ${
							submitStatus.type === "success"
								? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
								: "border-destructive/30 bg-destructive/10 text-destructive"
						}`}
					>
						{submitStatus.message}
					</div>
				)}

				{/* Form Card */}
				<Card>
					<CardHeader>
						<CardTitle>Edit Hero Content</CardTitle>
						<CardDescription>
							Fill in the fields below to update the hero banner on
							your website.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-5">
						{/* Title */}
						<div className="space-y-2">
							<Label htmlFor="hero-title">
								<TypeIcon className="size-3.5 text-muted-foreground" />
								Title
							</Label>
							<Input
								id="hero-title"
								placeholder="e.g. Ride the Future with EMotorad"
								value={form.title}
								onChange={(e) =>
									update("title", e.target.value)
								}
							/>
						</div>

						{/* Subtitle */}
						<div className="space-y-2">
							<Label htmlFor="hero-subtitle">
								<PencilIcon className="size-3.5 text-muted-foreground" />
								Subtitle
							</Label>
							<Input
								id="hero-subtitle"
								placeholder="e.g. Experience next-gen electric bicycles built for every terrain"
								value={form.subtitle}
								onChange={(e) =>
									update("subtitle", e.target.value)
								}
							/>
						</div>

						{/* Hero Image URL */}
						<div className="space-y-2">
							<Label htmlFor="hero-image">
								<ImageIcon className="size-3.5 text-muted-foreground" />
								Hero Image URL
							</Label>
							<Input
								id="hero-image"
								type="url"
								placeholder="e.g. https://cdn.emotorad.com/hero-banner.webp"
								value={form.image}
								onChange={(e) =>
									update("image", e.target.value)
								}
							/>
						</div>

						{/* Button Text */}
						<div className="space-y-2">
							<Label htmlFor="hero-btn-text">
								Button Text
							</Label>
							<Input
								id="hero-btn-text"
								placeholder="e.g. Explore Models"
								value={form.btn_text}
								onChange={(e) =>
									update("btn_text", e.target.value)
								}
							/>
						</div>

						{/* Button Link */}
						<div className="space-y-2">
							<Label htmlFor="hero-btn-link">
								<LinkIcon className="size-3.5 text-muted-foreground" />
								Button Link
							</Label>
							<Input
								id="hero-btn-link"
								type="url"
								placeholder="e.g. https://emotorad.com/products"
								value={form.btn_link}
								onChange={(e) =>
									update("btn_link", e.target.value)
								}
							/>
						</div>

						{/* Submit with Dialog */}
						<DialogTrigger
							isOpen={isDialogOpen}
							onOpenChange={setIsDialogOpen}
						>
							<Button
								className="w-full"
								size="lg"
								isDisabled={isFormEmpty}
							>
								Update Hero Section
							</Button>

							<Dialog>
								<DialogHeader>
									<DialogTitle>Confirm Changes</DialogTitle>
									<DialogDescription>
										You&apos;re about to update the hero
										section on the live website. Please
										review your changes below.
									</DialogDescription>
								</DialogHeader>

								<div className="space-y-3 rounded-lg border bg-muted/30 p-3 text-sm">
									{form.title && (
										<div>
											<span className="font-medium text-muted-foreground">
												Title:{" "}
											</span>
											<span>{form.title}</span>
										</div>
									)}
									{form.subtitle && (
										<div>
											<span className="font-medium text-muted-foreground">
												Subtitle:{" "}
											</span>
											<span>{form.subtitle}</span>
										</div>
									)}
									{form.image && (
										<div>
											<span className="font-medium text-muted-foreground">
												Image:{" "}
											</span>
											<span className="break-all">
												{form.image}
											</span>
										</div>
									)}
									{form.btn_text && (
										<div>
											<span className="font-medium text-muted-foreground">
												Button Text:{" "}
											</span>
											<span>{form.btn_text}</span>
										</div>
									)}
									{form.btn_link && (
										<div>
											<span className="font-medium text-muted-foreground">
												Button Link:{" "}
											</span>
											<span className="break-all">
												{form.btn_link}
											</span>
										</div>
									)}
								</div>

								<DialogFooter>
									<DialogClose>Cancel</DialogClose>
									<Button
										onPress={handleConfirmUpdate}
										isDisabled={isSubmitting}
									>
										{isSubmitting
											? "Updating…"
											: "Yes, Update"}
									</Button>
								</DialogFooter>
							</Dialog>
						</DialogTrigger>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
