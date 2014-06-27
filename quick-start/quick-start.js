QuickStart = function () {}

"use strict";

var pwd = process.env.PWD,
    DEBUG = process.env.DEBUG,
    fs = Npm.require('fs'),
    path = Npm.require('path'),
    _ = Npm.require('lodash'),
    rimraf = Npm.require('rimraf');


_.extend(QuickStart.prototype, {

  exec: function (testPackages) {
    DEBUG && console.log("[velocity-quick-start] executed");

    this.addPackages(testPackages);

    this.copySampleTests(testPackages);

    // add in the html-reporter so it looks good
    this.addPackages(['velocity-html-reporter']);

    // remove self so example tests aren't added back once user removes them
    // Note: this causes an error on the console:
    //   "error: no such package: 'velocity-quick-start'"
    // but then the app is restarted so it actually works but just looks bad.
    //this.removePackage('velocity-quick-start');
  },  // end exec


  addPackages: function (testPackages) {
    var i = testPackages.length - 1,
        package,
        packagesToAdd = [],
        meteorPackagesFile,
        smartJson;

    meteorPackagesFile = (this.readMeteorPackagesFile() || '').trim();
    smartJson = this.readSmartJson();

    for (; package = testPackages[i]; i--) {
      try {

        DEBUG && console.log("[velocity-quick-start] adding package '" + 
                             package + "'");

        smartJson.packages[package] = {};
        if (!this.fileContains(meteorPackagesFile, package)) {
          meteorPackagesFile = meteorPackagesFile.split('\n');
          meteorPackagesFile.push(package);
          meteorPackagesFile = meteorPackagesFile.join('\n');
        }

      } catch (ex) {
        console.log("[velocity-quick-start] could not add package for " +
                    "test framework: '" + package + "'.  Reason:", 
                    ex.message);
      }
    }

    // update the .meteor/packages file
    this.writeMeteorPackagesFile(meteorPackagesFile);

    // update the smart.json file
    this.writeSmartJson(smartJson);

  },  // end addPackages


  fileContains: function (contents, target) {
    var lines,
        regex,
        i;

    if (!contents) return false;

    regex = new RegExp('^' + target + '$', 'i');
    lines = contents.split('\n');
    i = lines.length - 1;

    for (; line = lines[i]; i--) {
      if (regex.test(line)) {
        return true
      }
    }

    return false;
  },  // fileContains


  copySampleTests: function (testPackages) {
    var i = testPackages.length - 1,
        package;

    for (; package = testPackages[i]; i--) {
      try {

        Meteor.call('copySampleTests', {framework: package});

        DEBUG && console.log("[velocity-quick-start] copied sample tests for " +
                             "framework: '", package, "'.");

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
      return {};
    }
  },  // end readSmartJson


  readMeteorPackagesFile: function () {
    try {
      return fs.readFileSync(path.join(pwd, '.meteor/packages')).toString();
      
    } catch (err) {
      console.log("[velocity-quick-start] Error reading app's " +
                  ".meteor/packages file:", err);
      return '';
    }
  },  // end readMeteorPackagesFile


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


  writeMeteorPackagesFile: function (contents) {
    var filePath;

    if (!contents) return;

    filePath = path.join(pwd, '.meteor/packages');

    // Write to disk
    if (fs.existsSync(filePath))
      fs.writeFileSync(filePath, contents);
  },  // end writeMeteorPackagesFile 


  execShellCommand: function (command) {
    var exec = Npm.require('rolling_timeout_exec').exec,
        command,
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
