QuickStart = function () {}

"use strict";

var pwd = process.env.PWD,
    DEBUG = process.env.DEBUG,
    fs = Npm.require('fs'),
    path = Npm.require('path'),
    rimraf = Npm.require('rimraf'),
    exec = Npm.require('rolling_timeout_exec').exec;


_.extend(QuickStart.prototype, {

  exec: function (testPackages) {
    DEBUG && console.log("[velocity-quick-start] executed");

    this.copySampleTests(testPackages);

    this.addPackages(testPackages, 'velocity-html-reporter');

    // remove self so example tests aren't added back once user removes them
    // Note: this causes an error on the console:
    //   "error: no such package: 'velocity-quick-start'"
    // but then the app is restarted so it actually works but just looks bad.
    //this.removePackage('velocity-quick-start');
  },  // end exec


  addPackages: function (/* arguments */) {
    var requestedPackagesToAdd,
        packagesToAdd = [],
        smartJson;

    requestedPackagesToAdd = _.flatten(Array.prototype.slice.call(arguments));
    smartJson = this.readSmartJson();

    if (!smartJson || !smartJson.packages) {
        throw new Error("[velocity-quick-start] smart.json file missing " +
                        "required field 'packages'.  Exiting without adding " +
                        "packages.");
        return;
    }

    packageMap = this.slurpPackages();

    _.each(requestedPackagesToAdd, function (package) {
      if (!packageMap[package]) {
        DEBUG && console.log("[velocity-quick-start] adding package '" + 
                             package + "' to .meteor/packages");
        smartJson.packages[package] = {};
        packagesToAdd.push(package);
      }
    });

    this.updateMeteorPackagesFile(packagesToAdd);

    // update the smart.json file
    this.writeSmartJson(smartJson);

  },  // end addPackages


  /**
   * Read's this app's '.meteor/packages' file and parses out all
   * the packages.  Returns a hashmap where each package is a key.
   *
   * @method slurpPackages
   * @return {Object} key/value pairs; key = package name, value = true
   */
  slurpPackages: function () {
    var contents,
        packageMap = {};

    try {
      contents = (this.readMeteorPackagesFile() || '').trim();
    } catch (err) {
      console.log("[velocity-quick-start] Error reading",
                  path.join(pwd, '.meteor/packages'), err);
      throw err;
    }

    if (!contents) {
      throw new Error("[velocity-quick-start] Invalid state.  The '", 
                      path.join(pwd, '.meteor/packages'), "file is empty. " +
                      "This is should not be possible for Meteor apps and " +
                      "indicates a problem of some kind.");
    }

    _.each(contents.split('\n'), function (line) {
      if (!line || !line.trim()) return;

      line = line.trim();

      // skip comments
      if (line[0] === '#') return;

      packageMap[line] = true;
    });

    return packageMap;
  },  // end slurpPackages


  copySampleTests: function (testPackages) {
    var i = testPackages.length - 1,
        package;

    for (; package = testPackages[i]; i--) {
      try {
        Meteor.call('copySampleTests', {framework: package});
      } catch (ex) {
        console.log("[velocity-quick-start] could not generate sample tests " +
                    "for test framework: '" + package +
                    "'.  Reason:", ex.message);
      }
    }
  },  // end copySampleTests


  removePackage: function (packageName) {
    var packagePath = path.join(pwd, 'packages', packageName),
        statInfo,
        smartJson;

    DEBUG && console.log("[velocity-quick-start] removing package '" + 
                packageName + "'");

    // remove from .meteor/packages
    this.execShellCommand('mrt remove ' + packageName);
    
    // remove from 'packages' directory
    statInfo = fs.lstatSync(packagePath);
    if (statInfo.isSymbolicLink()) {
      // remove link
      fs.unlinkSync(packagePath);
    } else if (statInfo.isDirectory()) {
      rimraf.sync(packagePath);
    } else {
      console.log("[velocity-quick-start] Error removing package '" + 
                  packageName + "'. Expected '" + packagePath + "' to " + 
                  "reference a directory or sym-link but it does not.");
      return;
    }

    // remove from smart.json
    smartJson = this.readSmartJson();
    if (smartJson) {
      delete smartJson.packages[packageName];
      this.writeSmartJson(smartJson);
    }
  },  // end removePackage


  readSmartJson: function () {
    try {
      var rawConfig = fs.readFileSync(path.join(pwd, 'smart.json')).toString();
      return JSON.parse(rawConfig);
      
    } catch (err) {
      console.log("[velocity-quick-start] Error reading app's " +
                  "smart.json file:", err);
      throw err;
    }
  },  // end readSmartJson


  readMeteorPackagesFile: function (filepath) {
    filepath = filepath || path.join(pwd, '.meteor/packages');
    return fs.readFileSync(filepath).toString();
  },


  writeSmartJson: function (json) {
    var smartJsonString,
        smartJsonPath;

    if (!json) return;

    // Make a nicely formated default json string
    smartJsonString = JSON.stringify(json, null, 2) + "\n";
    
    smartJsonPath = path.join(pwd, 'smart.json');

    // Write to disk
    if (fs.existsSync(smartJsonPath))
      fs.writeFileSync(smartJsonPath, smartJsonString);
  },  // end writeSmartJson


  /**
   * Append new package names to the .meteor/packages file.
   * If .meteor/packages does not exist, create it.
   *
   * @method updateMeteorPackagesFile
   * @param {Array|String} newPackages List of package names to append
   */
  updateMeteorPackagesFile: function (newPackages) {
    var filePath;

    if ('string' === typeof newPackages) {
      newPackages = newPackages.trim();
    } else if (_.isArray(newPackages)) {
      newPackages = newPackages.join('\n').trim();
    } else {
      return;
    }

    // bail if empty
    if (!newPackages) return;

    filePath = path.join(pwd, '.meteor/packages');

    if (fs.existsSync(filePath)) {
      fs.appendFileSync(filePath, '\n' + newPackages);
    } else {
      fs.writeFileSync(filePath, newPackages);
    }
  },  // end updateMeteorPackagesFile


  execShellCommand: function (command) {
    var command,
        options,
        child,
        timeout = false;

    options = { rollingTimeout: 5000 };

    // execute child process
    child = exec(command, options, function (err, stdout, stderr) {
      if (err) {
        if (timeout) {
          console.error(command, 'timed out');
        }
        console.error(err.message, err.code);
        console.error(stdout);
        console.error(stderr);
      } else {
        DEBUG && console.log(command, 'successful!');
        DEBUG && console.log(stdout);
      }
    });

    child.on('rolling-timeout', function () {
      timeout = true;
    });
  }  // end execShellCommand 

});  // end _.extend(QuickStart.prototype, {...})
