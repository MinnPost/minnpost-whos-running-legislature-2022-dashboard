<script>
    // all data for candidates and races
    export let items;

	// page.js data, such as the party we want
	export let params;

	// what region do we want
    let regions = [];
    if (params && params.region) {
		let key = items.region_ids.indexOf(params.region);
		regions = [items.regions[key]];
    } else {
        // the distinct regions from the candidates
	    regions = items.regions;
    }

    // the candidates from App.svelte
	let candidates = items.candidates;

	// the districts from App.svelte
	let districts = items.districts;

    // create a list of candidates in their chamber or district
	let region_district_candidates = function(chamber, region = '', district = '') {
        if (district !== '') {
            candidates = items.candidates.filter(
                item => item["chamber"] == chamber && item["district"] == district
            );
        } else {
            candidates = items.candidates.filter(
                item => item["chamber"] == chamber
            );
        }
		if (region != '') {
			candidates = candidates.reduce(function(filtered, option) {
				if ( option.region && option.region === region ) {
					filtered.push(option);
				}
				return [...new Set(filtered)];
			}, []);
		}
        return candidates;
	}

    let region_chamber_candidate_district_regions = function(candidates) {
        let district_regions = districts.reduce(function(filtered, option) {
            if ( option.district && option.region ) {
                var item = JSON.stringify(option);
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


{#each regions as region, key}

	<section class="region-listing">
		{#if regions.length > 1}
			<h2 class="m-archive-header region-{items.region_ids[key]}">{region}</h2>
		{/if}

		{#each items.chambers as chamber}
			{#if region_district_candidates(chamber, region).length > 0}
				<section class="chamber-listing">
					<h2 class="m-archive-header m-chamber-header">{chamber}</h2>
					{#if chamber.blurb}
						<p>{@html chamber.blurb}</p>
					{/if}
					{#each region_chamber_candidate_district_regions(region_district_candidates(chamber, region)) as district_region, key}
						{#if region_district_candidates(chamber, region, district_region.district).length > 0}
							<article class="m-district">
								{district_region.label} {district_region.region}
								{#each region_district_candidates(chamber, region, district_region.district) as candidate}
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
