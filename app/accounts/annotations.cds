using LedgerService as service from '../../srv/ledger-service';
annotate service.Accounts with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'accountNumber',
                Value : accountNumber,
            },
            {
                $Type : 'UI.DataField',
                Label : 'company',
                Value : company,
            },
            {
                $Type : 'UI.DataField',
                Label : 'balance',
                Value : balance,
            },
            {
                $Type : 'UI.DataField',
                Label : 'currency_code',
                Value : currency_code,
            },
            {
                $Type : 'UI.DataField',
                Label : 'lastTransType',
                Value : lastTransType,
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
            Label : 'Account Number',
            Value : accountNumber,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Company',
            Value : company,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Account Balance',
            Value : balance,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Currency',
            Value : currency_code,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Last Update Type',
            Value : lastTransType,
        },
    ],
    UI.SelectionFields : [
        company,
    ],
);

annotate service.Accounts with {
    company @Common.Label : 'Company'
};

