sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/mbec/ledgerpoc/accounts/test/integration/pages/AccountsList",
	"com/mbec/ledgerpoc/accounts/test/integration/pages/AccountsObjectPage"
], function (JourneyRunner, AccountsList, AccountsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/mbec/ledgerpoc/accounts') + '/test/flp.html#app-preview',
        pages: {
			onTheAccountsList: AccountsList,
			onTheAccountsObjectPage: AccountsObjectPage
        },
        async: true
    });

    return runner;
});

