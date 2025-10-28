import { injectable } from "tsyringe"
import { GoogleMapsServices } from './../services/google.maps.services';

@injectable()
export class GoogleMaps{
    
    constructor(
        private googleMapsServices: GoogleMapsServices
    ){
        this.presentMaps();
        this.eventPresentMaps()
    }

    private setData(data: any = {}): void{
        this.googleMapsServices.elem = data.element
        this.googleMapsServices.address = data.address
    }

    private presentMaps(){
        const elem = document.querySelector('.display-maps');
        if(elem){
            this.setData((elem as HTMLDivElement).dataset);
            this.googleMapsServices.maps();
        }
    }

    private eventPresentMaps(){
        const elems: any = document.querySelectorAll('.display-maps');
        for(const elem of elems){
            elem.addEventListener('click', (event: any) => {
                this.setData((event.target as HTMLButtonElement).dataset)
                this.googleMapsServices.eventMaps();
            })
        }
    }
}