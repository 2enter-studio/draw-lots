import { parse } from 'csv-parse/sync';

type Source = [string, string, string, string, string, string, string];

type Comment = {
	username: string;
	profileUrl: string;
	text: string;
	date: string;
};

export const load = async ({ fetch }) => {
	const source = await fetch('/source.csv').then((res) => res.text());
	const csv = parse(source) as Source[];
	const cleanCSV = csv.map((item) => item.map((text) => text.slice(2, -1))).splice(1);
	const comments: Comment[] = cleanCSV
		.map((item) => {
			return {
				username: item[1],
				profileUrl: item[4],
				text: item[3],
				date: item[6]
			};
		})
		.filter((c) => c.text.split('@').length > 3)
		.sort((a, b) => Math.random() - 0.5);
	console.log(csv);

	// console.log(comments);
	return { comments };
};
