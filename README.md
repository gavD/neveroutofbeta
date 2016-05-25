Never Out Of Beta website
==

Where does this live?
--

http://neveroutofbetapodcast.com/

Credits
--

* Graphic design by [Karolo](https://karolo.com/)
* Implementation by [Zodono](http://zodono.co/)

Development
--

Prerequisites

* NPM
* Grunt
* Gulp (for deployment only)

Installation
--

```bash
npm install
```

Compiling the site
--

`Gruntfile.js` does all the heavy lifting for you.

```bash
grunt watch
```

Deployment
--

You will need the deployment keys for `machine-user-deploy-noob` to do this, then run:

```bash
gulp deploy
```
