exports.config = {
  capabilities: {
    'browserName': 'chrome'
  },
  specs: [
    'src/pages/login/login_in.spec.js',
  ],
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    isVerbose: true
  },
  allScriptsTimeout: 20000,
  onPrepare: function(){
    browser.driver.get('http://localhost:8100');
  }
};
