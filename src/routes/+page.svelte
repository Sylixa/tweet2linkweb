<script lang="ts">
	import '../styles/fonts.css';
	import '../styles/color.css';
	import { reconstructPost } from '$lib/reconstructPost';
	import { extractKey } from '$lib/extractField';
	import { getPostData } from '$lib/externalAPI';

	let userInput = $state('');
	let APIStatus = $state();
	let tweet = $state({
		id: '',
		media: [],
		user: '',
		date: ''
	});

	const isEmpty = (obj: any) => {
		return Object.keys(obj).length === 0;
	};

	const onSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		if (!userInput.trim()) {
			APIStatus = 'Empty field!';
			return;
		}

		APIStatus = null;

		try {
			APIStatus = 'Extract Key';
			let extractedKey = extractKey(userInput);
			console.log('EK: ', extractedKey);

			APIStatus = 'Waiting for API';
			let postData = await getPostData(extractedKey);
			console.log('PD: ', postData);

			APIStatus = 'Reconstruct Data';
			let reconstructedPost = reconstructPost(postData, extractedKey);
			console.log('RP: ', reconstructedPost);

			APIStatus = null;
			tweet = reconstructedPost;
		} catch (err) {
			APIStatus = err;
		}
	};
</script>

<div>
	<!-- <h1>Thread Snip</h1> -->
	<form onsubmit={onSubmit}>
		<div class="textbox-container">
			<label for="userInput">Tweet Link</label>
			<input
				type="text"
				id="userInput"
				placeholder="Twitter link goes here"
				bind:value={userInput}
			/>
		</div>
		<button type="submit">Submit Form</button>
	</form>

	{#if !isEmpty(tweet)}
		<div class="media-container--center--col">
			{#if !APIStatus}
				<h2>{tweet.user}</h2>
				<div class="media-container--center">
					<div class="media-container-main">
						{#each tweet.media as media}
							{@render mediaBlock(media)}
						{/each}
					</div>
				</div>
			{:else}
				<h2>{APIStatus}</h2>
			{/if}
		</div>
	{/if}

	<!-- <div>
		<h3>Supported link</h3>
		<h4>Twitter</h4>
		<div>
			<span>https://x.com/discord/status/1938298177364627528</span>
			<span>https://twitter.com/discord/status/1938298177364627528</span>
			<span>x.com/discord/status/1938298177364627528</span>
			<span>twitter.com/discord/status/1938298177364627528</span>
			<span>1938298177364627528</span>
		</div>

		<h4>Bsky</h4>
		<div>
			<span>https://bsky.app/profile/bsky.app/post/3l6oveex3ii2l</span>
			<span>bsky.app/profile/bsky.app/post/3l6oveex3ii2l</span>
		</div>
	</div> -->
</div>

{#snippet mediaBlock(media: any)}
	{#if media}
		{#if media.type === 'photo'}
			<!-- {:else if media.type === 'video'} -->
			<div class="media-container">
				<img src={media.url} alt="" />
				<a class="media-url" href={media.url}> Download</a>
			</div>
		{:else}
			<div class="media-container">
				<video src={media.url} controls><track kind="captions" /></video>
				<a class="media-url" href={media.url}> Download</a>
			</div>
		{/if}
	{/if}
{/snippet}

<style>
	form {
		font-family: 'Roboto';
	}
	.media-container--center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.media-container--center--col {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.media-container-main {
		display: grid;
		word-wrap: normal;
		gap: 0.5rem;
		max-width: 90dvw;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		justify-items: center;
		align-items: center;
	}
	.media-container {
		display: flex;
		position: relative;
		flex-direction: column;
		max-width: 100%;
		min-width: 0;
		.media-url {
			font-size: 1rem;
			font-weight: 100;
			top: 5%;
			left: 2.5%;
			position: absolute;
			text-decoration: none;
			background-color: rgba(0, 0, 0, 0.75);
			color: rgba(var(--text-1));
			padding: 0.25rem;
		}
	}
	.textbox-container {
		display: flex;
		position: relative;
		flex-direction: column;
	}
</style>
