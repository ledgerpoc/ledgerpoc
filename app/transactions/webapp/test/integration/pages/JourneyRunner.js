sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/mbec/ledgerpoc/transactions/test/integration/pages/TransactionsList",
	"com/mbec/ledgerpoc/transactions/test/integration/pages/TransactionsObjectPage"
], function (JourneyRunner, TransactionsList, TransactionsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/mbec/ledgerpoc/transactions') + '/test/flp.html#app-preview',
        pages: {
			onTheTransactionsList: TransactionsList,
			onTheTransactionsObjectPage: TransactionsObjectPage
        },
        async: true
    });

    return runner;
});

