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
	:global(.party-dfl) {color: #0793AB;}
	:global(.party-republican) {color: #A1000F}
	:global(.party-legal-marijuana-now) {color: #286806;}
	:global(.party-grassroots-legalize-cannabis) {color: #41AB07;}
	:global(.party-green) {color: #07AB20;}
    :global(.m-chamber-header) {text-transform: capitalize;}

	
</style>

<script>
	import { onMount } from "svelte";

	import Filters from './components/Filters.svelte';

	import { candidates, districts, regions, parties, filteredCandidates, isLoading } from './store.js';
	import { getCandidates } from './api'

	// router
	import router from "page";
	import routes from "./routes";

	// the nice Svelte select element
	import Select from 'svelte-select';

	//import Candidate from "Candidate";

	// the Svelte toggle switch
	//import Switch from './components/Switch.svelte';

	// current result set
	let results;

	// url parameters
	let params;

	// remote data
	//let items = []

	// create the promise result
	let searchTerm = '';
	
	onMount(async () => {
		const results = await getCandidates()
    	candidates.set(results.candidates);

		let all_districts = results.candidates.reduce(function(filtered, item) {
			if ( item.district && item.region && item.chamber && item.party ) {
				let district = {
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
		all_districts = all_districts.map(function(item) {
            if (typeof item === 'string') {
                return JSON.parse(item);
            } else if (typeof item === 'object') {
                return item;
            }
        });
		districts.set(all_districts);

    	isLoading.set(false);
	});
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
	//router.base('/elections/2022/04/whos-running-for-the-minnesota-legislature-in-2022/');

	
	
</script>

<section class="container m-zones m-homepage-zones">
	{#if $isLoading}
	<div class="job-list-loading">Loading candidates...</div>
	{:else}

	<Filters />
	
	{#key params}
		<svelte:component this={results} params="{params}" candidates={filteredCandidates} />
	{/key}
	{/if}
</section>
