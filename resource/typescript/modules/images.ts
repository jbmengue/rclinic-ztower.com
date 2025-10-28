import { injectable } from 'tsyringe'

declare const Modernizr: any;

@injectable()
export class Images{

    constructor(){
        this.loadImages();
    }

    private checkModernizr(){
        if(typeof Modernizr !== 'object'){
            throw new Error(`Modernirz was not loaded`); 
        }
    }
    private loadImages(){
        this.checkModernizr();
        const elemImages: NodeListOf<Element> = document.querySelectorAll('.load-image');
        if(elemImages){
            for(const elemImage of elemImages as any){
                let { src, bg, webp, class: attrclass } = (elemImage as HTMLElement).dataset
                attrclass = (attrclass === undefined) ? '' : attrclass;
                console.log(attrclass);
                Modernizr.on('webp', (result: any) => {
                    if (result) {
                        if(!bg){
                            elemImage.appendChild(this.createElementImage(src, webp, attrclass))
                        }else{
                            this.createBackgroundImage((elemImage as HTMLElement), bg, webp)
                        }
                    }else{
                        if(!bg){
                            elemImage.appendChild(this.createElementImage(src, '', attrclass))
                        }else{
                            this.createBackgroundImage((elemImage as HTMLElement), bg, '')
                        }
                    }
                })
            }
        }
    }

    private createElementImage(src: string = '', webp: string = '', attrClass: any = '' ): HTMLImageElement{
        let _src = (webp) ? webp : src
        const newImage = document.createElement('img')
        newImage.src = _src
        newImage.setAttribute('class', `img-fluid ${attrClass}`);
        return newImage
    }

    private createBackgroundImage(elem: HTMLElement, src: string = '', webp: string = ''): void{
        let _src = (webp) ? webp : src
        elem.style.backgroundImage = `url(\'${_src}\')`
    }

}