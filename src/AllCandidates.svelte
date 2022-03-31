<script>
    // all data for candidates and races
    export let items;

    // the candidates from App.svelte
	let candidates = items.candidates;

    // the districts from App.svelte
    let districts = items.districts;

    // create a list of candidates in their chamber or district
	let district_candidates = function(chamber, district = '') {
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

    let chamber_candidate_district_regions = function(candidates) {
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
    import LinkToFullCandidateList from "./components/LinkToFullCandidateList.svelte";
    
</script>

<style>
    .m-chamber-header {text-transform: capitalize;}
</style>

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
            {#each chamber_candidate_district_regions(district_candidates(chamber)) as district_region, key}
                {#if district_candidates(chamber, district_region.district).length > 0}
                    <Race district_region={district_region} candidates={district_candidates(chamber, district_region.district)} />
                {/if}
            {/each}
        </section>
    {/if}
{/each}
