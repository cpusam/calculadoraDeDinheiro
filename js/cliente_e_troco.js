var display = document.getElementById("display");

var listenerBtn = [];

//Operator buttons
listenerBtn.push(document.getElementById("sum"));
listenerBtn.push(document.getElementById("subtraction"));
listenerBtn.push(document.getElementById("division"));
listenerBtn.push(document.getElementById("multiplication"));

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

//Additional buttons
var btnResult = document.getElementById("result");
var btnCleanDisplay = document.getElementById("cleanDisplay");
var btnDeleteDigit = document.getElementById("deleteDigit");
listenerBtn.push(document.getElementById("point"));

var pointCounter = 0;
var pointLimit = 1;

for (var i = 0; i < listenerBtn.length; i++) {
  listenerBtn[i].addEventListener("click", writeOnDisplay); 
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
  if (value.length < 5)
    while (value.length != 5)
      value += "0";
  
  let str = "";
  for (let c of value)
    if (c === '.')
      str += ',';
    else
      str += c;
  value = str;
  return value;
}

var answered = 0;
function checkAnswer(value) {
  const v = parseFloat(value);
  const c = parseFloat(correctAnswer);
  console.log('c '+c+' v '+v);
  if (v === c) {
    feedbackCorrect.hidden = false;
    feedbackError.hidden = true;
    if (answered === 0) {
      const total = String(correctAnswer);
      const reais = correctAnswer.slice(0, correctAnswer.indexOf(','));
      const cents = correctAnswer.slice(correctAnswer.indexOf(',') + 1, correctAnswer.length);
      if (cents.length)
        feedbackCorrect.textContent = "Acertou! "+reais+" reais e "+cents+" centavos!";
      else
        feedbackCorrect.textContent = "Acertou! "+reais+" reais!";
      playerData.correct++;
      answered++;
    }
  }
  else {
    feedbackCorrect.hidden = true;
    feedbackError.hidden = false;
    if (answered === 0) {
      playerData.wrong++;
      answered++;
    }
  }
}

function hideFeedback() {
  feedbackCorrect.hidden = true;
  feedbackError.hidden = true;
  feedbackFinal.hidden = true;
}

const playerData = {
  total: 0,
  correct: 0,
  wrong: 0,
};

function showFeedbackFinal() {
  feedbackFinal.hidden = false;
  feedbackFinal.textContent = `Total: ${playerData.total} Acertou: ${playerData.correct} Errou ${playerData.wrong}`;
}

function generateQuestion() {
  const centavosValues = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 65, 70, 75, 80, 85, 90, 95];
  const reaisValues = [1];
  const startText = [
    "O cliente quer comprar ",
  ];
  const paesText = [
    "pães ",
  ];
  const valorText = [
    "cada um custando ",
  ];
  const textoE = "e ";
  const question = [
    "Quanto o cliente vai ter que pagar em reais?",
  ];
  var text = "";
  const qtdePaes = RandInt(5, 20);
  const qtdeReais = reaisValues[RandInt(0, reaisValues.length)];
  const qtdeCentavos = centavosValues[RandInt(0, centavosValues.length)];
  text += startText[RandInt(0, startText.length)];
  text += String(qtdePaes) + " ";
  text += paesText[RandInt(0, paesText.length)];
  text += valorText[RandInt(0, paesText.length)];
  text += String(qtdeReais) + " ";
  text += textoE;
  text += String(qtdeCentavos) + " centavos. ";
  text += question[RandInt(0, question.length)];
  
  correctAnswer = Math.ceil((qtdePaes * (qtdeReais + qtdeCentavos / 100.0)) * 100) / 100;
  correctAnswer = padValueStr(correctAnswer);
  questionText.textContent = text;
  hideFeedback();
  //o mesmo que btnCleanDisplay.onclick
  answerReais.textContent = "0 reais";
  display.value = "";
  pointCounter = 0;
  hideFeedback();
  
  playerData.total++;
  answered = 0;
}

generateQuestion();

setInterval(() => {
  showFeedbackFinal();
}, 500);

btnNext.onclick = function () {
  generateQuestion();
}

btnResult.onclick = function () {
  if (!display.value.length)
    return;
  
  var value = "";
  for (let c of display.value) {
    if (c === "x") {
      value += '*';
    }
    else if (c === ",") {
      value += '.';
    }
    else {
      value += c;
    }
  }
  
  value = calculateResult(value);
  value = Math.ceil(value * 100) / 100.0;
  value = padValueStr(value);
  
  answerReais.textContent = value + " reais";
  checkAnswer(value);
};

btnDeleteDigit.onclick = function () {
  deleteLastDigit();
};

btnCleanDisplay.onclick = function () {
  answerReais.textContent = "0 reais";
  display.value = "";
  pointCounter = 0;
  hideFeedback();
};

function calculateResult(value) {
  if (verifyOperator(value.substring(display.value.length - 1, display.value.length))) {
    deleteLastDigit(); //If the last digit on display is an operator, it's ignored
  }

  var calculatedValue = calculateArray(value); 

  return calculatedValue;
}

function deleteLastDigit() {
  if (display.value.length > 0) {
    if (display.value[display.value.length - 1] === ".") {//If the deleted character is a decimal point, it can be replaced by a new one
      pointCounter = 0;
    }
    display.value = display.value.substring(0, display.value.length - 1);
  }
}

function writeOnDisplay() {
  lastDigit = this.value;

  if (verifyOperator(lastDigit)){
    pointCounter = 0;
    if (verifyOperator(display.value.substring(display.value.length - 1, display.value.length))) { //replaces the previous operator by the new operator inputed
      deleteLastDigit();
    }
  } 
    
  if (verifyDecimalPoint(lastDigit) === true){
    pointCounter++;
    if (pointCounter > pointLimit){
      return;
    }    
  }
  display.value += lastDigit; 
}

function verifyDecimalPoint(valorDigitado) {
  if (valorDigitado === ".") {
    return true;
  } else {
    return false;
  }
}

function verifyOperator(operatorValue) {
  switch (operatorValue) {
    case "*":
      return true;
    case "/":
      return true;
    case "+":
      return true;
    case "-":
      return true;
    default:
      return false;
  }
}

function calculateArray(exp) {
  exp = exp.toString().split("+");
  for (a = 0; a < exp.length; a++) {
    exp[a] = exp[a].split("-");
    for (b = 0; b < exp[a].length; b++) {
      exp[a][b] = exp[a][b].split("*");
      for (c = 0; c < exp[a][b].length; c++) {
        exp[a][b][c] = exp[a][b][c].split("/");
        exp[a][b][c] = divideArray(exp[a][b][c]);
      }
      exp[a][b] = multiplyArray(exp[a][b]);
    }
    exp[a] = subtractArray(exp[a]);
  }
  exp = sumArray(exp);

  return exp;
}

function multiplyArray(parameter) {
  var resultMult = 1;
  for (var x = 0; x < parameter.length; x++) {
    resultMult *= parameter[x];
  }
  return resultMult;
}

function divideArray(parameter) {
  var resultDiv = parameter[0];
  for (var x = 1; x < parameter.length; x++) {
    resultDiv /= parameter[x];
  }
  return resultDiv;
}

function subtractArray(parameter) {
  var resultSub = parameter[0];
  for (var x = 1; x < parameter.length; x++) {
    resultSub -= parameter[x];
  }
  return resultSub;
}

function sumArray(parameter) {
  var resultSum = 0;
  for (var x = 0; x < parameter.length; x++) {
    resultSum += parameter[x];
  }
  return resultSum;
}
