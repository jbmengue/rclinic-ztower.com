import "reflect-metadata";
import { container } from "tsyringe";
import { GoogleMaps } from './modules/google.maps';
import { Filter } from './modules/filter'
import { Images } from './modules/images';
import { Mask } from './modules/mask';
import Swiper, { Navigation, Pagination } from 'swiper';

import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

function sendEmail(formData: FormData){
    wait();
    const users = ajax({
        url: 'http://drbragaretina.com.br/php/send.php',
        method: 'POST',
        body: formData
    }).pipe(
        map(response => {
            return response
        }),
        catchError(error => {
            presentReturn(error)
            return of(error);
        })
    ).subscribe(data => {
        if(data.response.return == 'success'){
            gtag('event', 'conversion', {'send_to': 'AW-606634601/LlyRCJf4yO0BEOmEoqEC'});
            presentReturn(data.response.msg, 'success')
            completed();
        }else{
            presentReturn(data.response.msg, 'danger')
        }
    });
}
function presentReturn(msg: string, strClass: string = 'light'): void {
    const element = document.querySelector('.submit-return');
    const eRemove = document.querySelector('.submit-return > div');
    if(eRemove){
        eRemove.remove();
    }
    const eMsg = document.createElement('div');
    eMsg.textContent = msg;
    eMsg.classList.add('alert');
    eMsg.classList.add('alert-' + strClass);
    (element as HTMLDivElement).appendChild(eMsg);
}

function wait(){
    presentReturn('Aguarde', 'light');
    const eBtn = document.querySelector('.btn-send');
    (eBtn as HTMLButtonElement).disabled = true;
}

function completed(){
    const eBtn = document.querySelector('.btn-send');
    const eForm = document.querySelector('form');
    (eForm as HTMLFormElement).reset();
    (eBtn as HTMLButtonElement).disabled = false;
    formResetRemoveValidationClass()
};

function formResetRemoveValidationClass() {
    const eForm = document.querySelector('form');
    eForm?.classList.remove('was-validated');

    const inputs = eForm?.querySelectorAll('.form-control');

    inputs?.forEach((input) => {
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
            input.classList.remove('is-invalid', 'is-valid'); // Remove classes de validação manualmente

            // Truque para forçar o reset do estado :invalid/:valid
            input.setAttribute('data-old', input.value);
            input.value = '';
            input.value = input.getAttribute('data-old') || '';
            input.removeAttribute('data-old');
        }
    });

}

const eGoContact = document.querySelectorAll('.go-contact');
if(eGoContact){
    const sectionContact = document.querySelector(".contact");
    eGoContact.forEach(function (element){
        (element as HTMLElement).addEventListener('click', function(e) {
            e.preventDefault();
            (sectionContact as HTMLElement).scrollIntoView();
        })
    }) 
}

import AOS from 'aos';

const images = container.resolve(Images);
const googleMaps = container.resolve(GoogleMaps);
const filter = container.resolve(Filter);
const mask = container.resolve(Mask);

(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            (form as Element).addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }else{
                    event.preventDefault()
                    event.stopPropagation()
                    sendEmail(new FormData(event.target as HTMLFormElement))
                }
                form.classList.add('was-validated')
            }, false)
        })
})()

AOS.init({
    startEvent: 'DOMContentLoaded',
    duration: 800,
    offset: 340,
    delay: 50,
});

Swiper.use([Navigation, Pagination]);
const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
        1600: {
            slidesPerView: 4,
            spaceBetween: 30,
        },
    }
});

