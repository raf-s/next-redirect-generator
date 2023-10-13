### What is this?
Tool to generate netlify.toml redirects from Next.js dynamic routes in the pages folder.

### Use case 
If you are doing a `next export` but you have one or more dynamic routes (eg `/pages/[yourVariable].jsx`) you will end up with files like `[yourVariable].html` inside your `out` folder. Going to this page directly will result in a 404. To deal with this problem we need to set up Netlify redirects which look like:
```
[[redirects]]
from = "/:yourVariable
to = "/[yourVariable].html"
status = 200
```
This tool will autogenerate those and spit them out in the console for you to copy into your Netlify.toml file - for convenience and to eliminate human error.

### How to run
Execute using NPX: `npx nextjs-to-netlify-redirect-exporter`

or

Install `yarn add -D nextjs-to-netlify-redirect-exporter` &
`yarn run nextjs-to-netlify-redirect-exporter`

Run the command in the root of your Next.js project - the script looks for a `pages` folder in your current working directory.

### Examples

1. _redirects file format (stick in your `public` folder).

`yarn run nextjs-to-netlify-redirect-exporter --format="_redirect"`

2. Netlify.toml file format.

`yarn run nextjs-to-netlify-redirect-exporter --format="netlify.toml"`

3. Alternate `pages` directory.

`yarn run nextjs-to-netlify-redirect-exporter --path="src/pages"` else it will look at the closes `pages` folder in your CWD.

### Important
Run this at your repo root.
