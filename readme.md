# Emotorad Assignment (CMS + Landing Page)

CMS and Landing are two next.js projects to demonstrate ISR, cache components and webhook style updation of changes from cms to landing page.

## Tech Stack

- Next.js
- Tailwind CSS
- Database (Postgres)

## CMS(structure)

- **Pages**
  - _/_ (Home page): shows a form to update the hero section details
- **Routes**
  - _/api/hero_
    - GET route - public route
    - PUT route - private to the cms website only. #improvement

## CMS(working)

1. Admin updates the hero section details on the home page.
2. The _/api/hero_ PUT route is called to update the hero section details.
3. update the hero section detail on db and then make a call to revalidate the cache on the landing page(webhook)

## Landing(structure)

- **Pages**
  - _/_ (Home page - landing hero section): cached component shows filled hero section details from db
- **Routes**
  - _/api/revalidate_ - public route which revalidates the cache on the landing page when triggered from the cms(called by cms after updating the hero section details on _/api/hero_ PUT request)

## Landing(working)

1. Landing Page is built during the build process once and then cached.

2. Its rebuild after every seven days in the background on its own.

3. It can also be updated by the webhook _/api/revalidate_ which revalidates the cached hero section details, this is done when the admin clicks on the "update landing page" button on the cms page.


## Why this approach

### Considerations

- The hero changes rarely (an admin edits it).
- Visitors should see the new hero soon after a change.
- The API should only be called when the content changes, not on every visit.

### Options I had

1. CSR(fetch on client side) - many drawbacks like no SEO, first request gets an empty page and then another request is sent from the client to fetch data, not a good user experience (also requires to handle cors issues for server and client),
Each user will trigger an api call even though the content is same for all the users. [BIG NO ❌]

2. Polling/client-side refetches - again a big no - cors issues, no seo, multiple requests that are wasteful as made for the same data. [BIG NO ❌]

3. SSR(fetch on every request) - it resolves the seo and empty page issue as it returns the filled page on the first request itself, but it fetches the hero section details on every visit which is slow and wasteful for data that changes rarely. [❌]

4. SSG(fetch at build time only) - this solves every problem with ssr, as it just fetches the hero section details once at build time, but the hero section details will get updated from the cms and ssg cannot handle changed details unless rebuilt. [❌]

5. ISR with time-based revalidation: the page is built once and served from the cache. After the set interval (e.g. 7 days) passes, the next visit still gets the cached page while a fresh copy is built in the background (stale-while-revalidate). [Good, but not ideal here ⚠️]
   - Long interval: the CMS is rarely called, but an edit can take up to 7 days to show up.
   - Short interval: edits show up sooner, but the CMS is called again and again even when nothing changed, which brings back the SSR problem.
   - So there is a trade-off between freshness and API calls. It fits data that changes on a known schedule, but the hero changes at unpredictable times.

6. ISR with revalidation via webhook (chosen ✅): the page is served from the cache like above, but the CMS also calls a webhook right after every save. The webhook invalidates the cached hero, so the next visits rebuild it. A long time-based interval stays as a safety net in case a webhook fails.
   - The CMS is called only when the hero actually changes.
   - Edits show up on the next refresh or two, not days later.
   - Visitors always get a fast, cached page.

