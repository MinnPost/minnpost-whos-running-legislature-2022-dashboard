<script>
    // all data for candidates and races
    export let items;

	// page.js data, such as the district we want
	export let params;

	// what district do we want
    let districts = [];
    if (params && params.district) {
		let key = items.districts.indexOf(params.district);
		districts = [items.districts[key]];
    } else {
        // the distinct districts from the candidates
	    districts = items.districts;
    }

    // the candidates from App.svelte
	let candidates = items.candidates;

    // create a list of candidates in their district
	let district_candidates = function(district) {
        candidates = items.candidates.filter(
            item => item["district"] == district
        );
        return candidates;
	}

    let candidate_district_regions = function(candidates) {
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
	import Candidate from "./Candidate.svelte";

	// link to go back to unfiltered list
    //import LinkToFullCandidateList from "./components/LinkToFullCandidateList.svelte";

</script>


{#each districts as district, key}
    {#each candidate_district_regions(district_candidates(district)) as district_region, key}
        {#if region_district_candidates(chamber, region, district_region.district).length > 0}
            <article class="m-district">
                {district_region.label} {district_region.region}
                {#each region_district_candidates(chamber, region, district_region.district) as candidate}
                    <Candidate candidate = {candidate} />
                {/each}
            </article>
        {/if}
    {/each}
{/each}