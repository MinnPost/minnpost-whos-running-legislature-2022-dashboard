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

	// the districts from App.svelte
	let districts = items.districts;

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
		if (party != '') {
			candidates = candidates.reduce(function(filtered, option) {
				if ( option.party && option.party === party ) {
					filtered.push(option);
				}
				return [...new Set(filtered)];
			}, []);
		}
        return candidates;
	}

    let party_chamber_candidate_district_regions = function(candidates) {
        let district_regions = districts.filter(o1 => candidates.some(o2 => o1.district === o2.district));
        district_regions = district_regions.reduce(function(filtered, option) {
            var item = JSON.stringify(option);
            filtered.push(item);
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
	import Race from "./Race.svelte";

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
					{#each party_chamber_candidate_district_regions(party_district_candidates(chamber, party)) as district_region, key}
						{#if party_district_candidates(chamber, party, district_region.district).length > 0}
							<Race district_region={district_region} candidates={party_district_candidates(chamber, party, district_region.district)} />
						{/if}
					{/each}
				</section>
			{/if}
		{/each}
	</section>
{/each}
