
let participantString;  // string of participants
let participantArray;  // n*n matrix, represents the payment due amount between each pair of participant
let participantNumberMap;  // map each participant with one number

window.onload = function() {
    document.getElementById('input-name').focus();
    loadParticipants();
    document.getElementById('form').addEventListener('submit', addRow2Table);
}

// initialize participant array to be 0-0s and set innerHTML of inputs and tables
function loadParticipants() {
    // initialize participant array
    participantString = document.getElementById('input-payer').value;
    participantArray = [];
    participantNumberMap = new Map();
    for (let i = 0; i < participantString.length; i++) {
        participantNumberMap.set(participantString[i], i);
        let arrayRow = [];
        for (let j = 0; j < participantString.length; j++) {
            if (i == j) {
                arrayRow.push(0);
            } else {
                arrayRow.push(1);
            }
        }
        participantArray.push(arrayRow);
    }
    // set payee and payer innerHTML
    let spanPayee = document.getElementById('span-payee');
    spanPayee.innerHTML = '收款人：';
    let spanPayer = document.getElementById('span-payer');
    spanPayer.innerHTML = "付款人：";
    for (let i = 0; i < participantString.length; i++) {
        spanPayee.innerHTML += '<input id="input-payee-' + participantString[i] + '" name="payee" type="checkbox" value="' + participantString[i] + 
                               '"/><label for="input-payee-' + participantString[i] + '">' + participantString[i] + '</label>';
        spanPayer.innerHTML += '<input id="input-payer-' + participantString[i] + '" name="payer" type="checkbox" value="' + participantString[i] + 
                               '" checked /><label for="input-payer-' + participantString[i] + '">' + participantString[i] + '</label>';
    }
    // set outcome table innerHTML
    let tableOutcome = document.getElementById('table-outcome');
    tableOutcome.innerHTML = "";
    for (let i = 0; i < participantString.length - 1; i++) {
        let row = tableOutcome.insertRow(tableOutcome.rows.length);
        for (let j = 0; j < participantString.length; j++) {
            let payer = participantString[j];
            let payee;
            for (let k = 0; k < participantArray.length; k++) {
                if (participantArray[j][k] == 1) {
                    payee = participantString[k];
                    participantArray[j][k] = 0;
                    break;
                }
            }
            row.insertCell(j).innerHTML = payer + " 转给 " + payee + ": <span id='outcome-" + payer + payee + "'>0.00</span>";
        }
    }
}

// add one row to table for displaying detailed result
function addRow2Table(e) {
    e.preventDefault();
    // create payee list
    let payee = document.getElementsByName('payee');
    let payeeList = [];
    payee.forEach(item => {
        if (item.checked) {
            payeeList.push(item.value);
        }
    });
    // create payer list
    let payer = document.getElementsByName('payer');
    let payerList = [];
    payer.forEach(item => {
        if (item.checked) {
            payerList.push(item.value);
        }
    });
    // get name and payment amount
    let name = document.getElementById('input-name').value;
    let payment = document.getElementById('input-payment').value / 1.00;
    // calculate transaction amount between each payer and each payee
    let payer2Payee = 0;
    if (payerList.length > 0 && payeeList.length > 0) {
        let paymentPerPayer = Number(payment) / payerList.length;
        payer2Payee = paymentPerPayer / payeeList.length;
    } else {
        alert('至少需要一个收款人和一个付款人');
    }
    // update participant array and displayed outcome
    for (let i = 0; i < payerList.length; i++) {
        for (let j = 0; j < payeeList.length; j++) {
            let payerNo = participantNumberMap.get(payerList[i]);
            let payeeNo = participantNumberMap.get(payeeList[j]);
            if (payerNo != payeeNo) {
                let total = participantArray[payerNo][payeeNo] - participantArray[payeeNo][payerNo] + payer2Payee;
                if (total > 0) {
                    participantArray[payerNo][payeeNo] = total;
                    participantArray[payeeNo][payerNo] = 0;
                    document.getElementById('outcome-' + participantString[payerNo] + participantString[payeeNo]).innerHTML = total.toFixed(2);
                    document.getElementById('outcome-' + participantString[payeeNo] + participantString[payerNo]).innerHTML = "0.00";
                } else {
                    total *= -1;
                    participantArray[payerNo][payeeNo] = 0;
                    participantArray[payeeNo][payerNo] = total;
                    document.getElementById('outcome-' + participantString[payerNo] + participantString[payeeNo]).innerHTML = "0.00";
                    document.getElementById('outcome-' + participantString[payeeNo] + participantString[payerNo]).innerHTML = total.toFixed(2);
                }
            }
        }
    }
    // display detailed record
    let table = document.getElementById('table-detail');
    let row = table.insertRow(table.rows.length);
    row.insertCell(0).innerHTML = payeeList;
    row.insertCell(1).innerHTML = payerList;
    row.insertCell(2).innerHTML = name;
    row.insertCell(3).innerHTML = payment.toFixed(2);
    // reset form
    document.getElementById('btn-reset').click();
    document.getElementById('input-name').focus();
}
