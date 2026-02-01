sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'com.mbec.ledgerpoc.transactions',
            componentId: 'TransactionsObjectPage',
            contextPath: '/Transactions'
        },
        CustomPageDefinitions
    );
});