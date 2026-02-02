using LedgerService as service from '../../srv/ledger-service';
annotate service.Accounts with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : '{i18n>AccountNumber}',
                Value : accountNumber,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Company}',
                Value : company,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>AccountBalance}',
                Value : balance,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Currency}',
                Value : currency_code,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>LastUpdateType}',
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
            Label : '{i18n>AccountNumber}',
            Value : accountNumber,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Company}',
            Value : company,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>AccountBalance}',
            Value : balance,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Currency}',
            Value : currency_code,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>LastUpdateType}',
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

