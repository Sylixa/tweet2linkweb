const extractBskyMedia = (data: any) => {
	const embedMedia = data.data.post.embed;
	const mediaType = embedMedia.$type;
	const finalMedia = [];
	const dataConstruct = (url: string, type = 'photo') => {
		return { url: url, type: type };
	};
	//app.bsky.embed.images#view \ app.bsky.embed.video#view

	if (mediaType === 'app.bsky.embed.images#view') {
		for (let i = 0; i < embedMedia.images.length; i++) {
			const imgSrc = embedMedia.images[i].fullsize;
			finalMedia.push(dataConstruct(imgSrc, 'photo'));
		}
	}
	if (mediaType === 'app.bsky.embed.video#view') {
		const videoSrc = embedMedia.playlist;
		finalMedia.push(dataConstruct(videoSrc, 'video'));
	}
	return finalMedia;
};

const extractTwitterMedia = (data: any) => {
	return data.data.media;
};

const extractBskyPostMetadata = (data: any) => {
	const postEntryPoint = data.data.post;
	const postAuthor = postEntryPoint.author.handle;
	const postDate = postEntryPoint.record.createdAt;
	const postId = postEntryPoint.cid;
	return {
		id: postId,
		user: postAuthor,
		date: postDate
	};
};

const extractTwitterPostMetadata = (data: any) => {
	const postEntryPoint = data.data;
	const postAuthor = postEntryPoint.tweetBy.userName;
	const postDate = postEntryPoint.createAt;
	const postId = postEntryPoint.id;
	return {
		id: postId,
		user: postAuthor,
		date: postDate
	};
};

const processData = (id = '', media = [], user = '', date = '') => {
	const tweetId = id;
	const tweetMedia = media;
	const tweetUser = user;
	const tweetDate = date;

	return {
		id: tweetId,
		media: tweetMedia,
		user: tweetUser,
		date: tweetDate
	};
};

export const reconstructPost = (data, dataKey) => {
	if (dataKey.network === 'bsky') {
		const media = extractBskyMedia(data);
		const { id, user, date } = extractBskyPostMetadata(data);
		return processData(id, media, user, date);
	} else if (dataKey.network === 'twitter') {
		const media = extractTwitterMedia(data);
		const { id, user, date } = extractTwitterPostMetadata(data);
		return processData(id, media, user, date);
	}
	return processData();
};
