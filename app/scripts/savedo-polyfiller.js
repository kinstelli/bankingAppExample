$(document).ready(function(){

    webshim.setOptions('forms', {
    lazyCustomMessages: true,
    replaceValidationUI: true,
    customDatalist: 'auto',
    list: {
        'filter': '^'
    }
    });

    webshim.setOptions('forms-ext', {
    'date': {
        'startView': 2,
        'openOnFocus': true,
        'calculateWidth': false
    }
    });

    webshim.polyfill('forms forms-ext');

    $(function(){
        $('#paymentDateInput').prop('min', function(){
            return new Date().toJSON().split('T')[0];
        });
    });

});

