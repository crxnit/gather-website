# Google Search Console Setup

## Step 1: Add the primary domain

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Click the property dropdown (top left) → **Add property**
3. Choose **Domain** (not URL prefix) — this covers all subdomains and protocols automatically
4. Enter `gathercateringandevents.com`
5. Google will give you a TXT record to add to your DNS, something like:
   ```
   google-site-verification=xxxxxxxxxxxxxxxx
   ```
6. Add this TXT record at your DNS provider:

   | Record | Name | Value |
   |--------|------|-------|
   | TXT | `@` | `google-site-verification=xxxxxxxxxxxxxxxx` |

7. Click **Verify** in Search Console (DNS can take a few minutes to propagate)

## Step 2: Submit the sitemap

1. Once verified, go to **Sitemaps** in the left sidebar
2. Enter `sitemap.xml` in the "Add a new sitemap" field
3. Click **Submit**
4. Status should show "Success" after Google fetches it

Sitemap URL: `https://gathercateringandevents.com/sitemap.xml`

## Step 3: Add the secondary domain

1. Repeat Step 1 for `gathercafeandevents.com`
2. Add a separate TXT record to that domain's DNS zone
3. You **don't** need to submit a sitemap for this one — Google will see the 301 redirects and consolidate everything under the primary domain automatically

## Step 4: Verify it's working

1. In Search Console for the primary domain, go to **URL Inspection**
2. Enter `https://gathercateringandevents.com/`
3. Click **Request Indexing** to prompt Google to crawl the site
4. Over the next few days, check **Coverage** (or **Pages**) to see pages getting indexed

## Optional

- In **Settings → Change of address**, if the cafe domain previously had a live site, you can formally tell Google it moved to the catering domain
- Check back in 3–5 days to confirm all 12 pages from the sitemap are indexed
