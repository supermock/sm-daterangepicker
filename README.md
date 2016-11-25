# sm-daterangepicker

O componente daterangepicker do bootstrap: http://www.daterangepicker.com/, como directiva para uso com o AngularJS.

![sm-daterangepicker](daterangepicker.png?raw=true)

## Installation

```
npm install --save sm-daterangepicker
```

**Atenção**
Tenho importado no projeto o css do bootstrap, para que o componente de data seja renderizado corretamente.

## Usage
Adicione no modulo da sua aplicação:
```
require("sm-daterangepicker"); //return module name
angular.module("yourModuleName", ["sm-daterangepicker"]);
ou
angular.module("yourModuleName", [require("sm-daterangepicker")]);
```
Após adicionar, basta usar a diretiva do seguinte modo:
```
<input type="text" ng-model="yourVariable" sm-daterangepicker>
```
## ngModel
Para pegar a data de ínicio e fim, basta pegar a data do objeto no model, formatado assim:
```
{
    startDate: [object Moment],
    endDate: [object Moment]
}
```

## Atributos disponíveis
Atributo   | Tipo         | Descrição
---------- | ------------ | --------
locale     | Object       | Definição da tradução, caso não tenha no projeto o provider angular translate.
date-time  | String       | Aceita os valores 24h ou 12h, para indicar o formato, quando declarado exibe na input o horário.
year       | Date/Moment  | Recebe apenas uma data, e faz um limite do ínicio do ano até o fim do ano, que contém nela.
start-date | Date/Moment  | Define como data de ínicio pré selecionada.
end-date   | Date/Moment  | Define como data de fim pré selecionada.
min-date   | Date/Moment  | Define como data limite mínima.
max-date   | Date/Moment  | Define como data limite máxima.
date-limit | String       | Faz um limite de um range em dias, mês, ano ou horas, minutos e segundos.
onshow     | Function     | Acionado quando o calendário é mostrado.
onhide     | Function     | Acionado quando o calendário é fechado.
onapply    | Function     | Acionado quando o botão aplicar é clicado, ou quando um intervalo predefinido é clicado.
oncancel   | Function     | Acionado quando o botão cancelar é clicado.
suffix-translation | String | Namespace usado no arquivo de tradução do provider angular translate.

## Locale

> **Note:** Há dois modos de traduzir o daterangepicker, um é passando o atributo locale, com o seguinte objeto:
##### Atributo locale
---
```
//Model
$scope.localeObject = {
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
//View
<input type="text" locale="localeObject" sm-daterangepicker>
```
Outro modo de fazer a tradução que se torna mais eficiente por suportar várias linguagens e mudar em tempo de execução, é trabalhando junto com o provider [angular translate](https://angular-translate.github.io/).

##### Angular translate
---
Para entender melhor sobre o que estou explicando abaixo, leia sobre o angular translate.
> **Namespace (Opcional):**
<input type="text" suffix-translation="COMPONENTS" sm-daterangepicker>

**arquivo_de_traducao.js**
```
"SM_DATERANGEPICKER: {}" ou "NAMESPACE.SM_DATERANGEPICKER: {}"

"SM_DATERANGEPICKER": {
    "FORMAT": "DD/MM/YYYY HH:mm"),
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
}
```
## Date limit
Usar o atributo date-limit não é assim tão complicado, o que ele faz apenas, é fazer um limite da data selecionada a partir do range limitado, basta passar a ele o seguinte:
```
<input type="text" date-limit="parameter:value" sm-daterangepicker>
//Supported parameters: days, months, years, hours, minutes and seconds.
```

## Contribuição
Contribua para que está diretiva daterangepicker fique cada vez melhor.
Basta baixar o projeto e aplicar suas alterações, e após isto será analizado para ser aprovado.

## Creditos
[SuperMock](https://github.com/supermock/)

## Licença
MIT