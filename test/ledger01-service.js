    const cds = require('@sap/cds');
    const csv = require('csv-parser');
    const {
        Readable
    } = require('stream');



    
    module.exports = cds.service.impl(async function() {
        const {
            Accounts,
            Transactions
    } = this.entities;


    async function parseCSV(buffer, fileCategory) {
        const rows = [];
        const fileLoadHeaders = ['Account', 'Balance', 'Currency'];
        const fileTransferHeaders = ['From','To', 'Amount', 'Currency'];

        if(fileCategory === "Load"){
            fileHeaders = fileLoadHeaders;
        }if(fileCategory === "Transfer"){
            fileHeaders = fileTransferHeaders;
        }
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

    // Load Balance
    /* Company Entity is treated as out of scope for schallenge
       therefore, any validation related to it is also treated out of scope */
    this.on('loadBalances', async (req) => {
        const {
            file,
            company
        } = req.data;
        const txn = cds.tx(req);
        const buffer = Buffer.from(file, 'base64');
        const rows = await parseCSV(buffer, "Load");

        //console.log(Object.keys(cds.model.definitions).filter(k => k.includes('TransType')));
        const TransType = cds.model.definitions['com.mbec.ledgerpoc.TransType'].enum

        //console.log(file);
        //console.log(buffer);
        //console.log(company);
        //console.log(rows);
        //console.log(TransType);
        
        for (const row of rows) {
            console.log("row",row);
            const existing = await txn.read(Accounts)
                .where({
                    accountNumber: row.Account,
                    company
                });


            if (existing.length) {
                await txn.update(Accounts)
                    .set({
                        balance: Number(row.Balance),
                        lastTransType: TransType.BALANCE_LOAD
                    })
                    .where({
                        accountNumber: row.Account,
                        company
                    });
            } else {
                console.log("before trans:",row);
                console.log({
                    accountNumber: row.Account,
                    company,
                    balance: Number(row.Balance),
                    currency: { code: row.Currency || 'AUD' },
                    lastTransType: TransType.BALANCE_LOAD
                });
                await txn.create(Accounts, {
                    accountNumber: row.Account,
                    company,
                    balance: Number(row.Balance),
                    currency: { code: row.Currency || 'AUD' },
                    lastTransType: TransType.BALANCE_LOAD
                });
            }
        }

        return {
            loaded: rows.length
        };
    });

    // Process Transactions
    this.on('processTranactions', async (req) => {
        const {
            file,
            company
        } = req.data;
        const txn = cds.tx(req);
        const rows = await parseCSV(file, "Transfer");
        const TransStatus = cds.model.definitions['com.mbec.ledgerpoc.TransStatus'].enum

        for (const row of rows) {
            const amount = Number(row.Amount);


            const [from] = await txn.read(Accounts)
                .where({
                    accountNumber: row.From,
                    company
                });
            const [to] = await txn.read(Accounts)
                .where({
                    accountNumber: row.To,
                    company
                });


            if (!from || !to) {
                throw req.error(400, 'Invalid account for company');
            }


            if (from.balance - amount < 0) {
                await txn.create(Transactions, {
                    sourceAccount: row.From,
                    targetAccount: row.To,
                    amount,
                    currency: from.currency,
                    status: TransStatus.REJECTED
                });
                continue;
            }


            await txn.update(Accounts)
                .set({
                    balance: {
                        '-=': amount
                    },
                    lastTransType: TransType.TRANSFER
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
                    lastTransType: TransType.TRANSFER
                })
                .where({
                    accountNumber: row.To,
                    company
                });


            await txn.create(Transactions, {
                sourceAccount: row.From,
                targetAccount: row.To,
                amount,
                currency: { code: row.currency },
                status: TransStatus.SUCCESS
            });
        }


        return {
            processed: rows.length
        };
    });
});