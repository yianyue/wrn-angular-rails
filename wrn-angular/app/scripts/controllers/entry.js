
'use strict';

/**
 * @ngdoc function
 * @name wrnApp.controller:EntryCtrl
 * @description
 * # EntryCtrl
 * Controller of the wrnApp
 */

// TODO: figure out why document.element.requestFullscreen etc. didn't work
// array ensures angular can still find the dependencies after minification
app.controller('EntryCtrl', ['$routeParams', '$location','$scope', 'Data', 'Fullscreen', 
  function($routeParams, $location, $scope, Data, Fullscreen) {

    var ctrl = this;

    ctrl.countWords = function() {
      // replace all html tags with space
      var words = ctrl.currentEntry.content.replace(/<.*?>/g, ' ');
      // match all non-whitespace
      return words.match(/\S+/g) ? words.match(/\S+/g).length : 0;
    };

    ctrl.updateEntry = function(){
      ctrl.currentEntry.word_count = ctrl.countWords();
      ctrl.progress = ctrl.currentEntry.word_count/ctrl.currentEntry.goal* 100;
      Data.saveEntry(ctrl.currentEntry);
    };

    ctrl.toggleFullscreen = function(){
      if (Fullscreen.isEnabled()){
        Fullscreen.cancel();
      } else {
        Fullscreen.all();
      }
      ctrl.editor.quill.setSelection(ctrl.editor.length, ctrl.editor.length);
    };

    $scope.$on('editorCreated', function (event, args) {
      ctrl.editor = args.editor;
      // enable edit only if entry date is today
      // TODO: check if user can game this by changing their computer's date
      var today = new Date();
      Data.getEntry({id: $routeParams.id},
        function success(rsp){
          ctrl.currentEntry = rsp;
          ctrl.progress = ctrl.currentEntry.word_count/ctrl.currentEntry.goal* 100;
          var entryDate = new Date(ctrl.currentEntry.created_at);
          if (entryDate.setHours(0,0,0,0) == today.setHours(0,0,0,0)){
            ctrl.editor.enable();
          }
          // focus the editor and go to the end of the text
          ctrl.editor.quill.setSelection(ctrl.editor.length, ctrl.editor.length);
        },
        function error(rsp){
          console.log('Error' + JSON.stringify(rsp) );
        }
      );      
    });
}]);