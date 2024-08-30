grammar EraserErd

entry Model:
    (tables+=(TableDeclaration) | connections+=(ErdConnection) | Newline)*;

TableDeclaration:
    name=ID ('[' (settings+=Setting ','?)* ']')? ('{' Newline* (fields+=FieldDefinition*)* '}')? (Newline | EOF);

FieldDefinition:
    name=ID type=ID (keyType=ID)? Newline+;

Setting:
    key=ID ':' value=ID|EscapedText;

ErdConnection:
    from=ErdReference connectionType=ConnectionToken to=ErdReference ','? (Newline | EOF);

ErdReference: 
    table=ErdTableReference ('.' field=ErdFieldReference)?;

ErdTableReference: 
    table=[TableConnectionItem:ID];

ErdFieldReference: 
    field=[FieldConnectionItem:ID];

type TableConnectionItem = TableDeclaration | ErdTableReference;
type FieldConnectionItem = FieldDefinition | ErdFieldReference;

hidden terminal WS: /[ \t]+/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /(\/\/)[^\n\r]*/;
hidden terminal SL_COMMENT_HASH: /#[^\n\r]*/;

terminal ID: /\w+/;
terminal ConnectionToken: /[<>-]+/;
terminal EscapedText: /"[^"]+"/;
terminal Newline: /\r?\n/;
