<script>
    // all data for candidates and races
    export let items;

    // the candidates from App.svelte
	let candidates = items.candidates;

    let districts = items.districts;

    let chambers = items.chambers;

    // the distinct party names from the candidates
    let parties = [...new Set(
        candidates.reduce((ids, thing) => {
            if (thing.party !== null) {
                return thing.party;
            }
            //return ids;
            }, [])
    )];

    // create a list of candidates for a party and chamber
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
                    item => item["chamber"] == chamber && item["district"] == district
                ) 
            } else {
                candidates = items.candidates.filter(
                    item => item["chamber"] == chamber && item["district"] == district
                )
            }
        } else {
            if (chamber === "house") {
                candidates = items.candidates.filter(
                    item => item["chamber"] == chamber
                ) 
            } else {
                candidates = items.candidates.filter(
                    item => item["chamber"] == chamber
                )
            }
        }
        return candidates;
	}

    let chamber_candidate_district_regions = function(candidates) {
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
            {#each chamber_candidate_district_regions(district_candidates(chamber)) as district, key}
                {#if district_candidates(chamber, district.district).length > 0}
                    <article class="m-district">
                        {chamber} {district.district}
                        {#each district_candidates(chamber, district.district) as candidate}
                            <Candidate candidate = {candidate} />
                        {/each}
                    </article>
                {/if}
            {/each}
        </section>
    {/if}
{/each}
