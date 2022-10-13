const regex = {
	title: /^#\s+.+/,
	heading: /^#+\s+.+/,
	custom: /\$\$\s*\w+/,
	ol: /\d+\.\s+.*/,
	ul: /\*\s+.*/,
	task: /\*\s+\[.]\s+.*/,
	blockQuote: /\>.*/,
	table: /\|.*/,
	image: /\!\[.+\]\(.+\).*/,
	url: /\[.+\]\(.+\).*/,
	codeBlock: /\`{3}\w+.*/,
	betweenSquareBrackets: /(?<=\[).+?(?=\])/,
	betweenRoundBrackets: /\(([^)]+)\)/,
	numbers: /\d+/,
};

module.exports = regex;
