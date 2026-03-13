const fs = require('fs');
const path = require('path');

const DEFAULT_STORAGE_FILE = path.join(__dirname, 'balance.txt');
const INITIAL_BALANCE = 1000.0;

function formatBalance(amount) {
  // COBOL display uses a zero-padded format like 001000.00
  return amount.toFixed(2).padStart(9, '0');
}

function readBalance(storageFile = DEFAULT_STORAGE_FILE) {
  try {
    const content = fs.readFileSync(storageFile, 'utf8').trim();
    const parsed = parseFloat(content);
    return Number.isNaN(parsed) ? INITIAL_BALANCE : parsed;
  } catch (err) {
    // If file does not exist or is invalid, initialize with default.
    return INITIAL_BALANCE;
  }
}

function writeBalance(amount, storageFile = DEFAULT_STORAGE_FILE) {
  fs.writeFileSync(storageFile, formatBalance(amount), 'utf8');
}

function credit(balance, amount) {
  if (Number.isNaN(amount) || amount <= 0) {
    return {
      success: false,
      balance,
      message: 'Invalid amount. Please enter a positive number.',
    };
  }

  const newBalance = balance + amount;
  return {
    success: true,
    balance: newBalance,
    message: `Amount credited. New balance: ${formatBalance(newBalance)}`,
  };
}

function debit(balance, amount) {
  if (Number.isNaN(amount) || amount <= 0) {
    return {
      success: false,
      balance,
      message: 'Invalid amount. Please enter a positive number.',
    };
  }

  if (balance < amount) {
    return {
      success: false,
      balance,
      message: 'Insufficient funds for this debit.',
    };
  }

  const newBalance = balance - amount;
  return {
    success: true,
    balance: newBalance,
    message: `Amount debited. New balance: ${formatBalance(newBalance)}`,
  };
}

function processMenuChoice(choice, balance, { amount, storageFile = DEFAULT_STORAGE_FILE } = {}) {
  switch (choice) {
    case '1':
      return {
        exit: false,
        success: true,
        balance,
        message: `Current balance: ${formatBalance(balance)}`,
      };

    case '2': {
      const num = parseFloat(amount);
      const result = credit(balance, num);
      if (result.success) {
        writeBalance(result.balance, storageFile);
      }
      return { exit: false, ...result };
    }

    case '3': {
      const num = parseFloat(amount);
      const result = debit(balance, num);
      if (result.success) {
        writeBalance(result.balance, storageFile);
      }
      return { exit: false, ...result };
    }

    case '4':
      return {
        exit: true,
        success: true,
        balance,
        message: 'Exiting the program. Goodbye!',
      };

    default:
      return {
        exit: false,
        success: false,
        balance,
        message: 'Invalid choice. Please enter a number between 1 and 4.',
      };
  }
}

module.exports = {
  DEFAULT_STORAGE_FILE,
  INITIAL_BALANCE,
  formatBalance,
  readBalance,
  writeBalance,
  credit,
  debit,
  processMenuChoice,
};
