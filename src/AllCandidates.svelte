<script>
    // all data for candidates and races
    export let items;

    // the candidates from App.svelte
	let candidates = items.candidates;

    let chambers = [...new Set(candidates.map(function(item, index) {
        if ( item["district"].indexOf("A") >= 0 || item["district"].indexOf("B") >= 0 ) {
            return "house"
        } else {
            return "senate"
        }
    }))];

    // the distinct party names from the candidates
    let parties = [...new Set(
        candidates.reduce((ids, thing) => {
            if (thing.party !== null) {
                return thing.party;
            }
            //return ids;
            }, [])
    )];

    // create a list of candidates for a chamber
	let party_candidates = function(party, chamber) {
        if (chamber === "house") {
            return items.candidates.filter(
                item => item["party"] !== null && item["party"].indexOf(party) !== -1 && (item["district"].indexOf("A") >= 0 || item["district"].indexOf("B") >= 0)
            )
        } else {
            return items.candidates.filter(
                item => item["party"] !== null && item["party"].indexOf(party) !== -1 && (item["district"].indexOf("A") === -1 && item["district"].indexOf("B") === -1)
            )
        }
	}

    // create a list of candidates in their chamber or district
	let district_candidates = function(chamber, district = '') {
        if (district !== '') {
            if (chamber === "house") {
                candidates = items.candidates.filter(
                    item => (item["district"].indexOf("A") >= 0 || item["district"].indexOf("B") >= 0) && item["district"] == district
                ) 
            } else {
                candidates = items.candidates.filter(
                    item => item["district"].indexOf("A") === -1 && item["district"].indexOf("B") === -1 && item["district"] == district
                )
            }
        } else {
            if (chamber === "house") {
                candidates = items.candidates.filter(
                    item => (item["district"].indexOf("A") >= 0 || item["district"].indexOf("B") >= 0)
                ) 
            } else {
                candidates = items.candidates.filter(
                    item => item["district"].indexOf("A") === -1 && item["district"].indexOf("B") === -1
                )
            }
        }
        return candidates;
	}

    // the distinct districts from this list of candidates
	let chamber_candidate_districts = function(candidates) {
		return [...new Set(candidates.map(value => value["district"]))];
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

{#each items.chambers as chamber}
    {#if district_candidates(chamber).length > 0}
        <section class="chamber-listing">
            <h2 class="m-archive-header m-chamber-header">{chamber}</h2>
            {#if chamber.blurb}
                <p>{@html chamber.blurb}</p>
            {/if}
            {#each chamber_candidate_districts(district_candidates(chamber)) as district, key}
                {#if district_candidates(chamber, district).length > 0}
                    <article class="m-district">
                        {chamber}
                        {#if district }{district}{/if}
                        {#if items.districts[key] }{items.districts[key]["region"]}{/if}
                        {#each district_candidates(chamber, district) as candidate}
                            <Candidate candidate = {candidate} />
                        {/each}
                    </article>
                {/if}
            {/each}
        </section>
    {/if}
{/each}
