const cheerio = require("cheerio");
const axios = require("axios");

const fetchData = async (aUrl) => {
	const { data } = await axios.get(aUrl);
	console.log(data);
	const $ = cheerio.load(data);
	const title =
		$('meta[property="og:title"]').attr("content") ||
		$("title").text() ||
		$('meta[name="title"]').attr("content");

	const description =
		$('meta[property="og:description"]').attr("content") ||
		$('meta[name="description"]').attr("content");

	const metaUrl = $('meta[property="og:url"]').attr("content");

	const site_name = $('meta[property="og:site_name"]').attr("content");

	const image =
		$('meta[property="og:image"]').attr("content") ||
		$('meta[property="og:image:url"]').attr("content");

	const icon =
		$('link[rel="icon"]').attr("href") ||
		$('link[rel="shortcut icon"]').attr("href");

	const keywords =
		$('meta[property="og:keywords"]').attr("content") ||
		$('meta[name="keywords"]').attr("content");

	const theData = {
		title,
		description,
		metaUrl,
		site_name,
		image,
		icon,
		keywords,
	};
	return theData;
};

module.exports = fetchData;
