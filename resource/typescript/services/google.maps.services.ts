import { injectable } from "tsyringe"

//declare const google: any

@injectable()
export class GoogleMapsServices {

    private _elem: string;
    private _address: string;

    set elem(val: string) {
        if (!val) {
            throw new Error(`No elements were passed`);
        }
        this._elem = val
    }

    set address(val: string) {
        if (!val) {
            throw new Error(`No address were passed`);
        }
        this._address = val
    }

    constructor() {
        this._elem = '';
        this._address = '';
     }

    eventMaps(){
        const self = this;
        setTimeout(() => {
            self.maps();
        }, 50);
    }
    
    maps() {
        let geocoder, map: any;
        geocoder = new google.maps.Geocoder();
        const latlng = new google.maps.LatLng(-34.397, 150.644);
        const mapOptions = {
            zoom: 15,
            center: latlng
        };
        map = new google.maps.Map((document.getElementById(this._elem) as HTMLElement), mapOptions);

        geocoder.geocode({ 'address': this._address }, function (results: any, status: any) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
                
            }
        });

        map = new google.maps.Map((document.getElementById(this._elem) as HTMLElement), mapOptions);
        var contentString = '';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
    }
}