/**
* @version: 2.9.5
* @author: SuperMock
* @license: Licensed under the MIT license. See http://www.opensource.org/licenses/mit-license.php
* Requirements:
* Jquery (> v1.9.1) (< v3.0.0) | URL: https://code.jquery.com/jquery-2.2.4.min.js
* moment.js                    | URL: http://momentjs.com/
* Bootstrap                    | URL: http://getbootstrap.com/
* Bootstrap-daterangepicker    | URL: http://www.daterangepicker.com/
**/
module.exports = (function() {
    if (!window) throw 'Window is not defined! Try this in browser.';

    //Require dependences
    try {
        if (!window.angular) window.angular = require("angular");
        if (!window.jQuery) window.jQuery = require("jquery");
        var moment = require("moment");
        require("../bootstrap-daterangepicker/daterangepicker.css");
        require("../bootstrap-daterangepicker/daterangepicker");
    } catch(e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            console.error(e.stack);
            return;
        }
    }

    var smModule = window.angular.module("sm_daterangepicker", []);
    
    smModule.directive("smDaterangepicker", ['$injector', '$log', function ($injector, $log) {
        return {
            restrict: 'A',
            require: "ngModel",
            scope: {
                locale: '=?',
                dateTime: '@?',
                year: '=?',
                startDate: '=?',
                endDate: '=?',
                minDate: '=?',
                maxDate: '=?',
                dateLimit: '@?',
                onshow: '&?',
                onhide: '&?',
                onapply: '&?',
                oncancel: '&?',
                suffixTranslation: '@?'
            },
            link: function (scope, element, attrs, ngModel) {
                try {
                    scope.translatorProvider = $injector.get('$translate'); //Verifica se tem instalado o provider de tradução. (angular-translate)
                } catch (error) {}

                scope.smDRP = { 
                    text: "%c[SM-DRP] %c\n" + attrs.ngModel, 
                    abbrStyle: "color: white; text-shadow: 2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, " + 
                                                        " 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;", 
                    varStyle: "color: blue; font-weight: bold;"
                };

                if (process && process.hasOwnProperty("env") && process.env['NODE_ENV']) {
                    console.log("process.env['NODE_ENV']", process.env['NODE_ENV']);
                    scope.env = (process.env['NODE_ENV'].toLowerCase() == "dev" 
                                    || process.env['NODE_ENV'].toLowerCase() == "development") ? "DEV" : "OTHER"; //Variável de "DEV"
                } else {
                    scope.env = "DEV";
                }

                //Faz a saida de mensagens da diretiva.
                function log(type, message) {
                    if (type && !message) message = type;
                    switch(type) {
                        case 'info':
                            $log.info(scope.smDRP.text,
                                    scope.smDRP.abbrStyle,
                                    scope.smDRP.varStyle,
                                    message);
                            break;
                        case 'warn':
                            $log.warn(scope.smDRP.text,
                                    scope.smDRP.abbrStyle,
                                    scope.smDRP.varStyle,
                                    message);
                            break;
                        case 'error':
                            $log.error(scope.smDRP.text,
                                    scope.smDRP.abbrStyle,
                                    scope.smDRP.varStyle,
                                    message);
                            break;
                        default: //log
                            $log.log(scope.smDRP.text,
                                    scope.smDRP.abbrStyle,
                                    scope.smDRP.varStyle,
                                    message);
                            break;
                    }
                }
                //Converte a data em millisegundos, caso ela venha em String ou Date.
                function convertDate(date) {
                    if (date instanceof Date) {
                        return moment(date);
                    } else if ((typeof date) == 'string') {
                        if (date.indexOf("-") > 0) {
                            return moment(new Date(date));
                        } else {
                            return moment(date, scope.smFormat);
                        }
                    } else if ((typeof date) == 'number') {
                        return moment(date);
                    } else if (moment.isMoment(date)) {
                        return date;
                    }
                };
                //Formata os millisegundos em uma data no formato 'DD/MM/YYYY' como padrão, ou se for informado algum formato no sm-format="".
                function formatDate(date) {
                    return moment(date).format(scope.smFormat);
                };
                //Pega a data mínima referente aos parâmetros passados. OBS: Caso o ano seja passado como parâmetro a data mínima será ignorada.
                function getMinDate() {
                    if (scope.year) {
                        return formatDate(moment().year(scope.year).startOf('year'));
                    } else if (scope.minDate) {
                        return formatDate(convertDate(scope.minDate));
                    } else {
                        return 0;
                    }
                };
                //Pega a data máxima referente aos parâmetros passados. OBS: Caso o ano seja passado como parâmetro a data máxima será ignorada.
                function getMaxDate() {
                    if (scope.year) {
                        return formatDate(moment().year(scope.year).endOf('year'))
                    } else if (scope.maxDate) {
                        return formatDate(convertDate(scope.maxDate));
                    } else {
                        return 0;
                    }
                };
                //Retorna a data pre selecionada de inicio.
                function getStartDate() {
                    var startDate;
                    if (!scope.startDate) {
                        startDate = getMinDate();
                    } else {
                        startDate = formatDate(convertDate(scope.startDate));
                    }
                    return (startDate != 0) ? startDate : formatDate(new Date());
                };
                //Retorna a data pre selecionada de fim.
                function getEndDate() {
                    var endDate;
                    if (!scope.endDate) {
                        endDate = getMaxDate();
                    } else {
                        endDate = formatDate(convertDate(scope.endDate));
                    }
                    return (endDate != 0) ? endDate : formatDate(new Date());
                };
                //Faz a atualização do ng-model no value.
                function updateModelValue() {
                    var date = {
                        startDate: moment(getStartDate(), scope.smFormat),
                        endDate: moment(getEndDate(), scope.smFormat)
                    };

                    scope.currentDate = date;

                    ngModel.$setViewValue(date);
                };
                //Faz a atualização do ng-model na view.
                function updateModel() {
                    scope.options.startDate = getStartDate();
                    scope.options.endDate = getEndDate();
                    scope.options.minDate = getMinDate();
                    scope.options.maxDate = getMaxDate();

                    try {
                        $(element).daterangepicker(scope.options, callback);
                        //log('info', "Reloaded!");
                    } catch(err) {
                        log('error', "Failed to reload! Error: ", err);
                    }

                    ngModel.$viewValue = getStartDate() + scope.options.locale.separator + getEndDate();
                    ngModel.$render();
                };
                //Reseta o model para os valores padrões!
                function resetModel() {
                    updateModelValue();
                    updateModel();
                };
                //Tradução padrão
                scope.translate = {
                    "FORMAT": "DD/MM/YYYY" + ((scope.dateTime) ? (scope.dateTime == '24h' ? " HH:mm" : " hh:mm A") : ""),
                    "SEPARATOR": " até ",
                    "APPLYLABEL": "Aplicar",
                    "CANCELLABEL": "Limpar",
                    "FROMLABEL": "De",
                    "TOLABEL": "Até",
                    "CUSTOMRANGELABEL": "Data específica",
                    "DAYSOFWEEK": {
                        "SU": "Dom",
                        "MO": "Seg",
                        "TU": "Ter",
                        "WE": "Qua",
                        "TH": "Qui",
                        "FR": "Sex",
                        "SA": "Sáb"
                    },
                    "MONTHNAMES": {
                        "JANUARY": "Janeiro",
                        "FEBRUARY": "Fevereiro",
                        "MARCH": "Março",
                        "APRIL": "Abril",
                        "MAY": "Maio",
                        "JUNE": "Junho",
                        "JULY": "Julho",
                        "AUGUST": "Agosto",
                        "SEPTEMBER": "Setembro",
                        "OCTOBER": "Outubro",
                        "NOVEMBER": "Novembro",
                        "DECEMBER": "Dezembro"
                    },
                    "FIRSTDAY": "1"
                };
                //Função para realizar a tradução do componente.
                function translate(label) {
                    if (scope.translatorProvider && scope.translateDefined) {
                        return scope.translatorProvider.instant((scope.suffixTranslation ? scope.suffixTranslation + '.' : '') + 'SM_DATERANGEPICKER.' + label);
                    } else {
                        if (label.indexOf('.') > -1) {
                            return scope.translate[label.substr(0, label.indexOf('.'))][label.substr(label.indexOf('.')+1, label.length)];
                        } else {
                            return scope.translate[label];
                        }
                    }
                };
                //$parser de tratamento de objeto string, no model (view-model).
                ngModel.$parsers.unshift(function listening(value) {
                    if (typeof value === 'string') {
                        return scope.currentDate;
                    }
                    return value;
                });
                //$formatter de tratamento de objeto string, no model (model-view).
                ngModel.$formatters.unshift(function listening(value) {
                    if (typeof value !== 'object') {
                        //log('error', "Only accept manually set a object.");
                        return scope.currentDate;
                    }
                    return value;
                });
                (function () {
                    if (scope.translatorProvider) {
                        scope.$watch(function () {
                            return scope.translatorProvider.use();
                        }, function (newValue, oldValue) {
                            scope.translateDefined = //Verifica se tem uma tradução definida no arquivo de tradução.
                                !(scope.translatorProvider.instant((scope.suffixTranslation ? scope.suffixTranslation + '.' : '') + 'SM_DATERANGEPICKER.FORMAT') 
                                                                    == (scope.suffixTranslation ? scope.suffixTranslation + '.' : '') + 'SM_DATERANGEPICKER.FORMAT');
                            if (newValue && oldValue) {
                                scope.options = getOptions();
                                resetModel();
                            }
                        }, true);
                    }

                    scope.smFormat = (scope.locale) ? scope.locale.format : translate('FORMAT');

                    if (scope.env == "DEV")
                    $log.info("%cSM DATE-RANGE-PICKER v2.9.5", scope.smDRP.abbrStyle,
                                "\nsmFormat : " + scope.smFormat + "\n" +
                                "dateTime : " + (!scope.dateTime ? 'undefined' : scope.dateTime) + " (12h or 24h)" + "\n" +
                                "startDate: " + (!scope.startDate ? 'undefined' : getStartDate()) + "\n" +
                                "endDate  : " + (!scope.endDate ? 'undefined' : getEndDate()) + "\n" +
                                "minDate: " + (getMinDate() == 0 ? 'undefined' : getMinDate()) + "\n" +
                                "maxDate: " + (getMaxDate() == 0 ? 'undefined' : getMaxDate()) + "\n" +
                                "dateLimit: " + (!scope.dateLimit ? 'undefined' : scope.dateLimit) + "\n" +
                                "   year: " + scope.year + " (Year priority over minimum and maximum date.)\n" + 
                                (scope.translatorProvider && !scope.translateDefined ? "Do you have a translation provider, but you did not define the translation file. Using default (PT_BR)." : "") +
                                (!scope.translatorProvider ? "NOTE: You do not have the translation provider (angular-translate), will then be applied to standard translation (PT-BR)." : ""));
                    
                    scope.options = getOptions();
                    //Retorna as opções do projeto.
                    function getOptions() {
                        return {
                            timePicker: (scope.dateTime ? true : false),
                            timePicker24Hour: (scope.dateTime && scope.dateTime == '24h' ? true : false),
                            timePickerIncrement: 1,
                            startDate: getStartDate(),
                            endDate: getEndDate(),
                            minDate: getMinDate(),
                            maxDate: getMaxDate(),
                            locale: {
                                format: scope.smFormat,
                                separator: translate('SEPARATOR'),
                                applyLabel: translate('APPLYLABEL'),
                                cancelLabel: translate('CANCELLABEL'),
                                fromLabel: translate('FROMLABEL'),
                                toLabel: translate('TOLABEL'),
                                customRangeLabel: translate('CUSTOMRANGELABEL'),
                                daysOfWeek: [   translate('DAYSOFWEEK.SU'), 
                                                translate('DAYSOFWEEK.MO'), 
                                                translate('DAYSOFWEEK.TU'), 
                                                translate('DAYSOFWEEK.WE'), 
                                                translate('DAYSOFWEEK.TH'), 
                                                translate('DAYSOFWEEK.FR'), 
                                                translate('DAYSOFWEEK.SA')
                                            ],
                                monthNames: [   translate('MONTHNAMES.JANUARY'),
                                                translate('MONTHNAMES.FEBRUARY'),
                                                translate('MONTHNAMES.MARCH'),
                                                translate('MONTHNAMES.APRIL'),
                                                translate('MONTHNAMES.MAY'),
                                                translate('MONTHNAMES.JUNE'),
                                                translate('MONTHNAMES.JULY'),
                                                translate('MONTHNAMES.AUGUST'),
                                                translate('MONTHNAMES.SEPTEMBER'),
                                                translate('MONTHNAMES.OCTOBER'),
                                                translate('MONTHNAMES.NOVEMBER'),
                                                translate('MONTHNAMES.DECEMBER')
                                            ],
                                firstDay: translate('FIRSTDAY')
                            }
                        };
                    }
                    //Transforma os parâmetros passados em texto para o formato JSON.
                    function toJSON(text) {
                        var properties = text.split(",");
                        var textJSON = "{ ";
                        for (var i = 0; i < properties.length; i++) {
                            textJSON += "\"" + properties[i].substr(0, properties[i].indexOf(":")) + "\":" 
                                + properties[i].substr(properties[i].indexOf(":")+1, properties[i].length) + ", ";
                        }
                        textJSON = textJSON.substr(0 , textJSON.lastIndexOf(",")) + " }";
                        return JSON.parse(textJSON);
                    };
                    //Verifica se tem um limite de range date.
                    (function verifyDateLimit() {
                        if (scope.dateLimit) {
                            var quantity = 0;
                            if (scope.dateLimit.indexOf("days") > -1) quantity++;
                            if (scope.dateLimit.indexOf("months") > -1) quantity++;
                            if (scope.dateLimit.indexOf("years") > -1) quantity++;

                            if (quantity == 1 || (quantity == 0 && scope.dateLimit.length > 0)) {
                                try {
                                    scope.options.dateLimit = toJSON(scope.dateLimit);
                                } catch(error) {
                                    log('error', "Failed to parse JSON in a date-limit attribute.\n" + 
                                        "Example usage: date-limit=\"parameter:value\" comma separated.\nExample: days:1,hours:2,minutes:30.\nError: ", error.message);
                                }
                            } else {
                                log('warn', "In attribute deadline a date parameter is only allowed, and more than a time parameter.\n" +
                                    "Supported parameters: days, months, years, hours, minutes and seconds.\n" + 
                                    "Example usage: date-limit=\"parameter:value\" comma separated.\nExample: days:1,hours:2,minutes:30.");
                            }
                        }
                    })();
                    createElementDateRangePicker(); //Cria o elemento do date-range-picker
                    resetModel(); //Inicializa o model;
                    scope.$watch(function () {
                        return scope.startDate;
                    }, function watchCallback(newValue, oldValue) {
                        if (scope.env == "DEV") log("startDate: " + getStartDate());
                        if (scope.startDate) resetModel();
                    });
                    scope.$watch(function () {
                        return scope.endDate;
                    }, function watchCallback(newValue, oldValue) {
                        if (scope.env == "DEV") log("endDate: " + getEndDate());
                        if (scope.endDate) resetModel();
                    });
                    scope.$watch(function () {
                        return scope.minDate;
                    }, function watchCallback(newValue, oldValue) {
                        if (scope.env == "DEV") log("minDate: " + getMinDate());
                        if (scope.minDate) resetModel();
                    });
                    scope.$watch(function () {
                        return scope.maxDate;
                    }, function watchCallback(newValue, oldValue) {
                        if (scope.env == "DEV") log("maxDate: " + getMaxDate());
                        if (scope.maxDate) resetModel();
                    });
                    scope.$watch(function () {
                        return scope.year;
                    }, function watchCallback(newValue, oldValue) {
                        if (scope.env == "DEV") log("drp.year: " + scope.year);
                        if (scope.year) resetModel();
                    });
                    scope.$watch(function () { //Se a variável do model for zerada, esta função atualiza ela com o valor default;
                        return ngModel.$modelValue;
                    }, function (value) {
                        if (!value) resetModel();
                    });
                    scope.$watch(function () { //Se a variável do view for zerada, esta função atualiza ela com o valor default;
                        return ngModel.$viewValue;
                    }, function (value) {
                        if ((value === "[object Object]")) resetModel();
                    });
                    //Eventos do datepicker
                    if (scope.onshow)
                        $(element).on('show.daterangepicker', function (ev, picker) {
                            scope.onshow({evt: evt, picker: picker});
                        });
                    if (scope.onhide) //Acionado quando o selecionador está escondido
                        $(element).on('hide.daterangepicker', function (ev, picker) {
                            scope.onhide({evt: evt, picker: picker});
                        });
                    if (scope.onapply) //Acionado quando o botão Aplicar for clicado, ou quando um intervalo pré-definido é clicado
                        $(element).on('apply.daterangepicker', function (ev, picker) {
                            scope.onapply({evt: evt, picker: picker});
                        });
                    if (scope.oncancel) //Acionado quando o botão Cancelar é clicado
                        $(element).on('cancel.daterangepicker', function (ev, picker) {
                            scope.oncancel({evt: evt, picker: picker});
                        });
                })();
                function createElementDateRangePicker() {
                    if (!$(element).data('daterangepicker')) {
                        $(element).daterangepicker(scope.options, callback);
                        $(element).css({ 'color': 'black', 'font-size': '14px' });
                        $(element).attr('readonly', true);
                    }
                };
                function callback(start, end, label) {
                    if (!start.isValid() || !end.isValid()) {
                        start = moment(getStartDate(), scope.smFormat);
                        end = moment(getEndDate(), scope.smFormat);
                    }

                    var date = {
                        startDate: convertDate(start),
                        endDate: convertDate(end)
                    };

                    scope.currentDate = date;

                    ngModel.$setViewValue(date);

                    ngModel.$viewValue = formatDate(start) + scope.options.locale.separator + formatDate(end);

                    ngModel.$render();
                };
            }
        }
    }]);

    return smModule.name;
}).call(this);