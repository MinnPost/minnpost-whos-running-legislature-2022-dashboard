import AllCandidates from './AllCandidates.svelte'
import ByChamber from './ByChamber.svelte'
//import ByDistrict from './ByDistrict.svelte'
import ByParty from './ByParty.svelte'
//import Error from './Error.svelte'

export default [
  {
    path: '/',
    component: AllCandidates
  },
  {
    path: '/by-chamber',
    component: ByChamber
  },
  {
    path: '/by-chamber/:chamber',
    component: ByChamber
  },
  /*{
    path: '/by-district',
    component: ByDistrict
  },
  {
    path: '/by-district/:district',
    component: ByDistrict
  },*/
  {
    path: '/by-party',
    component: ByParty,
  },
  {
    path: '/by-party/:party',
    component: ByParty
  }
]
