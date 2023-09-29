# ServiceNow React Starter

Simple project skeleton for creating a ServiceNow Single Page App hosted on a ServiceNow instance.

## Clone Repository and Install Dependencies

Make sure you have `node` and `npm` installed on your system.

Run the following command to clone the repository

```
npx degit https://github.com/jmknz-icf/sn-react-starter <my-project-directory>
```

```
cd <my-project-directory>
npm install
```

After running these commands, you should have a working React app. Run the following
command to run the app locally:

```
npm start
```

The app should open in a new browser window and you should be able to navigate around
(though you may receive some errors related to data fetching).

## Setup Your ServiceNow Instance

You must configure your ServiceNow instance to be able to host your React app.

First, ensure that the `glide.attachment.extensions` system property either has no
value or contains the values of the assets that will be bundled from the React build
process (at minimum it should contain `js` and `css`).

I prefer doing the follwoing in `Global` scope as it makes the URLs that ServiceNow
outputs much cleaner than doing it within a `Scoped` application.

Go to `UI Pages` and click `New` to create a new UI Page. Set the name to wherever
you want the application to be hosted within ServiceNow (e.g. `my-react-app` - this
should be a URL friendly name) and select the `Direct` checkbox and submit the form.
Leave everything as is for now, we'll come back momentarily to this UI Page. Next,
add a trailing slash to the name of your UI Page (e.g. `my-react-app/`) then use
the context menu to `Insert`.

You might be wondering why we just copied our UI Page. Now it's not a _necessary_ step
but it makes the user experience a little better. When you cloned this starter app
you also installed the `react-router-dom` library as a dependency to allow routing
to multiple pages within your app. You'll notice in `src/index.js` that we are using
`HashRouter` instead of `BrowserRouter`. The React Router docs highly recommend against
using `HashRouter` but I think that deploying React on ServiceNow meets their
absolutely necessary criteria. When using `HashRouter`, navigating to a new route
will update the URL to include a hash separator (e.g. `/#/`). Therefore, if I had
a route called `/dashboard`, my url would look like `/#/dashboard`, whereas using
`BrowserRouter` it would actually replace your entire path to your route (e.g.
`/my-react-app` would go to `/dashboard` instead of `/my-react-app/dashboard`).
Now why did we have two UI Pages? So we want the UI Page that was named with the
trailing slash to be our main UI Page that will host the contents of our `index.html`
page because of how `react-router-dom` updates the URL with the slash between the
host and the route (if there's already a slash there it ignores it!). Additionally,
try navigating to `my-react-app/#/my-page` and then try `my-react-app/my-page`.
`HashRouter` won't result in a `404` error whereas the `BrowserRouter` routes will end up
causing `404` errors.

Let's go back to the UI Page without the trailing slash. You can add whatever you want
in the `HTML` section, but not necessary. The important thing here is to update the
`Client script` and enter the following:

```js
location = location.protocol + '//' + location.host + '/my-react-app/';
```

Replace `my-react-app` with whatever your UI Page name is. This will handle our
redirect from this UI Page to the UI Page with the trailing slash.

For now, we'll leave our UI Page with the trailing slash until we get to talking
a bit about deployment.

Once, we've created and configured our UI Pages, we can then look at hosting our
asset files.

Back in your application scope, create a Scripted REST API and we'll be creating
resource endpoints that will host our asset files.

For example, create a Scripted REST API with the following:

- Name: Resources
- API ID: resources

Then create a new Resource - this will be done for however you want to host your
assets, but at minimum you'll probably want one for hosting your `js`, `css`, and
`other` assets.

Here is an example for a `Get JS Resources` resource:

```js
/**
 * HTTP method: GET
 * Relative path: /css/{filename}
 * Requires autentication: false
 */
(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var filename = request.pathParams.filename;
  var thisSysId = '[sys_id of the Scripted REST Resource]';
  var sysAttGR = new GlideRecord('sys_attachment');
  sysAttGR.addQuery('table_sys_id', thisSysId);
  sysAttGR.addQuery('file_name', filename);
  sysAttGR.query();
  if (sysAttGR.next()) {
    var message = new GlideSysAttachment().getContentStream(
      sysAttGR.getUniqueValue()
    );
    response.setContentType('text/javascript');
    response.setStatus(200);
    response.getStreamWriter().writeStream(message);
  } else {
    response.setStatus(404);
    response.setBody({ message: 'The requested file cannot be found' });
  }
})(request, response);
```

Here is an example for a `Get CSS Resources` resource:

```js
/**
 * HTTP method: GET
 * Relative path: /css/{filename}
 * Requires autentication: false
 */
(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
  var filename = request.pathParams.filename;
  var thisSysId = '[sys_id of the Scripted REST Resource]';
  var sysAttGR = new GlideRecord('sys_attachment');
  sysAttGR.addQuery('table_sys_id', thisSysId);
  sysAttGR.addQuery('file_name', filename);
  sysAttGR.query();
  if (sysAttGR.next()) {
    var message = new GlideSysAttachment().getContentStream(
      sysAttGR.getUniqueValue()
    );
    response.setContentType('text/css');
    response.setStatus(200);
    response.getStreamWriter().writeStream(message);
  } else {
    response.setStatus(404);
    response.setBody({ message: 'The requested file cannot be found' });
  }
})(request, response);
```

They are very similar, but separation of concerns and with setting the `Content-Type`
for the responses separately. Note the followign:

- The `var thisSysId` is using the `sys_id` of the created REST Resource record,
  as this will help narrow down the attachments of our assets, which will each be
  uploaded to these resource records.
- The `Requires authentication` has been set to false so that we don't have to send
  a credential with the request (this is because these requests come from the browser
  itself and we are not sending a full REST request)

## Building Our App

Now for the part everyone has been waiting for. Let's build and deploy our app.
Let's go back to the directory where your React app was cloned. Stop the local
dev-server if it's running, then run `npm run build`. This will create a new directory
called `dist` that will contain all your assets. So let's see what's there:

### `index.html`

This is our entrypoint file to our application. If you open it, you'll see a single
line across, this is because webpack has minified the file, but if you "beautify"
it you should see something like this

```xml
<?xml version="1.0" encoding="utf-8" ?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:j2="null" xmlns:g2="null">
  <g:evaluate>var docType = '&lt;!doctype html&gt;';</g:evaluate>
  <g2:no_escape>$[docType]</g2:no_escape>

  <html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>React Light</title>
    <g:evaluate object="true">var session = gs.getSession(); var token = session.getSessionToken(); if (token == '' ||
      token == undefined) { token = gs.getSessionToken(); }</g:evaluate>
    <script>
      window.serviceNowUserToken = "$[token]";
    </script>
    <link rel="icon" href="/favicon.ico" />
    <link href="/api/x_305452_sandbox/resources/css/main-3b811e2b24f18052f545-css" rel="stylesheet" />
  </head>

  <body>
    <div id="root">
      <noscript>You need Javascript enabled for this application to work!</noscript>
    </div>
    <script defer="defer" src="/api/x_305452_sandbox/resources/js/runtime-df6e96cb314f0bd22492-bundle-js"></script>
    <script defer="defer" src="/api/x_305452_sandbox/resources/js/main-21d1faa8dcdde2b12148-bundle-js"></script>
  </body>
  </html>
</j:jelly>
```

There are a few things going on here. First, this is using Jelly scripting as that's
what the UI Pages expect. Second, the first `<g:evaluate>` and `<g2:no_escape>` are just
setting the `<!doctype html>` that goes at the top of our page. Third, the second
`<g:evaluate>` is getting the session token of the current user and is adding that
as a global `window` variable so it can be used within the React app (for calling our
REST API endpoints). Then you have the `<link>`s to any of our stylesheets and at the
bottom our javascript assets.

### `api` directory

This directory just follows our API endpoint naming convention that you would see
looking at the REST Resource's `Resource path` field. So nested in there would be
our `css` and `js` folders (and any others you have created for other assets).
What you may notice in the `css` and `js` folders are:

1. the filename extensions are not `.css` or `.js` because ServiceNow treats those
   in a URL differently
2. there may be more files than `<link>`s or `<script>`s. Don't worry this is
   because Webpack created chunks that will lazily load only when we hit certain
   routes -- this helps keep the initial bundle served to the enduser a bit smaller

## Deploying Our App

TODO: Using DevOps tools like GitHub Actions or GitLab CI would be nice!

This next part is manual (for now). But in order for our app to run, we need to do
the following:

1. Copy the contents from the generated `index.html` file and paste it into your
   UI Page that contains the trailing slash. Based on the configurations of
   `html-webpack-plugin` there shouldn't be any issues with the `xhtml` restrictions
2. Take _all_ the files from the `css` directory and upload them to the
   `Get CSS Resources` REST Resource record.
3. Take _all_ the files from the `js` directory and upload them to the
   `Get JS Resources` REST Resource record.

Now you should be able to go directly to your UI Page's URL and start navigating
around your app (e.g. `https://<your-instance>.service-now.com/my-react-app/`)!

## Additional Notes

- Absolute path imports are possible using aliasing. Currently `@` is an alias
  for `./src` but you can configure whatever is comfortable to you in
  `./config/webpack/webpack.common.js` and `jsconfig.json`
- The `.env.example` file in the root directory demonstrates some of the basic
  environment variables that can be used.
- The `./config` directory contains the configurations for testing and Webpack
- The `./config/servicenow-config.js` file contains configurations for ServiceNow
  variables based on the `.env` file so that you can easily change this depending
  on your instance without having to have it hard-coded throughout your app
- The application is configured to use `tailwindcss` a CSS utility-first framework.
  The decision to use it is up to you.
- The project currently uses `fetch` but you could use any form of data fetching
  you'd like, whether that be `axios`, `XMLHttpRequest`, or `GraphQL`
- The `./src/template.html` file contains the template file for you to work with
  while developing. The `webpack-dev-server` is configured to proxy your ServiceNow
  instance so you don't need to pass the full hostname with your request and
  allows you to test without deploying to your instance!
- The `./src/sn-template.html` file contains the template file for your prod instance.
  This contains the Jelly scripting that `html-webpack-plugin` will use to populate
  your built `index.html`
- The `html-webpack-plugin` used in this starter is a fork of
  [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin). The fork
  allows for the special naming convention of files for ServiceNow.
- Dev best practices can be followed with configurations for
  - [Husky](https://typicode.github.io/husky/)
  - [eslint](https://eslint.org/)
  - [jest](https://jestjs.io/)
  - [postcss](https://postcss.org/)
  - [stylelint](https://stylelint.io/)
  - [prettier](https://prettier.io/)
