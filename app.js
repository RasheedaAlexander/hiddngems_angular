var app =
angular
.module('myApp', []);

app.service('Map', function($q) {
  var options = {
    center: new google.maps.LatLng(38.9072,-77.0369),
    zoom: 13,
    disableDefaultUI: true
  }
    this.init = function() {
        this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
        this.map.set('styles', [
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
              { color: '#000000' },
              { weight: 1.6 }
            ]
          }, {
            featureType: 'road',
            elementType: 'labels',
            stylers: [
              { saturation: -100 },
              { invert_lightness: true }
            ]
          }, {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [
              { hue: '#ffff00' },
              { gamma: 1.4 },
              { saturation: 82 },
              { lightness: 96 }
            ]
          }, {
            featureType: 'poi.school',
            elementType: 'geometry',
            stylers: [
              { hue: '#fff700' },
              { lightness: -15 },
              { saturation: 99 }
            ]
          }
        ]);
        this.places = new google.maps.places.PlacesService(this.map);
    }

    this.search = function(str) {
        var d = $q.defer();
        //I know this looks weird... here we are using a deffered because there are
        //asynchonous functions (i.e. textSearch) that are call-back based and not
        //dependent on explicit promises. This way we can resolve or reject promises
        //based on the request status.
        //Laymen's terms: we defferring the search results until we know that the
        //request status returns OK for the main query string of this function... i think
        this.places.textSearch({query: str}, function(results, status) {
            if (status == 'OK') {
                d.resolve(results[0]);
            }
            else d.reject(status);
        });
        return d.promise;
    }
    infowindow = new google.maps.InfoWindow()
    // console.log(options);
    // this.map = new google.maps.Map(document.getElementById('map'), options);
    this.addMarker = function(res) {
      var self = this
        var image = 'map icon small.png'
        this.marker = new google.maps.Marker({
            map: self.map,
            position: res.geometry.location,
            animation: google.maps.Animation.DROP,
            icon: image,
            title: res.name
        });
        // var picture: res.photos
        // this.marker.content = '<div> pizza </div>'
        google.maps.event.addListener(self.marker, 'click', function(){
          // console.log(self.map);
          // console.log("string");
          // var infowindow = "pizzza"
          // console.log(infowindow)
          // console.log(bob);
          // console.log(self.marker);
          infowindow.setContent('<h5>'+ self.marker.title +'<h5>');
          infowindow.open(self.map, self.marker);
          // console.log(picture);
        });
        this.map.setCenter(res.geometry.location);
    }
});

app.controller('newPlaceCtrl', function($scope, Map) {

    $scope.place = {};

    $scope.search = function() {
        $scope.apiError = false;
        Map.search($scope.searchPlace)
        .then(
            function(res) { // success
              //*********ADD TO FIREBASE DATA*********************
                Map.addMarker(res);
                $scope.place.name = res.name;
                $scope.place.address = res.formatted_address;
                $scope.place.lat = res.geometry.location.lat();
                $scope.place.lng = res.geometry.location.lng();
                console.log(res);
            },
            function(status) { // error
                $scope.apiError = true;
                $scope.apiStatus = status;
            }
        );
    }

    $scope.send = function() {
        alert($scope.place.name + ' : ' + $scope.place.lat + ', ' + $scope.place.lng);
    }

    Map.init();
});
