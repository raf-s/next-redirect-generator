### What is this?
Tool to generate redirects from Next.js dynamic routes in the pages folder. 
This helps the fringe case of using `next export` with dynamic routes (e.g. you're hosting your SPA statically on Netlify or S3).

Important: this only works with Next.js `pages` folder.

### The problem 
If you are using `next export` but you have one or more dynamic routes (eg `/pages/[yourVariable].jsx`) you will end up with files like `[yourVariable].html` inside your `out` folder. Going to this page directly will result in a 404. To deal with this problem we need to set up Netlify redirects which look like:
```
[[redirects]]
from = "/:yourVariable
to = "/[yourVariable].html"
status = 200
```

### The solution
This tool will autogenerate those and spit them out in the console for you to copy into your Netlify.toml file - for convenience and to eliminate human error.

### How to run
A) Script: Import the function and run in a post-build script
The package exposes `generateRedirects()` which can be ran in a node script to automate the process.
See `examples/using-script/scripts/postBuild.mjs`

B) NPX: Execute using NPX: `npx next-redirect-generator`

C) NPM script: Install `npm add -D next-redirect-generator` &
`npm run next-redirect-generator`

Run the command in the root of your Next.js project - the script looks for a `pages` folder in your current working directory. Otherwise provide a `--path` argument.

### Path flag (--path)
The `pages` folder is the tool's input.
If you don't specify the path, it will look at the closest `pages` folder in your CWD.

You may choose to provide the path to your pages folder explicitly by adding the `--path` flag.

e.g. `npm run next-redirect-generator --path=src/pages`

### Format flag (--format)
Specify what format you wish to output your redirects in.
Choices supported: `_redirects`, `netlify.toml`, `json`.

e.g. `npm run next-redirect-generator --format=netlify.toml`

### Output flag (--output)
Specify where you wish to output your redirects.

No flag: outputs to console, otherwise saves to the path provided.

e.g. `npm run next-redirect-generator --path=src/pages --format=redirects --output=dist/_redirects`
