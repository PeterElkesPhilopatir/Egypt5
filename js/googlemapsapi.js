var map;
var  infoWindow;
var markers=[];
var contentString;
var places = [
  {
    name: 'Cairo',
    address: ' Cairo Governorate, Egypt',
    lat:  30.049677,
    lng:  31.236148,
    desc: 'Cairo, Egypt’s sprawling capital, is set on the Nile River. At its heart is Tahrir Square and the vast Egyptian Museum, a trove of antiquities including royal mummies and gilded King Tutankhamun artifacts. Nearby, Giza is the site of the iconic pyramids and Great Sphinx, dating to the 26th century BC. In Gezira Island’s leafy Zamalek district, 187m Cairo Tower affords panoramic city views.'
  },
  {
    name:'Dubai,UAE', 
    address: 'Dubai United Arab Emirates',
    lat:  25.276987,
    lng: 55.296249,
    desc: 'Dubai is a city and emirate in the United Arab Emirates known for luxury shopping, ultramodern architecture and a lively nightlife scene. Burj Khalifa, an 830m-tall tower, dominates the skyscraper-filled skyline. At its foot lies Dubai Fountain, with jets and lights choreographed to music. On artificial islands just offshore is Atlantis, The Palm, a resort with water and marine-animal parks.'
  },
  {
    name:  'Petra, Jordon',
    address: 'Jordon',
    lat: 30.328593,
    lng: 35.444319,
    desc: 'Iconic 2000-year-old city, including 45m-high Al Khazneh, carved into the red mountain rock.',
  },
  {
    name: 'Beirut, Lebanon',
    address: 'Lebanon',
    lat: 33.895483,
    lng: 35.500849,
    desc: "Beirut is the capital and largest city of Lebanon. No recent population census has been done but in 2007 estimates ranged from slightly more than 1 million to slightly less than 2 million as part of Greater Beirut."
  },
  {
    name: 'Rabat',
    address: 'Rabat capital Of Morocco',
    lat: 31.629925,
    lng: -7.980046,
    desc: "Rabat, Morocco's capital, rests along the shores of the Bouregreg River and the Atlantic Ocean. It's known for landmarks that speak to its Islamic and French-colonial heritage, including the Kasbah of the Udayas. This Berber-era royal fort is surrounded by formal French-designed gardens and overlooks the ocean. The city's iconic Hassan Tower, a 12th-century minaret, soars above the ruins of a mosque."
  }
  ];
var model = function(place){
  var self = this;
  this.name = place.name;
  this.lat = place.lat;
  this.lng = place.lng;
  this.address = place.address;
  this.desc = place.desc;

};

function ViewModel(){

 self.searchKey = ko.observable('');
 self.placesList = ko.observableArray([]);

 for (var i =0 ; i<places.length ; i++) {

   self.placesList.push(new model(places[i]));
 }
 map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 29.976480, lng:  31.131302},
  zoom: 4
  });
 
 infoWindow = new google.maps.InfoWindow();
 initMarkers();


 self.filteredRecored = ko.computed( function() {
  var filter = self.searchKey().toLowerCase();

   if (!filter) { // if search box is empty show all markers 

    markers.forEach(function(rec){
      rec.setMap(map);

    });

    return self.placesList(); // placesList will bind to html 
  }
  else // search box is not empty
  {
    var counter = 0 ;
    return ko.utils.arrayFilter(self.placesList(), function(rec) { //  filter placesList  and return filteredRecored
     var filter = self.searchKey().toLowerCase();


     var string = rec.name.toLowerCase();

     var result = (string.search(filter) >= 0);
     marker = markers[counter];
     if (result === true){
      marker.setMap(map); // show only the filered marker
    }else{
      marker.setMap(null); // hide all marker
    }
    counter = counter + 1;

    return result;
    
  });

  }

}, self);
}

// init markers for all 5 locations
function initMarkers(){

  var marker;

  for (var i = 0; i < places.length; i++) {
    var position = {lat: places[i].lat, lng: places[i].lng};
    var title = places[i].name;
    var address = places[i].address;
    marker= new google.maps.Marker({
      position: position,
      map: map,
      title: title,
      address: address, 
      animation: google.maps.Animation.DROP,
      id: i,
    });

    onClickMarker(marker);
    markers.push(marker);

  }

}

function onClickMarker(marker){


  marker.addListener('click', function() {
    showInfo(marker);

  });

}

function showInfo(marker){

  // third party api getty image
  var url = "https://api.gettyimages.com/v3/search/images?fields=id,title,thumb,referral_destinations&sort_order=best&phrase="+marker.title;
  
  $.ajax({
    type: 'GET',
    url: url,
    processData: false,
    headers: {
      'Api-Key':'u2g34rp4qj8ym8vxqt433zeh',

    },
    
    success: function(result) {
     setTimeout(function() {
      marker.setAnimation(null);
    }, 2500);
     if (result) {
      var image =result.images[1].display_sizes[0].uri;
      contentString= '<div id="content">'+
      '<h1 id="firstHeading" class="firstHeading">'+marker.title+'</h1>'+
      '<h3 id="firstHeading" class="firstHeading">'+marker.address+'</h3>'+
      '<div id="bodyContent">'+
      '<p>'+places[marker.id].desc+'</p>'+
      '<img src='+image+" style = width:100%;>"+
      '</div>'+
      '</div>';
      infoWindow.setContent(contentString);
      marker.setAnimation(google.maps.Animation.BOUNCE);


      infoWindow.open(map,marker);

    } 
    else
    {
      contentString = '<div id="content">'+
      '<h1 id="firstHeading" class="firstHea  ding">'+marker.title+'</h1>'+
      '<h3 id="firstHeading" class="firstHeading">'+marker.address+'</h3>'+
      '<div id="bodyContent">'+
      '<p>'+places[marker.id].desc+'</p>'+
      '<p> faile to load the image</p>'+
      '</div>'+
      '</div>';

      infoWindow.setContent(contentString);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      infoWindow.open(map,marker);
    }

  },
  error: function(XMLHttpRequest, textStatus, errorThrown) { 
    errorHandlingNetwork();
  }       
});


}


function errorHandlingNetwork() {
  alert("Check your connection");
}

function initMap(){

 ko.applyBindings(new ViewModel()); 
}


// show marker when click on specific name
function onClickList(name)
{
  var marker;
  for (i = 0; i < markers.length; i++) {
    if (markers[i].title == name){
      marker= markers[i];
    }
  }
  showInfo(marker);
}

