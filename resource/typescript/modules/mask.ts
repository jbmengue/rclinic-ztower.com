import { injectable } from 'tsyringe';
import VMasker from 'vanilla-masker';

@injectable()
export class Mask{
    
    constructor(){
        this.phoneMask();
    }

    private inputHandler(masks: any, max: any, event: any) {
        var c = event.target;
        var v = c.value.replace(/\D/g, '');
        var m = c.value.length > max ? 1 : 0;
        VMasker(c).unMask();
        VMasker(c).maskPattern(masks[m]);
        c.value = VMasker.toPattern(v, masks[m]);
    }

    private phoneMask() {
        var telMask = ['(99) 9999-9999', '(99) 99999-9999'];
        var tel = document.querySelector('.mask-phone') as Element;
        VMasker(tel).maskPattern(telMask[0]);
        tel.addEventListener('input', this.inputHandler.bind(undefined, telMask, 14), false);
    }
}