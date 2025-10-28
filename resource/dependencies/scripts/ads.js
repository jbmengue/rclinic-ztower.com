var g_ED = {
    "email": "input#txt_email",
    "phone_number": "input#txt_phone"
}

var g_countrycode = '+55';
var g_country = 'Brasil';


window.enhanced_conversion_data = window.enhanced_conversion_data || {};
document.addEventListener('input', g_save_toLocalStorage);

function g_save_toLocalStorage(e) {
    var input = e.target;
    for (i in g_ED) {
        if (input.matches(g_ED[i])) {
            localStorage['g_' + i] = input.value;
        }
    }
    g_setup_Enhanced_Conversion_Data();
}

function g_setup_Enhanced_Conversion_Data() {
    for (i in g_ED) {
        //Início do Email + Telefone
        if (localStorage['g_' + i]) {
            if (i == 'email' && g_validateEmail(localStorage['g_' + i])) {
                window.enhanced_conversion_data[i] = localStorage['g_' + i];
            }
            if (i == 'phone_number' && window.enhanced_conversion_data['email']) {
                window.enhanced_conversion_data[i] = g_countrycode + localStorage['g_' + i];
                window.enhanced_conversion_data[i] = window.enhanced_conversion_data[i].replace(/\D/g, '');
            }
        }

    }
}

//Validações (não mexer)
function g_validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}
g_setup_Enhanced_Conversion_Data();