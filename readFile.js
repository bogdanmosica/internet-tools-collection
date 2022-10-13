const fs = require("fs");
const json2md = require("json2md");
const { parser } = require("html-metadata-parser");

const fetchData = require("./fetch");
const regex = require("./regex");
const { getTitles, getLinks } = require("./regex.test");

const readFile = () => {
	return fs.readFile("./collection.md", "utf8", function (err, data) {
		if (err) {
			return console.log(err);
		}
		var index = 0;
		const headers = getTitles(data);
		const filteredH1Headers = headers.filter(
			(header, index) => index !== 0 && header.split("#").length < 4
		);
		const textHeaders = filteredH1Headers.map((h) => h.split("#")[1].slice(1));

		const extractedData = getLinks(data).map((token) => {
			const id = +token.match(regex.numbers)[0];
			const url = token.match(regex.betweenRoundBrackets)[1];
			const name = token.match(regex.betweenSquareBrackets)[0];

			if (id === 1) index += 1;

			const theSplitByHashTag = headers[index] ? headers[index].split("#") : "";
			const heading =
				theSplitByHashTag.length === 4
					? theSplitByHashTag[3].slice(1).slice(0, -1)
					: theSplitByHashTag[1].slice(1);

			const tag = theSplitByHashTag.length === 4 ? "h2" : "h1";
			return { id, name, url, heading, tag };
		});
		const promiseData = extractedData
			.map((eData) => eData.url)
			.map(async (url, index) => {
				try {
					const result = await parser(url);
					if (index === 0) {
						const thedata = await parser("https://carrd.co/");
						console.log(thedata);
					}
					return result;
				} catch (error) {
					return {};
				}
			});

		Promise.all(promiseData).then(function (values) {
			const appList = values.map(({ og, meta, images }, i) => ({
				images,
				...og,
				...meta,
				...extractedData[i],
			}));
			const markdownModelContent = filteredH1Headers.reduce(
				(prev, current, index) => {
					const linkName = current.split("#")[1].slice(1);
					prev.push({
						link: {
							title: `${index + 1}. ${linkName}`,
							source: `#${linkName.replace(/\s+/g, "-").toLowerCase()}`,
						},
					});
					return prev;
				},
				[
					{
						h1: "Internet Tools Collection",
					},
					{
						p: "A collection of tools, website and AI for entrepreneurs, web designers, programmers and for everyone else.",
					},
					{
						h1: "Content by category",
					},
				]
			);
			const markdownModel = appList.reduce(
				(
					prev,
					{
						id,
						url,
						name,
						heading,
						title = "",
						image = "",
						images = [],
						description = "",
					}
				) => {
					if (id === 1)
						prev.push({
							[textHeaders.includes(heading) ? "h1" : "h2"]: heading,
						});
					const appTitle = {
						h2: `[${id}. ${title || name}](${url})`,
					};
					const appIcon = {
						link: {
							title: `<img src='${
								image || images.length > 0
									? images[0]?.src
									: "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png"
							}' width='300' />`,
							source: url,
						},
					};
					const appDescription = {
						blockquote: description,
					};
					// const appKeywords = {
					// 	p: `Keywords: ${keywords}`,
					// };
					const breakLine = {
						p: "---",
					};
					prev.push(appTitle, appIcon, appDescription, breakLine);
					return prev;
				},
				markdownModelContent
			);
			fs.writeFileSync("./readme.md", json2md(markdownModel));
		});
	});
};
module.exports = readFile;
