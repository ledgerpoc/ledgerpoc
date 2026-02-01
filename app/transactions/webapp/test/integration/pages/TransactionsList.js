sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'com.mbec.ledgerpoc.transactions',
            componentId: 'TransactionsList',
            contextPath: '/Transactions'
        },
        CustomPageDefinitions
    );
});