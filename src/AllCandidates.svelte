<script>
    // all data for candidates and races
    export let items;

    // the candidates from App.svelte
	let candidates = items.candidates;

    // the distinct party names from the candidates
    let parties = [...new Set(candidates.map(item => item.party))];

    // create a list of candidates for a party
	let party_candidates = function(party, district) {
		return items.candidates.filter(
			item => item["party"].indexOf(party) !== -1 && item["district"].indexOf(district) !== -1
		)
	}

    // create a list of candidates for a district
	let district_candidates = function(district, party = '') {
		if ( party !== '') {
			return items.candidates.filter(
				item => item["district"].indexOf(district) !== -1 && item["party"].indexOf(party) !== -1
			)
		} else {
			return items.candidates.filter(
				item => item["district"].indexOf(district) !== -1
			)
		}
	}

    // the distinct parties from this list of candidates
	let district_candidate_parties = function(candidates) {
		return [...new Set(candidates.map(value => value["party"]))];
	}

    // single candidate template
	import Candidate from "./Candidate.svelte";

    // link to go back to unfiltered list
    import LinkToFullCandidateList from "./components/LinkToFullCandidateList.svelte";
    
</script>

{#if items["searchTerm"] != ""}
    <aside class="m-search-result-info">
        Showing {items.candidates.length} {#if items.candidates.length == 1}candidate{:else}candidates{/if} in {items.districts.length} {#if items.districts.length == 1}district{:else}districts{/if} for <strong>{items["searchTerm"]}</strong>.
    </aside>
{/if}

{#each items.districts as district}
    <section class="race-listing">
        <h2 class="m-archive-header">{district.district}</h2>
        {#if district.blurb}
            <p>{@html district.blurb}</p>
        {/if}
        {#each district_candidate_parties(district_candidates(district[district])) as party, key}
            {#if party_candidates(party, district.district).length > 0}
                <section class="m-archive m-archive-homepage m-zone m-zone-homepage-more-top candidates-list">
                    <h3 class="m-archive-header party-{district_candidate_parties(district_candidates(district["district"]))[key].toLowerCase()}">{party}</h3>
                    {#each party_candidates(party, district.district) as candidate}
                        <Candidate candidate = {candidate} />
                    {/each}
                </section>
            {/if}
        {/each}
    </section>
{/each}
