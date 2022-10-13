const regex = require("./regex");

const isTitle = (str) => regex.title.test(str);
const isHeading = (str) => regex.heading.test(str);
const isUrl = (str) => regex.url.test(str);

function getTitles(md) {
	if (!md) return "";
	let tokens = md
		.split("\n")
		.filter((token) => isTitle(token) || isHeading(token));
	if (tokens) return tokens;
	return [];
}

function getLinks(md) {
	if (!md) return "";
	let tokens = md.split("\n").filter((token) => isUrl(token));
	if (tokens) return tokens;
	return [];
}

module.exports = { isTitle, isHeading, isUrl, getTitles, getLinks };
