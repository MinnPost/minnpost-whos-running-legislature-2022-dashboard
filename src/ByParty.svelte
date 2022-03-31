<script>
    // all data for candidates and races
    export let items;

	// page.js data, such as the party we want
	export let params;

	// what party/parties do we want
    let parties = [];
    if (params && params.party) {
		let key = items.all_party_ids.indexOf(params.party);
		parties = [items.all_parties[key]];
    } else {
        // the distinct party names from the candidates
	    parties = items.all_parties;
    }

    // the candidates from App.svelte
	let candidates = items.candidates;

    // create a list of candidates in their chamber or district
	let party_district_candidates = function(chamber, party = '', district = '') {
        if (district !== '') {
            candidates = items.candidates.filter(
                item => item["chamber"] == chamber && item["district"] == district
            );
        } else {
            candidates = items.candidates.filter(
                item => item["chamber"] == chamber
            );
        }
        return candidates;
	}

    let party_chamber_candidate_district_regions = function(candidates, party = '') {
        let district_regions = candidates.reduce(function(filtered, option) {
            if ( option.district && option.region ) {
                var item = JSON.stringify({ "district": option.district, "region": option.region });
                filtered.push(item);
            }
            return [...new Set(filtered)];
        }, []);
        district_regions = district_regions.map(function(item) {
            if (typeof item === 'string') {
                return JSON.parse(item);
            } else if (typeof item === 'object') {
                return item;
            }
        });
        return district_regions;
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
			{#if party_district_candidates(chamber, party).length > 0}
				<section class="chamber-listing">
					<h2 class="m-archive-header m-chamber-header">{chamber}</h2>
					{#if chamber.blurb}
						<p>{@html chamber.blurb}</p>
					{/if}
					{#each party_chamber_candidate_district_regions(party_district_candidates(chamber, party), party) as district_region, key}
						{#if party_district_candidates(chamber, party, district_region.district).length > 0}
							<article class="m-district">
								{chamber} {district_region.district} {district_region.region}
								{#each party_district_candidates(chamber, party, district_region.district) as candidate}
									<Candidate candidate = {candidate} />
								{/each}
							</article>
						{/if}
					{/each}
				</section>
			{/if}
		{/each}
	</section>
{/each}
