var display = null;

var listenerBtn = [];

//Number buttons
listenerBtn.push(document.getElementById("num0"));
listenerBtn.push(document.getElementById("num1"));
listenerBtn.push(document.getElementById("num2"));
listenerBtn.push(document.getElementById("num3"));
listenerBtn.push(document.getElementById("num4"));
listenerBtn.push(document.getElementById("num5"));
listenerBtn.push(document.getElementById("num6"));
listenerBtn.push(document.getElementById("num7"));
listenerBtn.push(document.getElementById("num8"));
listenerBtn.push(document.getElementById("num9"));

var displayArray = [];
displayArray.push(document.getElementById("moedas05C"));
displayArray.push(document.getElementById("moedas10C"));
displayArray.push(document.getElementById("moedas25C"));
displayArray.push(document.getElementById("moedas50C"));
displayArray.push(document.getElementById("moedas1R"));

displayArray.push(document.getElementById("cedulas2R"));
displayArray.push(document.getElementById("cedulas5R"));
displayArray.push(document.getElementById("cedulas10R"));
displayArray.push(document.getElementById("cedulas20R"));
displayArray.push(document.getElementById("cedulas50R"));
displayArray.push(document.getElementById("cedulas100R"));
displayArray.push(document.getElementById("cedulas200R"));


//Additional buttons
var btnResult = document.getElementById("result");
var btnCleanDisplay = document.getElementById("cleanDisplay");
var btnDeleteDigit = document.getElementById("deleteDigit");
var pointCounter = 0;
var pointLimit = 1;

var resultMoedasElement = document.getElementById("resultMoedasElement");
var resultCedulasElement = document.getElementById("resultCedulasElement");
var resultElement = document.getElementById("resultElement");

for (var i = 0; i < listenerBtn.length; i++) {
  listenerBtn[i].addEventListener("click", writeOnDisplay); 
}

for (var i = 0; i < displayArray.length; i++) {
  displayArray[i].addEventListener("click", selectDisplay); 
}

var btnNext = document.getElementById("nextQuestion");
var btnFinalResult = document.getElementById("showFinalResult");
var answerReais = document.getElementById("answerReais");
var questionText = document.getElementById("questionText");
var feedbackCorrect = document.getElementById("feedbackResultAcertou");
var feedbackError = document.getElementById("feedbackResultErrou");
var feedbackFinal = document.getElementById("feedbackFinal");
var correctAnswer = "";

function RandInt(min, max) {
  if (min > max) {
    var aux = min;
    min = max;
    max = aux;
  }
  
  return Math.floor(Math.random() * max) + min;
}

function padValueStr(value) {
  value = String(value);
  if (value.indexOf('.') === -1)
    value += '.';
  
  let str = "";
  for (var i = 0; i < value.length; i++) {
    var c = value[i];
    if (c === '.')
      str += ',';
    else
      str += c;
  }
  
  let afterComma = (str.slice(str.indexOf(',') + 1, str.length)).length;
  if (afterComma < 2)
    str += "0";
  value = str;
  return value;
}

function makeValuesReais(value, padValue) {
  if (!value)
    return "";
  
  if (value < 1) {
    value *= 100;
    value = value + " centavos";
    return value;
  }
  
  const total = String(padValue);
  const commaIndex = total.indexOf(',');
  const reais = parseInt(total.slice(0, commaIndex));
  const cents = parseInt(total.slice(commaIndex + 1, commaIndex + 3));
  if (cents)
    value = reais + " reais e " + cents + " centavos!";
  else
    value = reais + " reais!";
  return value;
}

function deleteConteudo(elId) {
  const el = document.getElementById(elId);
  if (!el)
    return;
  el.value = "";
}

function calcValueDisplay(d) {
  if (d.value.length) {
    var num = parseInt(d.value);
    switch (d.id) {
      case "moedas05C":
        return 0.05 * num;
      case "moedas10C":
        return 0.10 * num;
      case "moedas25C":
        return 0.25 * num;
      case "moedas50C":
        return 0.50 * num;
      case "moedas1R":
        return 1 * num;
      
      //cédulas
      case "cedulas2R":
        return 2 * num;
      case "cedulas5R":
        return 5 * num;
      case "cedulas10R":
        return 10 * num;
      case "cedulas20R":
        return 20 * num;
      case "cedulas50R":
        return 50 * num;
      case "cedulas100R":
        return 100 * num;
      case "cedulas200R":
        return 200 * num;
    }
  }
  
  return 0;
}

function calcTmpValor(displayId, targetId) {
  const d = document.getElementById(displayId);
  const target = document.getElementById(targetId);
  if (!d || !target)
    return;
  
  const value = calcValueDisplay(d);
  const padValue = padValueStr(value);
  
  target.textContent = makeValuesReais(value, padValue); 
  target.hidden = false;
  
  setTimeout(() => {
    target.textContet = "";
    target.hidden = true;
  }, 5000);
}

btnResult.onclick = function () {
  var valueMoedas = 0;
  var valueCedulas = 0;
  for (var i = 0; i < displayArray.length; i++) {
    var d = displayArray[i];
    if (d.id.indexOf('moedas') > -1)
      valueMoedas += calcValueDisplay(d);
    else
      valueCedulas += calcValueDisplay(d);
  }
  
  const valueTotal = valueMoedas + valueCedulas;
  const valueMoedasFinal = valueMoedas;
  const valueCedulasFinal = valueCedulas;
  
  const valuePadTotal = padValueStr(valueTotal);
  const valuePadMoedas = padValueStr(valueMoedas);
  const valuePadCedulas = padValueStr(valueCedulas);
  
  resultMoedasElement.value = makeValuesReais(valueMoedasFinal, valuePadMoedas);
  resultCedulasElement.value = makeValuesReais(valueCedulasFinal, valuePadCedulas);
  resultElement.value = makeValuesReais(valueTotal, valuePadTotal);
};

btnDeleteDigit.onclick = function () {
  deleteLastDigit();
};

btnCleanDisplay.onclick = function () {
  resultElement.value = "";
  for (var i = 0; i < displayArray.length; i++) {
    var d = displayArray[i];
    d.value = "";
  }
  pointCounter = 0;
};

function deleteLastDigit() {
  if (display.value.length > 0) {
    display.value = display.value.substring(0, display.value.length - 1);
  }
}

function writeOnDisplay() {
  if (!display)
    return;
  
  lastDigit = this.value;

  display.value += lastDigit; 
}

var defaultBGColor = null;
function selectDisplay(event) {
  if (!display)
    defaultBGColor = event.target.style.backgroundColor;

  for (var i = 0; i < displayArray.length; i++) {
    var d = displayArray[i];
    d.style.backgroundColor = defaultBGColor;
  }
  display = event.target;
  display.style.backgroundColor = 'springgreen';
}
