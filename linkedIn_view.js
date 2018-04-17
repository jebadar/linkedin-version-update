const ipcRenderer = require('electron').ipcRenderer;


(function(history){
  ipcRenderer.on('updateReady', function() {
    var container = document.getElementById('ready');
    container.innerHTML = "new version ready!";
  });
  var pushState = history.pushState;
  history.pushState = function(state) {
    if (typeof history.onpushstate == "function") {
      history.onpushstate({state: state});
    }
    // ... whatever else you want to do
    // maybe call onhashchange e.handler
    return pushState.apply(history, arguments);
  }
})(window.history);
history.onpushstate = function(event) {
  // alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
  if(event.state.path.indexOf('search/results') !== -1) {

    // document.addEventListener('DOMContentLoaded', event => {

      // select the target node
      var target = document.querySelector('div.search-results.top-page.ember-view');

// create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        console.log(mutation)
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          // element added to DOM
          var hasClass = [].some.call(mutation.addedNodes, function(el) {
            if(el.classList)
              return el.classList.contains('top-page')
          });
          if (hasClass) {
            if(document.getElementById('version') === null) {

              ipcRenderer.send('getVersion');

          }
          }
        }
      });
    });

// configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true,subtree:true }

// pass in the target node, as well as the observer options
//   observer.observe(target, config);
    observer.observe(document.body, {childList: true,subtree:true});

  //
  // });
  }
};
ipcRenderer.on('currentVersion',function(event,version){
  if(document.getElementById('version') === null) {
    var div = document.querySelector('div.search-results-container');
    var empty = document.createElement('div');
    empty.innerHTML = ` <div class="ember-view">Current Version : <button id="version">${version}</button>
                <!-- the button onClick sends a quitAndInstall message to the electron main process -->
                <button class="button-primary-small launchpad-add-full-profile-info__start-date-save" id="ready">no updates ready</button>
                </div>`;
    var tempDiv = div.firstChild;
    div.insertBefore(empty, tempDiv);
    document.getElementById('ready').addEventListener('click', function (ev) {
      ipcRenderer.send('quitAndInstall');
    })
  }
});
// later, you can stop observing
// observer.disconnect();