namespace com.mbec.ledgerpoc;
using { cuid, managed, Currency } from '@sap/cds/common';

/* Leaving Company Entity out of scope 
   as it will be over engineering for this PoC */

// Transaction Type 
type TransType: String(1) enum{
    TRANSFER        = 'T';
    BALANCE_LOAD    = 'L';
}

// Company Customer's Accounts
entity Accounts: managed {
    key accountNumber  : String(16) @mandatory;
        company        : String(20) @mandatory;
        balance        : Decimal(21,2); 
        currency       : Currency;
        lastTransType  : TransType  @assert.range;
}

// Transaction Status 
type TransStatus: String(1) enum{
    SUCCESS  = 'S';
    REJECTED = 'R';
    PENDING  = 'P';
}

// Transactions
entity Transactions: cuid, managed {
    sourceAccount : String(16)     @mandatory;
    targetAccount : String(16)     @mandatory;
    amount        : Decimal(21,2); @mandatory
    currency      : Currency;
    status        : TransStatus    @assert.range;
}


