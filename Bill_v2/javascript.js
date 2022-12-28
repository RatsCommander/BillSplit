window.onload = function() {
    document.getElementById('input-name').focus();

    document.getElementById('form').addEventListener('submit', e => {
        e.preventDefault();
        let name = document.getElementById('input-name');
        let price = document.getElementById('input-price');
        let payer = document.getElementsByName('payer');
        let quantity = document.getElementById('input-quantity');
        let tax = document.getElementsByName('tax');
        let taxText = "No";
        let taxRate = 0.1;
        
        let totalPrice = price.value * quantity.value;
        if (tax[0].checked) {  // taxable
            taxText = "Yes";
            totalPrice += totalPrice * taxRate;
        }
        
        let payerList = [];
        payer.forEach(item => {
            if (item.checked) {
                payerList.push(item.value);
            }
        });
        let payerPrice = 0;
        if (payerList.length > 0) {
            payerPrice = totalPrice / payerList.length;
        } else {
            alert('至少需要一个均摊人');
        }
        
        payerList.forEach(item => {
            let outcome = document.getElementById('outcome-' + item);
            outcome.innerHTML = (Number(outcome.innerText) + Number(payerPrice)).toFixed(2);
        });

        let row = table.insertRow(document.getElementById('table').rows.length);
        row.insertCell(0).innerHTML = payerList;
        row.insertCell(1).innerHTML = name.value;
        row.insertCell(2).innerHTML = price.value;
        row.insertCell(3).innerHTML = quantity.value;
        row.insertCell(4).innerHTML = taxText;
        row.insertCell(5).innerHTML = totalPrice.toFixed(2);

        document.getElementById('btn-reset').click();
        document.getElementById('input-name').focus();
    });
}

function loadPayer() {
    let payerListString = document.getElementById('input-payer').value;
    let payerList = [];
    for (let i = 0; i < payerListString.length; i++) {
        payerList.push(payerListString[i]);
    }
    let span = document.getElementById('span-payer');
    let p = document.getElementById('p-payer');
    span.innerHTML = "付款人：";
    p.innerHTML = "";
    for (let i = 0; i < payerList.length; i++) {
        span.innerHTML += '<input id="input-payer-' + payerList[i] + '" name="payer" type="checkbox" value="' + payerList[i] + 
                          '" checked /><label for="input-payer-' + payerList[i] + '">' + payerList[i] + '</label>';
        if (i == payerList.length - 1) {
            p.innerHTML += payerList[i] + ': <span id="outcome-' + payerList[i] + '">0.00</span>';
        } else {
            p.innerHTML += payerList[i] + ': <span id="outcome-' + payerList[i] + '">0.00</span>&emsp;&emsp;';
        }
    }
}

function delLastRow() {
    let table = document.getElementById('table');
    if (table.rows.length == 1) {
        alert('无法删除');
        document.getElementById('input-name').focus();
        return;
    }
    let payerList = table.rows[table.rows.length-1].cells[0].innerHTML.split(',');
    let totalPrice = Number(table.rows[table.rows.length-1].cells[7].innerHTML);
    let payerPrice = totalPrice / payerList.length;
    payerList.forEach(item => {
        let outcome = document.getElementById('outcome-' + item);
        outcome.innerHTML = (Number(outcome.innerText) - Number(payerPrice)).toFixed(2);
    });
    table.deleteRow(table.rows.length-1);
    document.getElementById('input-name').focus();
}