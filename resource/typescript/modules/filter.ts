import { injectable } from 'tsyringe'

@injectable()
export class Filter{

    private elements: any = null;
    private selectors: any = null;

    constructor(){
        this.eventClick();
    }

    private setElements = () => {
        this.elements = document.querySelectorAll('[data-filter-item]')
    }

    private setSelectors = () => {
        this.selectors = document.querySelectorAll('[data-filter]')
    }

    private filter = (value: string = ''): void => {
        this.setElements();
        this.setActive(value);
        for(const element of this.elements){
            let filter = element.getAttribute('data-filter-item')
            if (filter.toLowerCase().indexOf(value) > -1) {
                (element as HTMLElement).classList.remove('fadeOutDown')
                element.classList.add('fadeInUp')
            } else {
                (element as HTMLElement).classList.remove('fadeInUp')
                element.classList.add('fadeOutDown')
            }
        }
    }

    private setActive = (value: string = ''): void => {
        for(const element of this.selectors){
            (element as HTMLElement).classList.remove('active')
        }
        const elementActive = <HTMLElement>document.querySelector('[data-filter="' + value + '"]')
        elementActive.classList.add('active')
    }

    private eventClick(){
        this.setSelectors()
        if(this.selectors){
            for(const element of this.selectors){
                (element as HTMLLinkElement).addEventListener('click', (event) => {
                    const clickedElement = (event.target as HTMLLinkElement);
                    this.filter(clickedElement.getAttribute('data-filter') ?? '');
                }, false)
            }
        }
    }
}