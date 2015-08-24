'use strict';

app.factory('EntryService', ['$resource', function($resource){
  return $resource("http://localhost:3000/api/entries/:id", {}, {
    get: {method: 'GET', cache: false, isArray: true},
    getEntry: {method: 'GET', cache: false, isArray: false},
    update: {method: 'PUT', cache: false, isArray: false},
  });
}]);

app.factory('UserService', ['$resource', function($resource){
  return $resource('http://localhost:3000/api/users', {}, {
    save: {method: 'POST', cache: false, isArray: false},
    update: {method: 'PUT', cache: false, isArray: false},
  });
}]);

app.factory('SessionService', ['$resource', function($resource){
return $resource('http://localhost:3000/api/session', {}, {
    login: {method: 'POST', cache: false, isArray: false},
    logout: {method: 'DELETE', cache: false, isArray: false}
  });
}]);

app.factory('Data', ['EntryService', 'UserService', 'localStorageService', 'Stats', function (EntryService, UserService, localStorageService, Stats) {

  var days = localStorageService.get('days');;

  function getEntries(complete) {
    EntryService.get({},
      function success(rsp){
        console.log(rsp);
        days = Stats.matchEntriesToDates(rsp);
        localStorageService.set('days', days);
        complete(days);
      },
      function error(rsp){
        console.log('Error' + JSON.stringify(rsp));
      }
    );
  };

  function lsUpdateEntry(entry){
    // assume only the last entry gets updated
    days[days.length-1].entry = entry;
    // var i = 0;
      // do {
      //   if (days[i].entry.id == entry.id){
      //     days[i].entry = entry;
      //   }
      //   i ++;
      // } while (i < days.length);
    localStorageService.set('days', days);
  }
  
  return {
    loadEntries: function(complete){
      if(days) {
        complete(days);
      } else {
        getEntries(complete);
      }
    },
    loadUser: function(){
      return localStorageService.get('user');;
    },
    clear: function(){
      localStorageService.clearAll();
      days = null;
    },
    setUser: function(user){
      localStorageService.set('user', user);
    },
    getEntry: EntryService.getEntry,
    saveEntry: function(entry){
      EntryService.update({id: entry.id}, {entry: entry},
        function success(rsp){
          lsUpdateEntry(rsp);
        },
        function error(rsp){
          console.log('Error' + JSON.stringify(rsp) );
      });
    },
    updateUser: function(user){
      // localStorageService.set('user', user);
    }
  };

}]);