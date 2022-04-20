<style>
    .m-filtering {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-bottom: 0.75em;
	}
	.a-filter-search {
		width: 100%;
	}
	
	.a-filter-select {
		width: 100%;
		margin-bottom: 0.75em;
	}

	@media screen and (min-width: 50em) {
		.a-filter-select {
			width: 32.2033898305%;
		}
	}

	@media screen and (min-width: 60em) and (max-width: 80em) {
		.a-filter-select {
			font-size: var(--scale-2);
		}
	}

	/*.a-filter-switch {
		display: flex;
		justify-content: flex-end;
		font-size: var(--scale-3);
	}
	.a-switch-toggle {
		cursor: pointer;
	}*/
  </style>

<script>
    import { searchTerm, districts, district, region, party, filteredCandidates } from '../store.js';

    
    let district_select = [];
    for (var index = 0, len = districts.length; index < len; index++) {
        var current_district = districts[index];
        let district_choice = {
            value: current_district.district,
            label: current_district.label,
            group: '' // if we want to group districts, populate this
        };
        district_select.push(district_choice);
        console.log(district_select);
    }

    
	
	
</script>

<div class="o-filters">

    <div class="m-filtering">
        <input placeholder="Search for a candidate, party, region, or district" class="a-filter-search" bind:value={$searchTerm} />
    </div>

    <div class="a-filter-select">
        is
    </div>

    <div class="m-filtering">
        add the select fields here.
    </div>

</div>