<script>
    // all data for candidates and races
    export let items;

	// page.js data, such as the district we want
	export let params;

	// what district do we want
    let districts = [];
    if (params && params.district) {
        let key = items.districts.findIndex((item) => item.district === params.district);
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

	// single candidate template
	import Candidate from "./Candidate.svelte";

	// link to go back to unfiltered list
    //import LinkToFullCandidateList from "./components/LinkToFullCandidateList.svelte";

</script>

{#each districts as district_region, key}
    {#if district_candidates(district_region.district).length > 0}
        <article class="m-district">
            {district_region.label} {district_region.region}
            {#each district_candidates(district_region.district) as candidate}
                <Candidate candidate = {candidate} />
            {/each}
        </article>
    {/if}
{/each}