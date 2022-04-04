<style>
	.candidate {
		border: 1px solid #d6d6da;
		padding: 0.5em;
		border-radius: 4px;
		display: block;
		width: 33%;
		margin-right: 0.75em;
	}

	.m-entry-excerpt {
		font-family: "ff-meta-serif-web-pro", georgia, cambria, "Times New Roman", times, serif;
	}

	.former-candidate {
		opacity: 0.6;
	}

	.candidate-photo {
		float: right;
	}

	.candidate-meta {
		font-weight: 700;
		margin-bottom: 0.25em;
		font-size: var(--scale-3);
		font-family: "ff-meta-web-pro", helvetica, arial, sans-serif;
		color: #5E6E76;
		width: 100%;
	}

	.candidate-meta div {
		margin-bottom: 0.25em;
	}

	.incumbent {color: #f74607;}
	.first-elected {
		/* display: block; */
		color: #5E6E76;
		padding-left:1.5em;
		font-weight: 400;
		/* font-style: italic; */
	}
	.dropped-out .icon {color: #C83D2D;}
	.deg45 {
		transform: rotate(45deg);
		font-size: .7em;
	}
	
</style>

<script>
	// a single candidate record from Race.svelte
	export let candidate;

	const party_icons = {
		"republican": "republican",
		"dfl": "democrat",
		"legal-marijuana-now": "cannabis",
		"grassroots-legalize-cannabis": "cannabis",
		"green": "square deg45"
	};

	function parseDropoutDate (dateString) {
		let date = new Date(dateString);
		let options = {year: 'numeric', month: 'long', day: 'numeric'};
		return date.toLocaleString('en-US', options);
	}

	function capString(s) {
		return s.charAt(0).toUpperCase() + s.slice(1);
	}


</script>

<article class="m-post candidate" class:former-candidate={candidate["dropped-out"]}>
	
	<h5 class="a-entry-title">{candidate.name}</h5>

	<div class="m-entry-meta candidate-meta">
		{#if candidate["party"]}
			<div class="party-name party-{candidate["party-id"]}"><i class="fas fa-fw fa-{party_icons[candidate["party-id"]] ?? "circle"}"></i> {candidate.party}</div>
		{/if}

		{#if candidate["lives-in"]}
		<div class="hometown"><i class="fas fa-fw fa-home"></i> Lives in: {candidate["lives-in"]}</div>
		{/if}

		{#if candidate["incumbent?"]}
		<div class="incumbent">
			<i class="fas fa-fw fa-star"></i> Member of {capString(candidate.chamber)}
			{#if candidate["year-first-elected"]}
			<div class="first-elected">
				First elected in {candidate["year-first-elected"]}
			</div>
			{/if}
		</div>
		{/if}

		{#if candidate["endorsed?"]}
		<div class="endorsed"><span class="icon party-{candidate["party-id"]}"><i class="fas fa-fw fa-check-square"></i></span> 
			Endorsed by <span class="party-{candidate["party-id"]}">{candidate.party} {#if candidate.party != "DFL"} Party{/if}</span></div>
		{/if}

		{#if candidate.website}
			<div class="website"><a href="{candidate.website}" target="_blank"><i class="fas fa-fw fa-globe"></i> Campaign website</a></div>
		{/if}

		{#if candidate["dropped-out?"]}
		<div class="dropped-out"><span class="icon"><i class="fas fa-fw fa-times"></i></span> Out of the race on {parseDropoutDate(candidate["drop-out-date"])}</div>
		{/if}
	</div>
	

</article>
