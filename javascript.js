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
        let taxRate = 0.095;
        let addon = document.getElementById('input-addon');
        let discount = document.getElementById('input-discount');
        
        let totalPrice = price.value * quantity.value;
        totalPrice += Number(addon.value);
        if (tax[0].checked) {  // taxable
            totalPrice += totalPrice * taxRate;
            taxText = "Yes";
        }
        totalPrice -= Number(discount.value);
        
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
        row.insertCell(5).innerHTML = addon.value;
        row.insertCell(6).innerHTML = discount.value;
        row.insertCell(7).innerHTML = totalPrice.toFixed(2);

        document.getElementById('btn-reset').click();
        document.getElementById('input-name').focus();
    });
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