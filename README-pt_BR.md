# sm-daterangepicker - AngularJS (directive)

O componente daterangepicker do bootstrap: http://www.daterangepicker.com/, como directiva para uso com o AngularJS.

![sm-daterangepicker](daterangepicker.png?raw=true)

## Instalação

```
npm install --save sm-daterangepicker
```

**Atenção**
Tenha importado no projeto o css do bootstrap, para que o componente de data seja renderizado corretamente.

## Uso
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
Para obter a data de ínicio e fim, basta pegar a data do objeto no model, formatado assim:
```
//ngModel
{
    startDate: [object Moment],
    endDate: [object Moment]
}

//Controller
$scope.yourVariable.startDate
$scope.yourVariable.endDate
```

## Atributos disponíveis
Atributo   | Tipo         | Descrição
---------- | ------------ | --------
env        | String       | Passe este atributo com "DEV", e logo o componente irá logar tudo que for mudado. (Ele recebe por padrão "PROD", porém ele pega do node.js se é "DEV")
locale     | Object       | Definição da tradução, caso não tenha no projeto o provider angular translate. (Se nenhuma tradução for passada ele atribui por padrão a língua inglesa.)
date-time  | String       | Aceita os valores 24h ou 12h, para indicar o formato, quando declarado exibe na input o horário.
year       | Date/Moment  | Recebe apenas uma data, e faz um limite do ínicio do ano até o fim do ano, que contém nela. (Quando passado este parâmetro ele ignora a data mínima e máxima)
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

## Atualização em tempo de execução

As variaveis de mínimo, máximo, ínicio, fim e ano, todas elas podem ser alteradas em tempo de execução, e o componente de data já se adaptara a mudança.

## Locale

> **Nota:** Há dois modos de traduzir o daterangepicker, um é passando o atributo locale, com o seguinte objeto:

##### Atributo locale
---
```
//Model
$scope.localeObject = {
    format: "DD/MM/YYYY",
    separator: " até ",
    applyLabel: "Aplicar",
    cancelLabel: "Limpar",
    fromLabel: "De",
    toLabel: "Até",
    customRangeLabel: "Data específica",
    daysOfWeek: [   
                    "Dom",
                    "Seg",
                    "Ter",
                    "Qua",
                    "Qui",
                    "Sex",
                    "Sáb"
                ],
    monthNames: [   
                    "Janeiro",
                    "Fevereiro",
                    "Março",
                    "Abril",
                    "Maio",
                    "Junho",
                    "Julho",
                    "Agosto",
                    "Setembro",
                    "Outubro",
                    "Novembro",
                    "Dezembro"
                ],
    firstDay: "1"
}
//View
<input type="text" locale="localeObject" sm-daterangepicker>
```
Outro modo de fazer a tradução que se torna mais eficiente por suportar várias linguagens e mudar em tempo de execução, é trabalhando junto com o provider [angular translate](https://angular-translate.github.io/).

##### Angular translate

Para entender melhor sobre o que estou explicando abaixo, leia sobre o angular translate.

---
> **Namespace (Opcional):**
> <input type="text" suffix-translation="NAMESPACE" sm-daterangepicker>

**arquivo_de_traducao.js**
```
"SM_DATERANGEPICKER: {}" ou "NAMESPACE.SM_DATERANGEPICKER: {}"

"SM_DATERANGEPICKER": {
    "FORMAT": "DD/MM/YYYY HH:mm",
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
//Parâmetros suportados: days, months, years, hours, minutes and seconds.
//Para mais de um parâmetro passado, separe-os por vírgula.
//Exemplo: parameter:value,parameter:value...
```

## Contribuição
Contribua para que está diretiva daterangepicker fique cada vez melhor.
Basta baixar o projeto e aplicar suas alterações, e após isto será analizado para ser aprovado.

## Creditos
[SuperMock](https://github.com/supermock/)

## Licença
MIT