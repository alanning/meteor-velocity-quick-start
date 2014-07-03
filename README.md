meteor-velocity-quick-start
===========================

Quick start package that will add a few velocity-compatible test frameworks to your app.


## Getting started

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
    $ mrt
    ```
    
    This will add the appropriate test frameworks, the html-reporter package, and copy sample tests into the `tests` directory.
    
    ```js
    ... with app running ...
    CRTL-C (to stop app)
    $ mrt
    ```
    
    The second time you run it the tests will be executed and you can see the results in the console and the html-reporter overlay.  (Yeah, I know its not ideal that you have to run the app twice to get them to show.  We'll work on that!)


## How to add a new test framework to this quick-start

Got a velocity-compatible test framework?  Add it to this quick-start and send a pull request!

Steps required to add a new test framework to velocity-quick-start:

1. add to quick-start/smart.json
2. add to quick-start/package.js
3. add to quick-start/main.js
