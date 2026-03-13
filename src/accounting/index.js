#!/usr/bin/env node

// Simple CLI account management system (ported from COBOL)
// Preserves original menu structure and business rules.

const path = require('path');
const readline = require('readline');

const accounting = require('./accounting');

const STORAGE_FILE = path.join(__dirname, 'balance.txt');

function showMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  let balance = accounting.readBalance(STORAGE_FILE);

  while (true) {
    showMenu();
    const choice = await prompt('Enter your choice (1-4): ');

    if (choice === '2' || choice === '3') {
      const promptLabel = choice === '2' ? 'Enter credit amount: ' : 'Enter debit amount: ';
      const amountInput = await prompt(promptLabel);
      const result = accounting.processMenuChoice(choice, balance, {
        amount: amountInput,
        storageFile: STORAGE_FILE,
      });

      balance = result.balance;
      console.log(result.message);
      if (result.exit) process.exit(0);
    } else {
      const result = accounting.processMenuChoice(choice, balance, {
        storageFile: STORAGE_FILE,
      });

      balance = result.balance;
      console.log(result.message);
      if (result.exit) process.exit(0);
    }

    console.log();
  }
}

if (require.main === module) {
  main();
}
