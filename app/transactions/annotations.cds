using LedgerService as service from '../../srv/ledger-service';
annotate service.Transactions with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'sourceAccount',
                Value : sourceAccount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'targetAccount',
                Value : targetAccount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'amount',
                Value : amount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'currency_code',
                Value : currency_code,
            },
            {
                $Type : 'UI.DataField',
                Label : 'status',
                Value : status,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'From Account',
            Value : sourceAccount,
        },
        {
            $Type : 'UI.DataField',
            Label : 'To Account',
            Value : targetAccount,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Amount',
            Value : amount,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Currency',
            Value : currency_code,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : status,
        },
    ],
    UI.SelectionFields : [
        status,
    ],
);

annotate service.Transactions with {
    status @Common.Label : 'Status'
};

annotate service.Transactions with {
    sourceAccount @Common.Label : 'sourceAccount'
};

