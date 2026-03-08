import type { Experience } from "./types";

export const personalInfo = {
	name: "Ardhan",
	fullName: "Ardhan Satya Pratama",
	username: "ardhan.dev",
	title: "Software Engineer",
	website: "https://ardhan.dev",
	email: "mailto:ardhan.s.pratama@gmail.com",
	linkedin: "https://www.linkedin.com/in/ardhan-p/",
	github: "https://github.com/ardhan-p",
};

export const heroParagraphs = [
	"I'm a software developer currently working at Samsung Research Indonesia.",
	"Making a positive difference in people's lives through technology has always been cool to me, and I'm inspired to learn as much as I can to achieve that.",
	"Feel free to connect with me :)",
	"Or not, up to you really."
];

export const aboutParagraphs = [
	"You'll often find me tinkering with new tech, playing with my Steam Deck, or diving into a good book (usually not all at once).",
];

export const experienceData: Experience[] = [
	{
		title: "Software Engineer - Technical Lead",
		location: "Jakarta, Indonesia",
		company: "Samsung Research Indonesia",
		description: [
			"Currently leading a team of software engineers to develop and maintain multiple server-side applications.",
		],
		skill: ["Technical Project Leadership", "Infrastructure-as-Code", "AWS", "Spring Boot", "React"],
		duration: "Sep 2024 - Present",
		link: "https://www.samsung.com/id/srin/",
	},
	{
		title: "Software Engineer",
		company: "Samsung Research Indonesia",
		location: "Jakarta, Indonesia",
		description: [
			"Responsible for developing and maintaining full-stack applications.",
		],
		skill: ["AWS", "Spring Boot", "React", "Java", "TypeScript"],
		duration: "Apr 2023 - Sep 2024",
		link: "https://www.samsung.com/id/srin/",
	},
];
