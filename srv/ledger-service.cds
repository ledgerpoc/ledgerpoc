using com.mbec.ledgerpoc as db from '../db/schema';

service LedgerService @(path: '/LedgerService'){
    entity Accounts as projection on db.Accounts;
    entity Transactions as projection on db.Transactions;

    /* For both custom action we are using File binary as input
       For consistency in parsing and file handling logic 
       UI does not have to worry about CSV format changes*/

    // We need company as input for tagging of account to given company
    // It is assumed that Load meeans Overwrite and it is not Delta Load
    action loadBalances(
        @Core.MediaType: 'text/csv' 
        file: LargeBinary, 
        company: String
    )returns {
        StatusMessage : String;
    };

    /*  We dont need to pass the company here as
        validation can happen internally that 
        account belongs to different companies*/
    action processTransactions(
        @Core.MediaType: 'text/csv' 
        file: LargeBinary
    ) returns {
        StatusMessage : String;
    };
    
}