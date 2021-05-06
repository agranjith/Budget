const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

// SELECT BTNS
const expenseBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");


// INPUT BTS
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

let ENTRY_LIST;
let bal = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";

//ENTRY_LIST= JSON.parse(localStorage.getItem())

ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();


//action listerners between tabs


expenseBtn.addEventListener("click", function () {
    show(expenseEl);
    hide([incomeEl, allEl]);
    active(expenseBtn);
    inactive([incomeBtn, allBtn]);

});

incomeBtn.addEventListener("click", function () {
    show(incomeEl);
    hide([expenseEl, allEl]);
    active(incomeBtn);
    inactive([expenseBtn, allBtn]);
});
allBtn.addEventListener("click", function () {
    show(allEl);
    hide([incomeEl, expenseEl]);
    active(allBtn);
    inactive([incomeBtn, expenseBtn]);
});


addExpense.addEventListener("click", function () {
    if (!expenseTitle.value || !expenseAmount.value) return;

    // saving the entry list

    let expense = {
        type: "outcome",
        title: expenseTitle.value,
        amount: parseInt(expenseAmount.value)
    }

    // console.log(expenseAmount.value);

    ENTRY_LIST.push(expense);
    updateUI();
    clearInput([expenseTitle, expenseAmount]);

})

addIncome.addEventListener("click", function () {
    if (!incomeTitle.value || !incomeAmount.value) return;

    let expense = {
        type: "income",
        title: incomeTitle.value,
        amount: parseInt(incomeAmount.value)

    }

    ENTRY_LIST.push(expense);
    updateUI();

    clearInput([incomeTitle, incomeAmount]);
})

function updateUI() {
    income = calculateTotal("income", ENTRY_LIST);
    //   console.log(income);

    outcome = calculateTotal("outcome", ENTRY_LIST);
    //  console.log(outcome);
    balance = Math.abs(calculateBalance(income, outcome));
    // console.log(balance);

    let sign = (income >= outcome) ? "Rs" : "-Rs";


    balanceEl.innerHTML = `<small>${sign}</small> ${balance}`;
    incomeTotalEl.innerHTML = `<small>Rs</small> ${income}`;
    outcomeTotalEl.innerHTML = `<small>Rs</small> ${outcome}`;


    incomeList.addEventListener("click", deleteOrEdit);
    expenseList.addEventListener("click", deleteOrEdit);
    allList.addEventListener("click", deleteOrEdit);

    clearElement([incomeList, expenseList, allList]);

    ENTRY_LIST.forEach((entry, index) => {
        if (entry.type == "outcome") {
            showEntry(expenseList, entry.type, entry.title, entry.amount, index);
        } else if (entry.type == "income") {
            showEntry(incomeList, entry.type, entry.title, entry.amount, index);
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index);


    });

    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}



function showEntry(list, type, title, amount, id) {
    const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}: Rs${amount}</div>
                        <div id="edit"></div>
                         <div id="delete"></div>
                    </li>`;
    const pos = "afterbegin"

    list.insertAdjacentHTML(pos, entry);
    //list.insertAdjacentHTML(position, entry);
}


function deleteOrEdit(event) {
    const targetbtn = event.target;
 //   console.log(event.target);
    const entry = targetbtn.parentNode;

  //  console.log(entry);




    //  console.log(event);

    if (targetbtn.id == DELETE) {
        deleteEntry(entry);
    } else if (targetbtn.id == EDIT) {
        editEntry(entry);
    }
}


function deleteEntry(entry){
  //  console.log(entry);
  //  console.log(entry.id);
    ENTRY_LIST.splice( entry.id , 1 );
    updateUI();
}

function editEntry(entry){
   // console.log(entry);
    let ENTRY = ENTRY_LIST[entry.id];
  //  console.log(ENTRY);

    if(ENTRY.type == "income"){
       // console.log(ENTRY.amount);
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value= ENTRY.title;
        
    }else if(ENTRY.type == "outcome"){
        expenseAmount.value= ENTRY.amount;
        expenseTitle.value = ENTRY.title;
    }

    deleteEntry(entry);

}




function clearElement(inputs) {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].innerHTML = "";
    }

}

function calculateTotal(type, list) {

    let sum = 0;
    list.forEach(entry => {
        if (entry.type == type) {
            sum += entry.amount;
        }
    })
    // console.log(sum);


    return sum;

}

function calculateBalance(income, outcome) {
    //    console.log(income);
    //   console.log(outcome)
    return income - outcome;

}







//functions for switching between tabs

function clearInput(inputs) {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
}
function show(element) {
    element.classList.remove("hide");
}

function hide(elements) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add("hide");
    }
}

function active(element) {
    element.classList.add("active");
}

function inactive(elements) {
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove("active");
    }

}

