<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import 'video.js/dist/video-js.css';
	import videojs from 'video.js';
	import type Player from 'video.js/dist/types/player';

	export let src: string;

	let videoNode: HTMLVideoElement | undefined;
	let player: Player | undefined;

	function getMimeType(url: string) {
		if (!url) {
			console.error('Media is empty');
			return;
		}
		const fileExtension = new URL(url).pathname.split('.').pop()?.toLowerCase();

		switch (fileExtension) {
			case 'mp4':
			case 'mov':
				return 'video/mp4';
			case 'webm':
				return 'video/webm';
			case 'gif':
				return 'image/gif';
			default:
				// Default to HLS if the extension is unknown or is .m3u8
				return 'application/x-mpegURL';
		}
	}

	onMount(async () => {
		try {
			console.log('Run videojs');
			const response = await fetch(src, { method: 'HEAD' });
			const contentType = response.headers.get('Content-Type');
			let mimeType = 'video/mp4';

			// if (!contentType) {
			// 	console.error('Could not determine Content-Type for the video.');
			// 	return;
			// }
			if (!videoNode) {
				console.error('Video node does not exist!');
				return;
			}

			player = videojs(videoNode, {
				autoplay: false,
				controls: true,
				responsive: true,
				fluid: true
			});

			if (!contentType) {
				mimeType = getMimeType(src) || 'video/mp4';
			} else {
				if (contentType?.includes('mpegurl')) {
					// For HLS (.m3u8) streams
					mimeType = 'application/x-mpegURL';
				} else {
					console.warn(`Unsupported video type: ${contentType}`);
					mimeType = contentType;
				}
			}
			console.log('Mime: ', mimeType);

			player.src({
				src: src,
				type: mimeType
			});
		} catch (error) {
			console.error('Error fetching video metadata:', error);
		}
	});

	onDestroy(() => {
		if (player) {
			player.dispose();
		}
	});
</script>

<div data-vjs-player>
	<video bind:this={videoNode} class="video-js vjs-default-skin">
		<track kind="captions" />
	</video>
</div>
