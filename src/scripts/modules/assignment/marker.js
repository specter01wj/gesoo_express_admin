
Marker = function(latlng,number,map){
    this.latlng = latlng;
    this.number_ = number;
    this.map_ = map;
    this.div_ = null;
    this.setMap(map);
}


Marker.prototype = new google.maps.OverlayView();

Marker.prototype.click = function(callback){
    alert('click event');
};

Marker.prototype.onAdd = function(){
    var self = this;
    var div = document.createElement('div');
    div.className = 'map-marker';
    var html = '<span>'+this.number_ + '</span>';
    div.innerHTML = html;
    this.div_ = div;

    var panes = this.getPanes();
    panes.overlayMouseTarget.appendChild(this.div_);
    google.maps.event.addDomListener(div, 'click', function() {
            google.maps.event.trigger(self, 'click');
    });
};

Marker.prototype.draw = function(){
    var overlayProjection = this.getProjection();

    //var center = overlayProjection.fromLatLngToContainerPixel(this.latlng);
    var center = overlayProjection.fromLatLngToDivPixel(this.latlng);

    var div = this.div_;
    div.style.left = center.x - 15 + 'px';
    div.style.top = center.y + 'px';
};

Marker.prototype.onRemove = function (){
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
}

window.Marker = Marker;
module.exports = Marker;
