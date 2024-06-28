#! /usr/bin/env node
import inquirer from "inquirer";

interface bankAccount{
    accountNum: number,
    accountBalance: number;

}

interface customer{
    firstName:string;
    lastName:string;
    accountNum:number;
}
class bank{
    customers: customer[] = [];
    accounts: bankAccount[] = [];

    addCustomer(firstName:string, lastName:string, accountNum:number){
        this.customers.push({firstName, lastName, accountNum});
    }
    addAccount(account: bankAccount){
        this.accounts.push(account);
    }
    getAccount(accountNum: number): bankAccount | undefined {
        return this.accounts.find(acc => acc.accountNum === accountNum);
    }
    transaction(accObj:bankAccount){
        this.accounts = this.accounts.map(acc => acc.accountNum === accObj.accountNum? accObj : acc)
    }
}
let unitedBank = new bank();

const sampleAccounts : bankAccount[] = [

    { accountNum : 10001, accountBalance: 2000 },
    { accountNum : 10002, accountBalance: 4000 },
];
sampleAccounts.forEach(account => unitedBank.addAccount(account));
async function promptUserName(): Promise<{ firstName: string; lastName: string }> {
    const responseName = await inquirer.prompt([{
        name:"firstName",
        type:"input",
        message:"Enter your first name",
    },{
        name:"lastName",
        type:"input",
        message:"Enter your last name",
    }]);
    return responseName;
}
async function bankService(bank: bank){
    do{
        const service = await inquirer.prompt(
            [
                {
                    name:"select",
                    type:"list",
                    message:"Select a service",
                    choices:["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
                }
            ]
        );

        if (service.select === "View Balance"){
            let response = await inquirer.prompt([{
                name:"accountNum",
                type:"input",
                message:"Enter your account number",
            }]);
            const account = bank.accounts.find(
                (acc) => acc.accountNum == parseInt(response.accountNum, 10),
            );

            if (!account){
                console.log("Invalid Account Number");
            }else{
                const UserName = await promptUserName();
             console.log(`Dear "${UserName.firstName} ${UserName.lastName}", your account balance is $${account?.accountBalance}`);
            }
        }else if(service.select === "Cash Withdraw"){
            let response = await inquirer.prompt([{
                name:"accountNum",
                type:"input",
                message:"Enter Your Account Number",
            }]);
            const account = bank.accounts.find(
                (acc) => acc.accountNum === parseInt(response.accountNum, 10),
            );
            if (!account){
                console.log("Invalid Account Number");
            }
            if (account){
                let answer = await inquirer.prompt([{
                    name:"amount",
                    type:"number",
                    message:"Enter the amount to withdraw",
                }]);
                if(answer.amount > account.accountBalance){
                    console.log("Insufficient Balance");
                }else{
                    let newBalance = account.accountBalance - answer.amount;
                    bank.transaction({
                        accountNum: account.accountNum,
                        accountBalance: newBalance,
                    });
                    console.log("Withdrawl Successful");
                }
            }
        }else if(service.select === "Cash Deposit"){
            let response = await inquirer.prompt([{
                name:"accountNum",
                type:"input",
                message:"Enter the account number to deposit",
            }]);
            let account = bank.accounts.find(
                (acc) => acc.accountNum == parseInt(response.accountNum, 10),
            );
            if(!account){
                console.log("Invalid Account Number");
            }else {
                let answer = await inquirer.prompt([{
                    name:"amount",
                    type:"number",
                    message:"Enter the amount to deposit",
                }]);
                let newBalance = account.accountBalance + answer.amount;
                bank.transaction({
                    accountNum: account.accountNum,
                    accountBalance: newBalance,
                })
                console.log("Deposit Successful"); 
            }
        }else if(service.select === "Exit"){
            return;
        }
    }while(true);
}
bankService(unitedBank);