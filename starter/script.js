'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


//function----------------------------------
const displayMovements=function(movements,sort=false){
  containerMovements.innerHtml='';

  //----------
  const movs=sort?movements.slice()
    .sort((a,b) => a - b) :movements;

  movs.forEach(function(mov,i){
    const type=mov > 0? 'deposit':'withdrawal';

    const html=`
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
        `;

    containerMovements.insertAdjacentHTML('afterbegin',html);

  });
  
};



const calcDisplayBalance=function(acc){
  acc.balance=acc.movements.reduce((acc,mov) => acc + mov,0);
 
  labelBalance.textContent=`${acc.balance}€`;
};


//--------------------------
const calcDisplaySummary=function(acc){
  const incomes=acc.movements.filter(mov => mov > 0)
    .reduce((acc,mov) => acc + mov,0);
  labelSumIn.textContent=`${incomes}€`;

  const out=acc.movements.filter(mov => mov < 0)
    .reduce((acc,mov) => acc + mov,0);
  labelSumOut.textContent=`${Math.abs(out)}€`;

  //預金に対する1.2%の利息----------------------クソ長い  
  const interest=acc.movements.filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100).filter((int,i,arr) => {
    console.log(arr);
    return int >= 1;
    }).reduce((acc,int) => acc + int,0);
    labelSumInterest.textContent=`${interest}€`;

};




const createUsernames=function(accs){
  accs.forEach(function(acc){
    acc.username=acc.owner
    .toLowerCase().split(' ').map(name => name[0]).join('');
  });
};

createUsernames(accounts);


//upadateUI()---------------------------
const updateUI=function(acc){
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);


};

//login----------------------------------
let currentAccount;

btnLogin.addEventListener('click',function(e){
  e.preventDefault();

  currentAccount=accounts.find(
    acc => acc.username===inputLoginUsername.value
  );
  console.log(currentAccount);

  if(currentAccount?.pin===Number(inputLoginPin.value)){
    labelWelcome.textContent=`Welcome back,
    ${currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity=100;

    inputLoginUsername.value=inputLoginPin.value='';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

//btnTransfer--------------------------
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();

  const amount=Number(inputTransferAmount.value);
  const receiverAcc=accounts.find(
    acc => acc.username===inputTransferTo.value);
  inputTransferAmount.value=inputTransferTo.value='';

  if(amount > 0 && receiverAcc && 
    currentAccount.balance >= amount && 
    receiverAcc?.username !== currentAccount.username
    ){
    
    currentAccount.movements.push(-amount); //送金者  
    receiverAcc.movements.push(amount);   //受け取り側

    updateUI(currentAccount);


    }
  
});

btnClose.addEventListener('click',function(e){
  e.preventDefault();

  if(inputCloseUsername.value===currentAccount.username 
    && Number(inputClosePin.value)===currentAccount.pin)
    {
      const index=accounts.findIndex(
        acc => acc.username===currentAccount.username
      );
      console.log(index);
      accounts.splice(index,1);

      containerApp.style.opacity=0;

    }
  inputCloseUsername.value=inputClosePin.value='';

});

btnLoan.addEventListener('click',function(e){
  e.preventDefault();

  const amount=Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(
    mov => mov >= amount * 0.1))
  {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value='';
});

//-------------------------------------
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//-----------------------------------

let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();

  displayMovements(currentAccount.movements,!sorted);

  sorted = !sorted;

});

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


const deposits=movements.filter(function(mov,i,arr,){
  return mov > 0;
});

console.log(movements);
console.log(deposits);

const depositsFor=[];
for(const mov of movements) if(mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawals=movements.filter(mov => mov < 0);
console.log(withdrawals);

//---------===-------------------------------


const balance=movements.reduce((acc,cur) => acc + cur,0);
console.log(balance);

let balance2=0;
for(const mov of movements) balance2 += mov;
console.log(balance2);

const max=movements.reduce((acc,mov) => {
  if(acc > mov) return acc;
  else return mov;
},movements[0]);
console.log(max);                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     

//----------------------------------------

const firstWithdrawal=movements.find(mov => mov < 0);

console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account=accounts.find(acc => acc.owner==='Jessica Davis');
console.log(account)

//-------------------------------
console.log(movements);
console.log(movements.includes(-130));

console.log(movements.some(mov =>  mov===-130));
const anyDeposits=movements.some(mov => mov > 0);
console.log(anyDeposits);

//---------------
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

const deposit= mov => mov > 0;
console.log(movements.some(deposit));  //true
console.log(movements.every(deposit)); //true
console.log(movements.filter(deposit)); //表示される

//flat-------------------
const arr=[[1,2,3],[4,5,6],7,8];
console.log(arr.flat());

const arrDeep=[[[1,2],3],[4,[5,6]],7,8];
console.log(arrDeep.flat(2));

const overalbalance=accounts.map(acc => acc.movements)
  .flat().reduce((acc,mov) => acc + mov,0);
console.log(overalbalance);

//sort-----------------------
const owners=['Jonas','Zach','Adam','Martha'];
console.log(owners.sort());
console.log(owners);

console.log(movements);
console.log(movements.sort());  //美しくない

movements.sort((a,b) => {
  if(a > b)return 1;
  if(a < b) return -1;
});
console.log(movements);  //昇順