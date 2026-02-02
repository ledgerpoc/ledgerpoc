using LedgerService as service from '../../srv/ledger-service';
annotate service.Transactions with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : '{i18n>FromAccount}',
                Value : sourceAccount,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>ToAccount}',
                Value : targetAccount,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Amount}',
                Value : amount,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Currency}',
                Value : currency_code,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Status}',
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
            Label : '{i18n>FromAccount}',
            Value : sourceAccount,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>ToAccount}',
            Value : targetAccount,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Amount}',
            Value : amount,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Currency}',
            Value : currency_code,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Status}',
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

