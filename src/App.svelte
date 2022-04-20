<style>
	/*
	23.7288135593%
	32.2033898305%
	48.275862069%
	*/
	:global(.district-listing) {
		border-bottom: 1px solid #d6d6da;
		margin-bottom: 1.5em;
		padding-bottom: .75em;
	}
	:global(.district-listing:last-of-type) {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}
	:global(.candidates-listing) {
    	display: flex;
    	flex-wrap: wrap;
		margin-top: 0.5em;
		margin-bottom: 1.5em;
		justify-content: flex-start;
		
  	}
	:global(.candidates-listing h3, .candidates-listing h4) {
		width: 100%;
		/*margin-bottom: 0.25em;*/
	}

	:global(.m-homepage-zones .m-zone) {
		max-width: none;
		width: 100%;
	}

	:global(.party-name) {
		color: #869298;
	}

	:global(.party-name:before) {
		border-radius: 50%;
		align-items: center;
		color: #fff;
		background-color: #869298;
		font-weight: 700;
		margin-right: 0.25em;		
		height: 1.25em;
		width: 1.25em;
		display: inline-flex;
		justify-content: center;
		flex: 0 0 auto;
	}

	:global(.party-dfl) {color: #0793AB;}
	:global(.party-dfl-icon:before) {
		content: "D";
		background: #0793AB;
	}

	:global(.party-republican) {color: #A1000F}
	:global(.party-republican-icon:before) {
		content: "R";
		background: #A1000F;
	}

	:global(.party-legal-marijuana-now) {color: #286806;}
	:global(.party-legal-marijuana-icon:before) {
		content: "L";
		background: #286806;
	}

	:global(.party-grassroots-legalize-cannabis) {color: #41AB07;}
	:global(.party-grassroots-legalize-cannabis-icon:before) {
		content: "G";
		background: #41AB07;
	}

	:global(.party-green) {color: #07AB20;}
	:global(.party-green-icon:before) {
		content: "G";
		background: #07AB20;
	}

    :global(.m-chamber-header) {text-transform: capitalize;}

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

	.a-filter-switch {
		display: flex;
		justify-content: flex-end;
		font-size: var(--scale-3);
	}
	.a-switch-toggle {
		cursor: pointer;
	}
</style>

<script>
	// router
	import router from "page";
	import routes from "./routes";

	// the nice Svelte select element
	import Select from 'svelte-select';

	// the Svelte toggle switch
	import Switch from './components/Switch.svelte';

	// current result set
	let results;

	// url parameters
	let params;

	// remote data
	let items = []
	async function getData() {
		/*
		for actual 2022 data:
		https://s3.amazonaws.com/data.minnpost/projects/spreadsheets/1dQxzfWG1a97zRzKN3QJQnGG4H3M4KhOGoi30_E62-2o-Categories|House|Senate-custom.json
		for local data (if flask app is running):
		http://0.0.0.0:5001/candidate-tracker/json/
		*/
		let res = await fetch(`https://s3.amazonaws.com/data.minnpost/projects/spreadsheets/1dQxzfWG1a97zRzKN3QJQnGG4H3M4KhOGoi30_E62-2o-Categories|House|Senate-custom.json`);
		let data = await res.json();
		items = data
		return items;
	}
    const dataPromise = getData();

	// this method allows us to specify keys that should not be searched and then search the results
	function searchResults(searchTerm, data) {
		var lowSearch = searchTerm.toLowerCase();
		let skipKeys = ['blurb'];
		let searchInDesiredKeys = data.filter(
			item => Object.entries(item).some(
				([key, val]) => ! skipKeys.includes(key) ? String(val).toLowerCase().includes(lowSearch) : false
			)
		);
		return searchInDesiredKeys;
	}

	// this allows us to specify a key that should be exactly matched to a value
	function matchResults(key, value, data) {
		let result = data.filter(item => item[key] === value);
		return result;
	}

	// create the promise result
	let searchTerm = '';
	$: filteredList = dataPromise.then((r) => {
		// filter the districts and/or candidates by the search term
		let candidates = searchResults(searchTerm, items.candidates);
		let districts = searchResults(searchTerm, items.candidates);
		districts = districts.reduce(function(filtered, item) {
			if ( item.district && item.region && item.chamber && item.party ) {
				district = {
					"district": item.district,
					"region": item.region,
					"chamber": item.chamber,
					"label": item.chamber[0].toUpperCase() + item.chamber.slice(1).concat(' District ', (item.district[0] == "0") ? item.district.substring(1) : item.district)
				}
				district = JSON.stringify(district);
				filtered.push(district);
			}
			return [...new Set(filtered)];
		}, []);

		districts = districts.map(function(item) {
            if (typeof item === 'string') {
                return JSON.parse(item);
            } else if (typeof item === 'object') {
                return item;
            }
        });

		//candidates = matchResults("dropped-out?", false, candidates);
		/* the performance on this is just bad */
		let active_candidates = matchResults("dropped-out?", false, candidates);
		let dropped_out_candidates = matchResults("dropped-out?", true, candidates);
		if (showDroppedOutCandidates == true) {
			candidates = active_candidates.concat(dropped_out_candidates);
		} else {
			candidates = active_candidates;
		}

		let regions = items.candidates.reduce(function(filtered, item) {
			if ( item.region ) {
				let region = item.region;
				filtered.push(region);
			}
			return [...new Set(filtered)];
		}, []);
		let region_ids = items.candidates.reduce(function(filtered, item) {
			if ( item["region-id"] ) {
				let party = item["region-id"];
				filtered.push(party);
			}
			return [...new Set(filtered)];
		}, []);

		// filter chambers
		let chambers = items.candidates.reduce(function(filtered, item) {
			if ( item.chamber ) {
				let chamber = item.chamber;
				filtered.push(chamber);
			}
			return [...new Set(filtered)];
		}, []);

		// filter parties
		let all_parties = items.candidates.reduce(function(filtered, item) {
			if ( item.party ) {
				let party = item.party;
				filtered.push(party);
			}
			return [...new Set(filtered)];
		}, []);
		let all_party_ids = items.candidates.reduce(function(filtered, item) {
			if ( item["party-id"] ) {
				let party = item["party-id"];
				filtered.push(party);
			}
			return [...new Set(filtered)];
		}, []);

		// make the final data array of districts and candidates, and parties and offices, for filteredList to use and return it
		let data = [];
		
		if ( typeof all_parties !== "undefined" ) {
			data["all_parties"] = all_parties;
		}
		if ( typeof all_party_ids !== "undefined" ) {
			data["all_party_ids"] = all_party_ids;
		}
		if ( typeof all_party_ids !== "undefined" && typeof all_parties !== "undefined" ) {
			let party_select = [];
			for (var index = 0, len = all_parties.length; index < len; index++) {
				var party = all_parties[index];
				let party_choice = {
					value: all_party_ids[index],
					label: party,
					group: '' // if we want to group parties, populate this
				};
				party_select.push(party_choice);
			}
			data["party_select"] = party_select;
		}
		if ( typeof districts !== "undefined" ) {
			data["districts"] = districts;
			let district_select = [];
			for (var index = 0, len = districts.length; index < len; index++) {
				var district = districts[index];
				let district_choice = {
					value: district.district,
					label: district.label,
					group: '' // if we want to group districts, populate this
				};
				district_select.push(district_choice);
			}
			data["district_select"] = district_select;
		}
		if ( typeof regions !== "undefined" ) {
			data["regions"] = regions;
		}
		if ( typeof region_ids !== "undefined" ) {
			data["region_ids"] = region_ids;
		}
		if ( typeof region_ids !== "undefined" && typeof regions !== "undefined" ) {
			let region_select = [];
			for (var index = 0, len = regions.length; index < len; index++) {
				var region = regions[index];
				let region_choice = {
					value: region_ids[index],
					label: region,
					group: ''
				};
				region_select.push(region_choice);
			}
			data["region_select"] = region_select;
		}
		if ( typeof chambers !== "undefined" ) {
			data["chambers"] = chambers;
		}
		if ( typeof candidates !== "undefined" ) {
			data["candidates"] = candidates;
		}
		if ( typeof dropped_out_candidates !== "undefined" ) {
			data["dropped_out_candidates"] = dropped_out_candidates;
		}
		data["searchTerm"] = searchTerm;
		return data;
	});

	// whether to show candidates who have dropped out
	let showDroppedOutCandidates = false;

	// template router
	// Loop around all of the routes and create a new instance of
	// router for reach one with some rudimentary checks.
	routes.forEach(route => {
		router(
			route.path,
			// Set the params variable to the context.
			// We use this on the component initialisation
			(context, next) => {
				params = context.params
				next()
			},
			() => {
				results = route.component;
			}
		)
	});

	// Start the router
	// currently, if we don't use the hashbang, page reloads don't work
	router.start({
		hashbang: true
	});

	// router base
	/*
	if testing locally you can comment out the active router.base line.
	the actual WP post we need to use is:
	router.base('?p=2079676&preview=true');
	*/
	router.base('/elections/2022/04/whos-running-for-the-minnesota-legislature-in-2022/');

	let selectParty;
	let selectDistrict;
	let selectRegion;

	// when the x is clicked, return to the main list
	function clearSelect(event) {
		router('/');
	}

	let selectedParty = undefined;
	function handlePartySelect(event) {
		selectDistrict.handleClear();
		selectRegion.handleClear();
		selectedParty = event.detail;
		router('/by-party/' + selectedParty.value);
	}
	
	let selectedDistrict = undefined;
	function handleDistrictSelect(event) {
		selectParty.handleClear();
		selectRegion.handleClear();
		selectedDistrict = event.detail;
		router('/by-district/' + selectedDistrict.value);
	}

	let selectedRegion = undefined;
	function handleRegionSelect(event) {
		selectParty.handleClear();
		selectDistrict.handleClear();
		selectedRegion = event.detail;
		router('/by-region/' + selectedRegion.value);
	}

	function setSelectedRegion(params, region_ids, regions) {
		let selectedItem = undefined;
		if (params && params.region) {
			let key = region_ids.indexOf(params.region);
			let value = regions[key];
			if ( value && typeof key !== "undefined" && typeof value !== "undefined" ) {
				selectedItem = {value: params.region, label: regions[key]};
			}
		}		
		return selectedItem;
	}
	
	function setSelectedDistrict(params, districts) {
		let selectedItem = undefined;
		if (params && params.district) {
			let districtObject = districts.find(item => item["district"] === params["district"]);
			if ( typeof districtObject !== "undefined" ) {
				selectedItem = {value: params.district, label: districtObject.label};
			}
		}		
		return selectedItem;
	}

	function setSelectedParty(params, all_party_ids, all_parties) {
		let selectedItem = undefined;
		if (params && params.party) {
			let key = all_party_ids.indexOf(params.party);
			let value = all_parties[key];
			if ( value && typeof key !== "undefined" && typeof value !== "undefined" ) {
				selectedItem = {value: params.party, label: all_parties[key]};
			}
		}		
		return selectedItem;
	}
	
</script>

<div class="m-filtering">
	<input placeholder="Search for a candidate, party, region, or district" class="a-filter-search" bind:value={searchTerm} />
</div>

<section class="container m-zones m-homepage-zones">
	{#await filteredList}
		Loading...
	{:then items}
		<div class="m-filtering">
			<div class="a-filter-select">
				<Select value={setSelectedParty(params, items.all_party_ids, items.all_parties)} inputStyles="font-size: 1em; letter-spacing: inherit;" placeholder="Choose a party..." items={items.party_select} on:select={handlePartySelect} on:clear={clearSelect} bind:this="{selectParty}"></Select>
			</div>
			<div class="a-filter-select">
				<Select value={setSelectedRegion(params, items.region_ids, items.regions)} inputStyles="font-size: 1em; letter-spacing: inherit;" placeholder="Choose a region..."  items={items.region_select} on:select={handleRegionSelect} on:clear={clearSelect} bind:this="{selectRegion}"></Select>
			</div>
			<div class="a-filter-select">
				<Select value={setSelectedDistrict(params, items.districts)} inputStyles="font-size: 1em; letter-spacing: inherit;" placeholder="Choose a district..."  items={items.district_select} on:select={handleDistrictSelect} on:clear={clearSelect} bind:this="{selectDistrict}"></Select>
			</div>
		</div>

		{#if items.dropped_out_candidates.length > 0}
			<div class="a-filter-switch">
				<Switch bind:checked={showDroppedOutCandidates} id="show-dropped-out-candidates"></Switch> <label class="a-switch-toggle show-dropped-out-candidates" for="show-dropped-out-candidates"><small class="a-form-caption">Show candidates who are no longer running</small></label>
			</div>
		{/if}



		{#key params}
			<svelte:component this={results} params="{params}" items="{items}" />
		{/key}
	{/await}
</section>
