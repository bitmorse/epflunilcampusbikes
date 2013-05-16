App = Ember.Application.create();


/** MODELS **/ 
App.Station = Ember.Object.extend({
  id: null,
  name: null,
  normalbikes: null,
  specialbikes: null,
  bikeholders: null,
  maps: null
});

/** ROUTES **/
App.IndexRoute = Ember.Route.extend({
  enter: function() {
    App.StationsController.getStations();
  }
});

/** CONTROLLERS **/ 
App.StationsController = Ember.ArrayController.create({
      sortProperties: ['normalbikes'],
      sortAscending: false,
      isSearching: false,

      getStations: function() {
        var self = this;

        this.set('isSearching', true);
        this.set('content', []);

        var c = $.getJSON('http://customers2011.ssmservice.ch/publibike/getterminals_v2.php', {'devicetype': 'iphone', 'searchtext': '', 'lang':'fr', 'callback':'?'});
        
        c.success(function(data) {
          self.set('content', self.dataToStations(data.terminals));
          console.log(data.terminals);
        });

        c.complete(function() {
          self.set('isSearching', false);
        });
      },

      dataToStations: function(entries) {
        var results = [];

        var studentterminals = ['40110137', '40110132', '40110136', '40110135', '40110134', '40110131', '40110139', '40110133', '40110138', '40110101', '40110102', '40100144', '40110142'];

        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
            
          //if its not a student accessible terminal, dont display it
          if($.inArray(e.terminalid, studentterminals) === -1){ continue; }

          for (var j=0; j < e.bikes.length; j++){
            var f = e.bikes[j];

            //normalbike
            if(f.type == 1){
              var normalbikes = f.available;
            }

            //special bike, ie ebike
            if(f.type == 2){
              var specialbikes = f.available;
            }         
          }

          results.push(App.Station.create({
            id: e.terminalid,
            name: e.name,
            normalbikes: normalbikes,
            specialbikes: specialbikes,
            bikeholders: e.bikeholders,
            maps: 'https://maps.google.com/maps?q='+e.lat+','+e.lng+'&z=18'
          }));
        }

        return results;
      }
  });


/** VIEWS **/ 

/** ROUTER **/
