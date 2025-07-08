const vercelAPI = 'https://tweet2vid.vercel.app/api';
//tweet or bsky
// const res = await fetch(`${vercelAPI}?${searchParam}`, {
// 			method: 'GET'
// 		});
// 		if (!res.ok) {
// 			const errorDate = await res.json();
// 			throw new Error(errorDate.error || `Error: ${res.status}`);
// 		}

const sendDataToServer = async (urlAPI: string, id: string) => {
	const res = await fetch(`${urlAPI}/${id}`, {
		method: 'GET'
	});
	if (!res.ok) {
		const errorDate = await res.json();
		throw new Error(errorDate.error || `Error: ${res.status}`);
	}
	return await res.json();
};

export const getPostData = async (postData) => {
	let newLink = vercelAPI;
	let data = null;

	try {
		if (postData.network === 'bsky') {
			newLink = `${newLink}/bsky`;
			data = await sendDataToServer(newLink, `${postData.postAuthor}/${postData.postId}`);
		}
		if (postData.network === 'twitter') {
			newLink = `${newLink}/tweet`;
			data = await sendDataToServer(newLink, `${postData.postId}`);
		}
		return data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};
