Package.describe({
  summary: "Quick start package that will add a few velocity-compatible test frameworks to your app"
});

Npm.depends({
    'rimraf': '2.2.8',
    'rolling_timeout_exec': '0.0.1'
});

Package.on_use(function (api) {

  api.use([
    'underscore',
    'jasmine-unit',
    'mocha-web-velocity',
    'velocity-html-reporter'
  ]);
    
  api.add_files(['quick-start.js', 'main.js'], 'server');

});

