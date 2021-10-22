export interface Column {
    "table_catalog": string;
    "table_schema":  string;
    "table_name":  string;
    "column_name": string;
    "ordinal_position":  string; // "1"
    "column_default": string;
    "is_nullable":  string;
    "data_type": string;
    "character_maximum_length": number | null;
    "character_octet_length":  number | null;
    "numeric_precision":  number | null;
    "numeric_precision_radix":  number | null;
    "numeric_scale":  number | null;
    "datetime_precision":  number | null;
    "interval_type": any | null;
    "interval_precision":  number | null;
    "character_set_catalog":  any | null;
    "character_set_schema":  any | null;
    "character_set_name":  any | null;
    "collation_catalog":  any | null;
    "collation_schema":  any | null;
    "collation_name":  any | null;
    "domain_catalog":  any | null;
    "domain_schema":  any | null;
    "domain_name":  any | null;
    "udt_catalog": string;
    "udt_schema": string;
    "udt_name": string;
    "scope_catalog":  any | null;
    "scope_schema":  any | null;
    "scope_name":  any | null;
    "maximum_cardinality":  any | null;
    "dtd_identifier": string; // "1"
    "is_self_referencing": string; // "NO"
    "is_identity": string; // "NO"
    "identity_generation":  any | null;
    "identity_start":  any | null;
    "identity_increment":  any | null;
    "identity_maximum":  any | null;
    "identity_minimum":  any | null;
    "identity_cycle": string; // "NO"
    "is_generated": string; // "NEVER",
    "generation_expression":  any | null;
    "is_updatable": string; //"YES"
}

