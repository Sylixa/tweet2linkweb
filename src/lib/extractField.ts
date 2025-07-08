const usernameBskyRegex = /profile\/([^\/]+)\/post/;
const selectTheLastSegmentRegex = /\/([^/]+)$/;
const twitterAllowedList = [
	'x.com',
	'www.x.com',
	'twitter.com',
	'www.twitter.com',
	'fxtwitter.com',
	'fixupx.com'
];
const bskyAllowedList = ['bsky.app'];

function extractLastSegment(url: string) {
	const match = url.match(selectTheLastSegmentRegex);
	if (match) {
		return match[1];
	}
	return '';
}

function extractBskyAuthor(url: string) {
	const match = url.match(usernameBskyRegex);
	if (match) {
		return match[1];
	}
	return '';
}

const isValidUrl = (urlString: string) => {
	try {
		return Boolean(new URL(urlString));
	} catch (e) {
		console.log(e);
		return false;
	}
};

const isNumStr = (s: any) => !isNaN(s) && isFinite(s);

export const extractKey = (key: string) => {
	const validURL = isValidUrl(key);
	const validNum = isNumStr(key);
	const postData = {
		network: '',
		postId: '',
		postAuthor: ''
	};

	if (!validURL && !validNum) {
		return;
	}
	if (validNum) {
		//Send to API
		console.log();
	}
	if (validURL) {
		const mediaUrl = new URL(key);
		if (twitterAllowedList.includes(mediaUrl.hostname)) {
			postData.network = 'twitter';
		} else if (bskyAllowedList.includes(mediaUrl.hostname)) {
			postData.network = 'bsky';
			postData.postAuthor = extractBskyAuthor(key);
		}
		postData.postId = extractLastSegment(key);
	}

	if (postData.postId === '') {
		//Error out
		return;
	}

	if (postData.postAuthor === '' && postData.network === 'bsky') {
		//Error out
		return;
	}

	return postData;
};

//verifyUserInput('https://x.com/discord/status/1938298177364627528');

//https://x.com/discord/status/1938298177364627528
//https://bsky.app/profile/bsky.app/post/3l6oveex3ii2l
