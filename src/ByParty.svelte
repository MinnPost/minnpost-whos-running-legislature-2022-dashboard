<script>
    // all data for candidates and races
    export let items;

	// page.js data, such as the party we want
	export let params;

	// the races from App.svelte
	let districts = items.districts;

	// what party/parties do we want
    let parties = [];
    if (params && params.party) {
		let key = items.all_party_ids.indexOf(params.party);
		parties = [items.all_parties[key]];
    } else {
        // the distinct party names from the candidates
	    parties = items.all_parties;
    }

	// create a list of candidates for a party
	let party_district_candidates = function(chamber, party = '', district = '') {

		/*let all_parties = [...new Set(items.candidates.filter(function(item, index) {
			if ( item.party ) {
				return item.party;
			}
		}).map(function(obj) { return obj.party; }))];*/

		if (district != '') {
			return items.candidates.filter(
				function(item, index) {
					if (item.party) {
						if ( item["chamber"] === chamber && item["party"].indexOf(party) !== -1 && item["district"] == district ) {
							return item;
						}
					}
				}
			)
		} else {
			return items.candidates.filter(
				function(item, index) {
					if (item.party) {
						if ( item["chamber"] === chamber &&item["party"].indexOf(party) !== -1 && item["district"] == district ) {
							return item;
						}
					}
				}
			)
		}
	}

	// the distinct districts from this list of candidates
	let party_candidate_districts = function(candidates) {
		return [...new Set(candidates.map(value => value["district"]))];
	}

	// single candidate template
	import Candidate from "./Candidate.svelte";

	// link to go back to unfiltered list
    //import LinkToFullCandidateList from "./components/LinkToFullCandidateList.svelte";

</script>


{#each parties as party, key}

	<section class="party-listing">
		{#if parties.length > 1}
			<h2 class="m-archive-header party-{items.all_party_ids[key]}">{party}</h2>
		{/if}

		{#each items.chambers as chamber}
			<section class="chamber-listing">
				<h2 class="m-archive-header m-chamber-header">{chamber}</h2>
				{#if chamber.blurb}
					<p>{@html chamber.blurb}</p>
				{/if}
		
				{#each districts as district_region, key}
					{#if party_district_candidates(chamber, party, district_region.district).length > 0}
						<article class="m-district">
							{district_region.chamber} {district_region.district} {district_region.region}
							<h3 class="m-archive-header">{district_region.district}</h3>
							{#each party_district_candidates(chamber, party, district_region.district) as candidate}
								<Candidate candidate = {candidate} />
							{/each}
						</article>
					{/if}	
				{/each}
			</section>
		{/each}
	</section>
{/each}
