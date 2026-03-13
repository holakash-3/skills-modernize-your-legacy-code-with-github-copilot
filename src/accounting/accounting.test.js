const fs = require('fs');
const os = require('os');
const path = require('path');
const accounting = require('./accounting');

function makeTempFile() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'acct-test-'));
  return path.join(dir, 'balance.txt');
}

describe('Accounting core logic', () => {
  test('TC-01: View current balance (initial value)', () => {
    const storageFile = makeTempFile();
    const balance = accounting.readBalance(storageFile);
    expect(balance).toBe(accounting.INITIAL_BALANCE);
    expect(accounting.formatBalance(balance)).toBe('001000.00');
  });

  test('TC-02: Credit account increases balance', () => {
    const storageFile = makeTempFile();
    const initial = accounting.readBalance(storageFile);
    const result = accounting.credit(initial, 250.0);

    expect(result.success).toBe(true);
    expect(result.balance).toBe(1250.0);
    accounting.writeBalance(result.balance, storageFile);

    const persisted = accounting.readBalance(storageFile);
    expect(persisted).toBe(1250.0);
    expect(accounting.formatBalance(persisted)).toBe('001250.00');
  });

  test('TC-03: Debit account decreases balance when funds sufficient', () => {
    const storageFile = makeTempFile();
    const initial = accounting.readBalance(storageFile);
    const result = accounting.debit(initial, 250.0);

    expect(result.success).toBe(true);
    expect(result.balance).toBe(750.0);
    accounting.writeBalance(result.balance, storageFile);

    const persisted = accounting.readBalance(storageFile);
    expect(persisted).toBe(750.0);
    expect(accounting.formatBalance(persisted)).toBe('000750.00');
  });

  test('TC-04: Debit rejected when funds insufficient', () => {
    const storageFile = makeTempFile();
    const initial = accounting.readBalance(storageFile);
    const result = accounting.debit(initial, 1500.0);

    expect(result.success).toBe(false);
    expect(result.balance).toBe(initial);
    expect(result.message).toMatch(/Insufficient funds/);

    // Ensure balance was not changed on disk
    const persisted = accounting.readBalance(storageFile);
    expect(persisted).toBe(initial);
  });

  test('TC-05: Menu input validation - invalid choice', () => {
    const storageFile = makeTempFile();
    const initial = accounting.readBalance(storageFile);
    const result = accounting.processMenuChoice('9', initial, { storageFile });

    expect(result.success).toBe(false);
    expect(result.exit).toBe(false);
    expect(result.message).toMatch(/Invalid choice/);
    expect(result.balance).toBe(initial);
  });

  test('TC-06: Persistence - changes saved between operations', () => {
    const storageFile = makeTempFile();
    const initial = accounting.readBalance(storageFile);

    const creditResult = accounting.credit(initial, 200.0);
    expect(creditResult.success).toBe(true);
    accounting.writeBalance(creditResult.balance, storageFile);

    const internalRead = accounting.readBalance(storageFile);
    expect(internalRead).toBe(1200.0);
  });

  test('TC-07: Persistence - balance persists across runs', () => {
    const storageFile = makeTempFile();
    const initial = accounting.readBalance(storageFile);

    const creditResult = accounting.credit(initial, 123.45);
    expect(creditResult.success).toBe(true);
    accounting.writeBalance(creditResult.balance, storageFile);

    // Simulate a new run
    const newRunBalance = accounting.readBalance(storageFile);
    expect(newRunBalance).toBe(1123.45);
  });

  test('TC-08: Exit application gracefully', () => {
    const storageFile = makeTempFile();
    const initial = accounting.readBalance(storageFile);
    const result = accounting.processMenuChoice('4', initial, { storageFile });

    expect(result.exit).toBe(true);
    expect(result.success).toBe(true);
    expect(result.message).toMatch(/Goodbye/);
    expect(result.balance).toBe(initial);
  });
});
