    const cds = require('@sap/cds');
    const csv = require('csv-parser');
    const {
        Readable
    } = require('stream');

    class LedgerService extends cds.ApplicationService{
        init(){
            // Load Balance
            /* Company Entity is treated as out of scope for schallenge
            therefore, any validation related to it is also treated out of scope */
            this.on('loadBalances', req => this.loadAccountBalances(req));

            // Process Transactions
            this.on('processTransactions', req => this.processTransfers(req));   
            return super.init();
        }

        // Parse the CSV File
        async parseCSV(buffer, fileCategory) {
            const rows = [];
            const fileLoadHeaders = ['Account', 'Balance', 'Currency'];
            const fileTransferHeaders = ['From','To', 'Amount', 'Currency'];
            let fileHeaders = (fileCategory === "Load") ? fileLoadHeaders : fileTransferHeaders;

            await new Promise((resolve, reject) => {
                Readable.from(buffer)
                    .pipe(csv({
                        headers: fileHeaders, 
                        skipLines: 0
                    }))
                    .on('data', r => rows.push(r))
                    .on('end', resolve)
                    .on('error', reject);
            });
            return rows;
        }

        // Load Balances
        async loadAccountBalances(req) {
            const { Accounts } = this.entities;
            const {
                file,
                company
            } = req.data;
            const txn = cds.tx(req);
            const buffer = Buffer.from(file, 'base64');
            const rows = await this.parseCSV(buffer, "Load");
            
            //console.log(Object.keys(cds.model.definitions).filter(k => k.includes('TransType')));
            const TransType = cds.model.definitions['com.mbec.ledgerpoc.TransType'].enum

            //console.log(file);
            //console.log(buffer);
            //console.log(company);
            //console.log(rows);
            //console.log(TransType);
            // Validate Company is supplied
            if (!company || company.trim() === "") {
                return req.error(400, `Validation Error: Company cannot be blank`);
            }

            for (const row of rows) {
                //console.log("row",row);
                // Validate Account NUmber is not blank
                if (!row.Account || row.Account.trim() === "") {
                    return req.error(400, `Validation Error: Account Number cannot be blank at row ${rows.indexOf(row) + 1}`);
                }


                const existing = await txn.read(Accounts)
                    .where({
                        accountNumber: row.Account,
                        company
                    });


                if (existing.length) {
                    await txn.update(Accounts)
                        .set({
                            balance: Number(row.Balance),
                            lastTransType: TransType.BALANCE_LOAD.val
                        })
                        .where({
                            accountNumber: row.Account,
                            company
                        });
                } else {
                    //console.log("before trans:",row);
                    /*console.log({
                        accountNumber: row.Account,
                        company,
                        balance: Number(row.Balance),
                        currency: { code: row.Currency || 'AUD' },
                        lastTransType: TransType.BALANCE_LOAD.val
                    });*/
                    
                    await txn.create(Accounts, {
                        accountNumber: row.Account,
                        company,
                        balance: Number(row.Balance),
                        currency: { code: row.Currency || 'AUD' },
                        lastTransType: TransType.BALANCE_LOAD.val
                    });
                }
            }

            return {
                StatusMessage: `Loaded balance successfully for ${rows.length} records`
            }
        }

        // Process Transfers
        async processTransfers(req) {
            const { Accounts, Transactions } = this.entities;
            const {
                file
            } = req.data;

            const txn = cds.tx(req);
            const buffer = Buffer.from(file, 'base64');
            const rows = await this.parseCSV(buffer, "Transfer");
            const TransType = cds.model.definitions['com.mbec.ledgerpoc.TransType'].enum
            const TransStatus = cds.model.definitions['com.mbec.ledgerpoc.TransStatus'].enum
            
            //console.log("Rows:", rows);
            let successRecords = 0;
            let errorRecords = 0;
            for (const row of rows) {
                const amount = Number(row.Amount);


                const [from] = await txn.read(Accounts)
                    .where({
                        accountNumber: row.From
                    });
                const [to] = await txn.read(Accounts)
                    .where({
                        accountNumber: row.To
                    });

                //console.log("From:", from);
                //console.log("To:", to);
                // Validate Account
                let errorDetails = [];
                if(!from){ errorDetails.push(`Source Account (${row.From})`); }
                if(!to){ errorDetails.push(`Target Account (${row.To})`); }
                if (!from || !to) {
                    throw req.error(400, `Invalid ${errorDetails.join(' and ')} at row ${rows.indexOf(row) + 1}`);
                }
                
                if (from.balance - amount < 0) {
                    errorRecords += 1;
                    await txn.create(Transactions, {
                        sourceAccount: row.From,
                        targetAccount: row.To,
                        amount,
                        currency: from.currency,
                        status: TransStatus.REJECTED.val
                    });
                    continue;
                }

                let company = from.company;
                await txn.update(Accounts)
                    .set({
                        balance: {
                            '-=': amount
                        },
                        lastTransType: TransType.TRANSFER.val
                    })
                    .where({
                        accountNumber: row.From,
                        company
                    });


                await txn.update(Accounts)
                    .set({
                        balance: {
                            '+=': amount
                        },
                        lastTransType: TransType.TRANSFER.val
                    })
                    .where({
                        accountNumber: row.To,
                        company
                    });

                // Assumed that current scope allows to update single transaction
                // There is no need to create Ledger Credit & Debit Transaction
                successRecords += 1;
                await txn.create(Transactions, {
                    sourceAccount: row.From,
                    targetAccount: row.To,
                    amount,
                    currency: { code: row.currency },
                    status: TransStatus.SUCCESS.val
                });
            }
            let messages = [];
            if(successRecords > 0){ messages.push(`${ successRecords} processed successfully`)}
            if(errorRecords > 0){ messages.push(`${errorRecords} rejected`);}
            let returnMessage = `Out of ${rows.length} records ${messages.join(' and ')}`;
            return {
                StatusMessage: returnMessage
            };
        }

    }

    module.exports = LedgerService;