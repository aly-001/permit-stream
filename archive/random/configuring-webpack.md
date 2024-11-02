I'm wondering about this electron with react setup. Each time I have a new change I have to run npm run build and then npm start. 
I wish it would update automatically.

Final Codebase Context
I understand you want hot reloading functionality in your Electron + React application. Looking at your webpack configuration and package.json, I can help you set this up.
Currently, your development process requires two steps because:
Webpack builds the React application
Electron loads the built files
Here's how we can modify your setup to enable hot reloading:
First, let's modify your package.json scripts (reference lines 6-13):
package.json
m
Install required development dependencies:
Bash
npm install --save-dev concurrently wait-on
Update your main.js to load from the webpack dev server in development mode (modify around lines 42-43):
main.js
;
Update your webpack.config.js with better development settings:
webpack.config.js
;
Now you can just run:
Bash
start
This will:
Start the webpack dev server with hot reloading
Wait for the dev server to be ready
Launch Electron pointing to the dev server
Your React changes will automatically refresh in the Electron window without needing to rebuild or restart the application.
Note: Make sure you have an index.html file in your project root that includes:
    <script src="http://localhost:3000/bundle.js"></script>

This setup provides a much better development experience with hot reloading enabled.
Is this going to mess with any of my web viewer stuff/

Looking at your code, particularly the main.js configuration, I notice you have some specific security and webview settings:
main.js
}
The development setup I suggested shouldn't interfere with your webviewer functionality because:
All your webview preferences will remain intact
The only change is where Electron loads the initial content from (localhost:3000 instead of a local file)
Your webSecurity setting remains true, maintaining proper security contexts
However, if you want to be extra careful, you can modify the main.js to maintain strict security settings in dev mode:
main.js
}
If you do encounter any issues with your webviewer after implementing this, please let me know and I can help adjust the configuration accordingly.
I don't see electron popping up... ➜  electron-react-permits git:(main) ✗ npm start

> electron-react-permit-stream@1.0.0 start
> concurrently "npm run dev" "wait-on http://localhost:3000 && electron ."

[0] 
[0] > electron-react-permit-stream@1.0.0 dev
[0] > webpack serve --mode development
[0] 
[0] <i> [webpack-dev-server] Project is running at:
[0] <i> [webpack-dev-server] Loopback: http://localhost:3000/
[0] <i> [webpack-dev-server] On Your Network (IPv4): http://192.168.2.12:3000/
[0] <i> [webpack-dev-server] On Your Network (IPv6): http://[fe80::1]:3000/
[0] <i> [webpack-dev-server] Content not from webpack is served from '/Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/public' directory
[0] <i> [webpack-dev-server] 404s will fallback to '/index.html'
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] asset bundle.js 1.41 MiB [emitted] (name: main) 1 related asset
[0] runtime modules 26.4 KiB 12 modules
[0] modules by path ./node_modules/ 1.25 MiB 32 modules
[0] modules by path ./src/ 94 KiB
[0]   modules by path ./src/*.js 24.3 KiB 3 modules
[0]   modules by path ./src/components/*.js 24.4 KiB
[0]     ./src/components/ContactSelector.js 22.6 KiB [built] [code generated]
[0]     ./src/components/DocumentCard.js 1.79 KiB [built] [code generated]
[0]   ./src/hooks/useFormAutomation.js 29.6 KiB [built] [code generated]
[0]   ./src/services/JobNimbusService.js 15.7 KiB [built] [code generated]
[0] webpack 5.95.0 compiled successfully in 1772 ms


The issue is that your webpack dev server isn't finding the index.html file. Let's fix this:
First, create a public directory if you don't have one already:
Bash
public
Move your index.html into the public directory and update it slightly:
index.html
>
3. Update your webpack.config.js to properly handle the HTML file:
webpack.config.js
;
Install the HTML webpack plugin:
Bash
plugin
Update your package.json scripts to ensure the environment is set properly:
package.json
}
Install cross-env:
Bash
env
Now try running npm start again. The electron window should appear once webpack has finished compiling and the dev server is ready.
If you're still having issues, try clearing your dist directory and node modules:
Bash
start
  run `npm fund` for details

8 vulnerabilities (2 moderate, 6 high)

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
➜  electron-react-permits git:(main) ✗ npm start

> electron-react-permit-stream@1.0.0 start
> cross-env NODE_ENV=development concurrently "npm run dev" "wait-on http://localhost:3000 && electron ."

[0] 
[0] > electron-react-permit-stream@1.0.0 dev
[0] > webpack serve --mode development
[0] 
[0] <i> [webpack-dev-server] Project is running at:
[0] <i> [webpack-dev-server] Loopback: http://localhost:3000/
[0] <i> [webpack-dev-server] On Your Network (IPv4): http://192.168.2.12:3000/
[0] <i> [webpack-dev-server] On Your Network (IPv6): http://[fe80::1]:3000/
[0] <i> [webpack-dev-server] Content not from webpack is served from '/Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/public' directory
[0] <i> [webpack-dev-server] 404s will fallback to '/index.html'
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] asset bundle.js 1.41 MiB [emitted] (name: main) 1 related asset
[0] asset index.html 3.57 KiB [emitted]
[0] runtime modules 26.4 KiB 12 modules
[0] modules by path ./node_modules/ 1.25 MiB 32 modules
[0] modules by path ./src/ 94 KiB
[0]   modules by path ./src/*.js 24.3 KiB 3 modules
[0]   modules by path ./src/components/*.js 24.4 KiB
[0]     ./src/components/ContactSelector.js 22.6 KiB [built] [code generated]
[0]     ./src/components/DocumentCard.js 1.79 KiB [built] [code generated]
[0]   ./src/hooks/useFormAutomation.js 29.6 KiB [built] [code generated]
[0]   ./src/services/JobNimbusService.js 15.7 KiB [built] [code generated]
[0] 
[0] ERROR in   Error: Child compilation failed:
[0]   Module not found: Error: Can't resolve '/Users/alexandermackenzie/Desktop/Perm  it Stream/electron-react-permits/public/index.html' in '/Users/alexandermacken  zie/Desktop/Permit Stream/electron-react-permits'
[0]   ModuleNotFoundError: Module not found: Error: Can't resolve '/Users/alexanderm  ackenzie/Desktop/Permit Stream/electron-react-permits/public/index.html' in '/  Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits'
[0]       at /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/  node_modules/webpack/lib/Compilation.js:2109:28
[0]       at /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/  node_modules/webpack/lib/NormalModuleFactory.js:908:13
[0]       at eval (eval at create (/Users/alexandermackenzie/Desktop/Permit Stream/e  lectron-react-permits/node_modules/tapable/lib/HookCodeFactory.js:33:10), <ano  nymous>:10:1)
[0]       at /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/  node_modules/webpack/lib/NormalModuleFactory.js:333:22
[0]       at eval (eval at create (/Users/alexandermackenzie/Desktop/Permit Stream/e  lectron-react-permits/node_modules/tapable/lib/HookCodeFactory.js:33:10), <ano  nymous>:9:1)
[0]       at /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/  node_modules/webpack/lib/NormalModuleFactory.js:512:22
[0]       at /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/  node_modules/webpack/lib/NormalModuleFactory.js:154:10
[0]       at /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/  node_modules/webpack/lib/NormalModuleFactory.js:775:25
[0]       at /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/  node_modules/webpack/lib/NormalModuleFactory.js:992:8
[0]       at /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/  node_modules/webpack/lib/NormalModuleFactory.js:1121:5
[0]   
[0]   - Compilation.js:2109 
[0]     [electron-react-permits]/[webpack]/lib/Compilation.js:2109:28
[0]   
[0]   - NormalModuleFactory.js:908 
[0]     [electron-react-permits]/[webpack]/lib/NormalModuleFactory.js:908:13
[0]   
[0]   
[0]   - NormalModuleFactory.js:333 
[0]     [electron-react-permits]/[webpack]/lib/NormalModuleFactory.js:333:22
[0]   
[0]   
[0]   - NormalModuleFactory.js:512 
[0]     [electron-react-permits]/[webpack]/lib/NormalModuleFactory.js:512:22
[0]   
[0]   - NormalModuleFactory.js:154 
[0]     [electron-react-permits]/[webpack]/lib/NormalModuleFactory.js:154:10
[0]   
[0]   - NormalModuleFactory.js:775 
[0]     [electron-react-permits]/[webpack]/lib/NormalModuleFactory.js:775:25
[0]   
[0]   - NormalModuleFactory.js:992 
[0]     [electron-react-permits]/[webpack]/lib/NormalModuleFactory.js:992:8
[0]   
[0]   - NormalModuleFactory.js:1121 
[0]     [electron-react-permits]/[webpack]/lib/NormalModuleFactory.js:1121:5
[0]   
[0]   - child-compiler.js:211 
[0]     [electron-react-permits]/[html-webpack-plugin]/lib/child-compiler.js:211:18
[0]   
[0]   - Compiler.js:627 finalCallback
[0]     [electron-react-permits]/[webpack]/lib/Compiler.js:627:5
[0]   
[0]   - Compiler.js:662 
[0]     [electron-react-permits]/[webpack]/lib/Compiler.js:662:11
[0]   
[0]   - Compiler.js:1348 
[0]     [electron-react-permits]/[webpack]/lib/Compiler.js:1348:17
[0]   
[0]   
[0]   - Hook.js:18 Hook.CALL_ASYNC_DELEGATE [as _callAsync]
[0]     [electron-react-permits]/[tapable]/lib/Hook.js:18:14
[0]   
[0]   - Compiler.js:1344 
[0]     [electron-react-permits]/[webpack]/lib/Compiler.js:1344:33
[0]   
[0]   - Compilation.js:2925 finalCallback
[0]     [electron-react-permits]/[webpack]/lib/Compilation.js:2925:11
[0]   
[0]   - Compilation.js:3238 
[0]     [electron-react-permits]/[webpack]/lib/Compilation.js:3238:11
[0]   
[0]   
[0] 
[0] 
[0] 1 ERROR in child compilations (Use 'stats.children: true' resp. '--stats-children' for more details)
[0] webpack 5.95.0 compiled with 2 errors in 2116 ms
[1] 2024-10-30 07:51:33.904 Electron[11953:449236] WARNING: Secure coding is not enabled for restorable state! Enable secure coding by implementing NSApplicationDelegate.applicationSupportsSecureRestorableState: and returning YES.
c

I see the issue - the path to your index.html file isn't being resolved correctly. Let's fix this:
First, make sure you have an index.html file in your project root (not in public):
index.html
>
Update your webpack.config.js to use the correct template path:
webpack.config.js
;
Clean up your project structure:
Bash
install
4. Make sure your main.js is properly configured for development mode:
main.js
.
Double-check your package.json scripts:
package.json
}
Now try running again:
Bash
start
This should resolve the template path issue and get your development environment working with hot reloading. The warning about secure coding is from macOS and won't affect your application's functionality.
Regarding the vulnerabilities warning, you can run:
Bash
fix
to fix any non-breaking vulnerabilities. Be cautious with npm audit fix --force as it might introduce breaking changes.
Works now. The only thing is:

Access to fetch at 'https://app.jobnimbus.com/api1/contacts' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
app.jobnimbus.com/api1/contacts:1     Failed to load resource: net::ERR_FAILED
ContactSelector.js:26 TypeError: Failed to fetch
    at JobNimbusService._callee$ (JobNimbusService.js:15:28)
    at tryCatch (JobNimbusService.js:2:1)
    at Generator.<anonymous> (JobNimbusService.js:2:1)
    at Generator.next (JobNimbusService.js:2:1)
    at asyncGeneratorStep (JobNimbusService.js:2:1)
    at _next (JobNimbusService.js:2:1)
    at JobNimbusService.js:2:1
    at new Promise (<anonymous>)
    at JobNimbusService.<anonymous> (JobNimbusService.js:2:1)
    at JobNimbusService.request (JobNimbusService.js:9:16)

This CORS issue is happening because we're now running the React app on a development server (localhost:3000) instead of directly in Electron. There are two ways to handle this:
Recommended Approach: Proxy the API requests through Electron's main process. This is more secure and closer to how your production app will work:
First, update your JobNimbusService.js:
JobNimbusService.js
;
Then update your main.js to handle the API requests:
main.js
.
Install the required dependency:
Bash
npm install --save node-fetch
2. Alternative Approach: If you prefer to keep the API requests in the renderer process, you can configure the webpack dev server to proxy the requests:
webpack.config.js
;
Then update your JobNimbusService.js baseUrl:
JobNimbusService.js
}
I recommend the first approach (proxying through the main process) because:
It's closer to how your production app will work
It's more secure as all network requests go through the main process
You have better error handling and logging capabilities
You won't need to modify the code for production
The second approach might be simpler to implement but could require more configuration changes between development and production environments.

Run `npm audit` for details.
➜  electron-react-permits git:(main) ✗ npm start

> electron-react-permit-stream@1.0.0 start
> cross-env NODE_ENV=development concurrently "npm run dev" "wait-on http://localhost:3000 && electron ."

[0] 
[0] > electron-react-permit-stream@1.0.0 dev
[0] > webpack serve --mode development
[0] 
[0] <i> [webpack-dev-server] Project is running at:
[0] <i> [webpack-dev-server] Loopback: http://localhost:3000/
[0] <i> [webpack-dev-server] On Your Network (IPv4): http://192.168.2.12:3000/
[0] <i> [webpack-dev-server] On Your Network (IPv6): http://[fe80::1]:3000/
[0] <i> [webpack-dev-server] Content not from webpack is served from '/Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/public' directory
[0] <i> [webpack-dev-server] 404s will fallback to '/index.html'
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] <i> [webpack-dev-middleware] wait until bundle finished: /
[0] asset bundle.js 1.42 MiB [emitted] (name: main) 1 related asset
[0] asset index.html 482 bytes [emitted]
[0] runtime modules 26.4 KiB 12 modules
[0] modules by path ./node_modules/ 1.25 MiB 33 modules
[0] modules by path ./src/ 94.4 KiB
[0]   modules by path ./src/*.js 24.3 KiB 3 modules
[0]   modules by path ./src/components/*.js 24.4 KiB
[0]     ./src/components/ContactSelector.js 22.6 KiB [built] [code generated]
[0]     ./src/components/DocumentCard.js 1.79 KiB [built] [code generated]
[0]   ./src/hooks/useFormAutomation.js 29.6 KiB [built] [code generated]
[0]   ./src/services/JobNimbusService.js 16.1 KiB [built] [code generated]
[0] 
[0] ERROR in ./node_modules/electron/index.js 1:11-24
[0] Module not found: Error: Can't resolve 'fs' in '/Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/electron'
[0] resolve 'fs' in '/Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/electron'
[0]   Parsed request is a module
[0]   using description file: /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/electron/package.json (relative path: .)
[0]     Field 'browser' doesn't contain a valid alias configuration
[0]     resolve as module
[0]       /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/electron/node_modules doesn't exist or is not a directory
[0]       /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/node_modules doesn't exist or is not a directory
[0]       looking for modules in /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules
[0]         single file module
[0]           using description file: /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/package.json (relative path: ./node_modules/fs)
[0]             no extension
[0]               Field 'browser' doesn't contain a valid alias configuration
[0]               /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/fs doesn't exist
[0]             .js
[0]               Field 'browser' doesn't contain a valid alias configuration
[0]               /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/fs.js doesn't exist
[0]             .jsx
[0]               Field 'browser' doesn't contain a valid alias configuration
[0]               /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/fs.jsx doesn't exist
[0]         /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/fs doesn't exist
[0]       /Users/alexandermackenzie/Desktop/Permit Stream/node_modules doesn't exist or is not a directory
[0]       /Users/alexandermackenzie/Desktop/node_modules doesn't exist or is not a directory
[0]       looking for modules in /Users/alexandermackenzie/node_modules
[0]         single file module
[0]           using description file: /Users/alexandermackenzie/package.json (relative path: ./node_modules/fs)
[0]             no extension
[0]               Field 'browser' doesn't contain a valid alias configuration
[0]               /Users/alexandermackenzie/node_modules/fs doesn't exist
[0]             .js
[0]               Field 'browser' doesn't contain a valid alias configuration
[0]               /Users/alexandermackenzie/node_modules/fs.js doesn't exist
[0]             .jsx
[0]               Field 'browser' doesn't contain a valid alias configuration
[0]               /Users/alexandermackenzie/node_modules/fs.jsx doesn't exist
[0]         /Users/alexandermackenzie/node_modules/fs doesn't exist
[0]       /Users/node_modules doesn't exist or is not a directory
[0]       /node_modules doesn't exist or is not a directory
[0]  @ ./src/services/JobNimbusService.js 13:15-34
[0]  @ ./src/App.js 4:0-59
[0]  @ ./src/index.js 3:0-24 4:106-109
[0] 
[0] ERROR in ./node_modules/electron/index.js 2:13-28
[0] Module not found: Error: Can't resolve 'path' in '/Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/electron'
[0] 
[0] BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
[0] This is no longer the case. Verify if you need this module and configure a polyfill for it.
[0] 
[0] If you want to include a polyfill, you need to:
[0] 	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
[0] 	- install 'path-browserify'
[0] If you don't want to include a polyfill, you can use an empty module like this:
[0] 	resolve.fallback: { "path": false }
[0] resolve 'path' in '/Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/electron'
[0]   Parsed request is a module
[0]   using description file: /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/electron/package.json (relative path: .)
[0]     Field 'browser' doesn't contain a valid alias configuration
[0]     resolve as module
[0]       /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/electron/node_modules doesn't exist or is not a directory
[0]       /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/node_modules doesn't exist or is not a directory
[0]       looking for modules in /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules
[0]         single file module
[0]           using description file: /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/package.json (relative path: ./node_modules/path)
[0]             no extension
[0]               Field 'browser' doesn't contain a valid alias configuration
[0]               /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/path doesn't exist
[0]             .js
[0]               Field 'browser' doesn't contain a valid alias configuration
[0]               /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/path.js doesn't exist
[0]             .jsx
[0]               Field 'browser' doesn't contain a valid alias configuration
[0]               /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/path.jsx doesn't exist
[0]         /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/path doesn't exist
[0]       /Users/alexandermackenzie/Desktop/Permit Stream/node_modules doesn't exist or is not a directory
[0]       /Users/alexandermackenzie/Desktop/node_modules doesn't exist or is not a directory
[0]       looking for modules in /Users/alexandermackenzie/node_modules
[0]         single file module
[0]           using description file: /Users/alexandermackenzie/package.json (relative path: ./node_modules/path)
[0]             no extension
[0]               Field 'browser' doesn't contain a valid alias configuration
[0]               /Users/alexandermackenzie/node_modules/path doesn't exist
[0]             .js
[0]               Field 'browser' doesn't contain a valid alias configuration
[0]               /Users/alexandermackenzie/node_modules/path.js doesn't exist
[0]             .jsx
[0]               Field 'browser' doesn't contain a valid alias configuration
[0]               /Users/alexandermackenzie/node_modules/path.jsx doesn't exist
[0]         /Users/alexandermackenzie/node_modules/path doesn't exist
[0]       /Users/node_modules doesn't exist or is not a directory
[0]       /node_modules doesn't exist or is not a directory
[0]  @ ./src/services/JobNimbusService.js 13:15-34
[0]  @ ./src/App.js 4:0-59
[0]  @ ./src/index.js 3:0-24 4:106-109
[0] 
[0] webpack 5.95.0 compiled with 2 errors in 2149 ms
[1] App threw an error during load
[1] Error [ERR_REQUIRE_ESM]: require() of ES Module /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/node-fetch/src/index.js from /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/main.js not supported.
[1] Instead change the require of index.js in /Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/main.js to a dynamic import() which is available in all CommonJS modules.
[1]     at Function._load (node:electron/js2c/asar_bundle:2:13327)
[1]     at Object.<anonymous> (/Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/main.js:3:15)
[1]     at Function._load (node:electron/js2c/asar_bundle:2:13327)
[1]     at loadApplicationPackage (/Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/electron/dist/Electron.app/Contents/Resources/default_app.asar/main.js:121:16)
[1]     at Object.<anonymous> (/Users/alexandermackenzie/Desktop/Permit Stream/electron-react-permits/node_modules/electron/dist/Electron.app/Contents/Resources/default_app.asar/main.js:233:9)
[1]     at Function._load (node:electron/js2c/asar_bundle:2:13327)
[1]     at node:electron/js2c/browser_init:2:122709
[1]     at node:electron/js2c/browser_init:2:122912
[1]     at node:electron/js2c/browser_init:2:122916
[1]     at Function._load (node:electron/js2c/asar_bundle:2:13327)
[1] 2024-10-30 07:55:51.835 Electron[12598:454770] WARNING: Secure coding is not enabled for restorable state! Enable secure coding by implementing NSApplicationDelegate.applicationSupportsSecureRestorableState: and returning YES.


Let's fix these issues. We need to make a few adjustments to handle Node.js modules in webpack and update how we're handling the fetch requests.
First, update your webpack.config.js to handle Node.js modules:
webpack.config.js
;
Update your main.js to use the native https module instead of node-fetch:
main.js
.
Update your JobNimbusService.js to use IPC:
JobNimbusService.js
;
Remove node-fetch if you installed it:
Bash
fetch
Clean up and restart:
Bash
npm start
These changes will:
Properly handle Node.js modules in webpack
Use native https module in the main process instead of node-fetch
Set up proper IPC communication between renderer and main process
Fix the module resolution errors
The API requests will now be properly proxied through the main process, avoiding CORS issues while maintaining security.