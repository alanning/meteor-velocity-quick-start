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
    $ meteor
    ```
    
    This will add the appropriate test frameworks, the html-reporter package, and copy sample tests into the `tests` directory.

    If you would like to see debug output for all the test frameworks, run this command instead:
    ```
    $ DEBUG=1 JASMINE_DEBUG=1 VELOCITY_DEBUG=1 meteor
    ```
    
5. Check out the stubs and tests in the `tests` directory and add your own!
   



## How to add a new test framework to this quick-start

Got a velocity-compatible test framework?  Add it to this quick-start and send a pull request!

Steps required to add a new test framework to velocity-quick-start:

1. add to quick-start/smart.json
2. add to quick-start/package.js
3. add to quick-start/main.js
