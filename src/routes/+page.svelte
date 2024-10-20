<script lang="ts">
	const { data } = $props();

	const { comments } = data;

	const MAX_WINNER_AMOUNT = 11;

	let num = $state(~~(Math.random() * comments.length));
	let processing = $state(false);
	let bg = $state<number | null>(null);
	let pickingVIP = $state(false);
	let vip = $state<typeof currentComment>();

	const winners = $state<(typeof currentComment)[]>([]);
	const currentComment = $derived(comments[num]);

	function updateNum() {
		num = ~~(Math.random() * comments.length);
	}

	function pick() {
		processing = true;
		let count = 0;
		const maxCount = ~~(Math.random() * 22) + 39;
		const interval = setInterval(() => {
			updateNum();
			if (count > maxCount) {
				while (winners.some((w) => w.username === currentComment.username)) {
					updateNum();
				}
				winners.push(currentComment);

				bg = ~~(Math.random() * 9);
				clearInterval(interval);
				setTimeout(
					() => {
						bg = null;
						if (winners.length < MAX_WINNER_AMOUNT) {
							pick();
						} else {
							processing = false;
						}
					},
					Math.random() * 3000 + 1000
				);
			}
			count++;
		}, 30);
	}

	function pickVIP() {
		pickingVIP = true;
		const winnerIndex = winners.map((winner) =>
			comments.findIndex((comment) => comment.text === winner.text)
		);
		processing = true;

		let count = 0;
		const maxCount = ~~(Math.random() * 42) + 69;

		const interval = setInterval(() => {
			num = winnerIndex[~~(Math.random() * winnerIndex.length)];
			count++;
			if (count > maxCount) {
				processing = false;
				clearInterval(interval);
				vip = currentComment;
				bg = ~~(Math.random() * 9);
				return;
			}
		}, 69);
	}
</script>

<div
	class="fixed flex flex-col items-center justify-center pt-3 w-screen h-screen bg-black text-white bg-cover bg-no-repeat bg-center gap-5 overflow-y-scroll px-[10vw]"
	style:background-image={bg !== null ? `url(/firework/${bg}.gif)` : ''}
>
	<div class="flex flex-wrap gap-2 justify-center">
		{#each comments as comment}
			{@const isWinner = winners.some((w) => w.text === comment.text)}
			{@const isVIP =
				isWinner &&
				winners.length >= MAX_WINNER_AMOUNT &&
				comment.text === currentComment.text &&
				pickingVIP}
			<div
				class="flex flex-col p-2 rounded-lg gap-0.5 {isVIP
					? 'bg-gradient-to-bl from-purple-500 to-emerald-500'
					: ''}"
				class:bg-white={comment.text === currentComment.text && !isWinner && !isVIP}
				class:bg-rose-500={isWinner && !isVIP}
				class:text-2xl={isWinner}
			>
				<a href={comment.profileUrl}>@{comment.username}</a>
				<div class="bg-white/80 w-fit text-black rounded-xl py-1 px-3 rounded-tl-none">
					{comment.text}
				</div>
				<small class="ml-1 text-right">{comment.date}</small>
			</div>
		{/each}
	</div>
</div>

<div
	class="fixed w-screen h-screen flex justify-center items-center bg-black/30 backdrop-blur-sm"
	class:invisible={processing}
>
	{#if !vip}
		<button
			class:invisible={processing}
			class="hover:text-amber-500 bg-rose-500 p-8 text-8xl rounded-2xl shadow-rose-800 shadow-inner w-fit font-extrabold mb-3"
			onclick={winners.length >= MAX_WINNER_AMOUNT ? pickVIP : pick}
		>
			{#if winners.length >= MAX_WINNER_AMOUNT}
				Get VIP
			{:else}
				GO
			{/if}
		</button>
	{:else}
		<div class="flex flex-col justify-center items-center gap-3 bg-white rounded-lg p-3">
			<h1 class="text-5xl">Final List</h1>
			{#each winners as winner}
				{@const isVIP = winner.username === vip.username}
				<div class="text-4xl p-1 rounded-sm {isVIP ? 'bg-black text-white font-bold text-5xl' : ''}">
					{winner.username}
					{#if isVIP}(VIP){/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
