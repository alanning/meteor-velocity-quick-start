meteor-velocity-quick-start
===========================

Quick start package that will add a few velocity-compatible test frameworks to your app.


### Test frameworks

These are the test frameworks that are included with this quick-start.  Typically it is easiest to start with tests that run in-context like `mocha-web-velocity` or `jasmine` since they do not require any stubbing.  Once ready, have a look at writing unit tests using `jasmine-unit` for even speedier execution.

* [`mocha-web-velocity`](https://github.com/mad-eye/meteor-mocha-web/tree/velocity) - The mocha-web-velocity package runs in the Meteor context and can do both client and server. There are two simple tests that are automatically added, one is client side and one is server side.

* [`jasmine`](https://github.com/Sanjo/meteor-jasmine) - The jasmine package runs in the Meteor context and supports running integrated client-side tests using the Jasmine syntax.  Server-side in-context testing coming soon.

* [`jasmine-unit`](https://github.com/xolvio/jasmine-unit) - The jasmine-unit package runs tests independent of the Meteor context or client/server.  Unit testing like this is fast but can be a bit more challenging to set up since any external dependencies will need to be stubbed.  There is an auto-stubber that attempts to do some of the work for you; please consider contributing any package stubs you write back to the  [meteor-package-stubber](https://github.com/alanning/meteor-package-stubber/tree/master/package-stubber/community-stubs) project.


### Getting started

1. Install [nodejs](http://nodejs.org/)
2. Install [meteor](https://www.meteor.com/)

    ```bash
    $ curl https://install.meteor.com/ | sh
    ```

3. Install [meteorite](https://github.com/oortcloud/meteorite/)

    ```bash
    $ sudo -H npm install -g meteorite
    ```


4. Create an app and add the quick-start

    ```js
    $ cd ~/tmp
    $ meteor create --example leaderboard
    $ cd leaderboard
    $ mrt add velocity-quick-start
    $ meteor
    ```
    
    This will add the appropriate test frameworks, the html-reporter package, and copy sample tests into the `tests` directory.

    If you would like to see debug output for all the test frameworks, run this command instead:
    ```
    $ DEBUG=1 JASMINE_DEBUG=1 VELOCITY_DEBUG=1 meteor
    ```
    
5. Check out the stubs and tests in the `tests` directory and add your own!
   



### How to add a new test framework to this quick-start

Got a velocity-compatible test framework?  Add it to this quick-start and send a pull request!

Steps required to add a new test framework to velocity-quick-start:

1. add to quick-start/smart.json
2. add to quick-start/package.js
3. add to quick-start/main.js
