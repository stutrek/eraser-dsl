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
    table=ErdConnectionTableName ('.' field=ErdConnectionFieldName)? connectionType=ConnectionToken (to+=ErdConnectionTarget) (Newline | EOF);

ErdConnectionTarget:
    table=ErdConnectionTableName ('.' field=ErdConnectionFieldName)? ','?;

ErdConnectionFieldName:
    field=[FieldConnectionItem:ID];

ErdConnectionTableName:
    table=[TableConnectionItem:ID];

type TableConnectionItem = TableDeclaration | ErdConnection | ErdConnectionTarget;
type FieldConnectionItem = FieldDefinition | ErdConnectionFieldName;


hidden terminal WS: /[ \t]+/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /(\/\/)[^\n\r]*/;
hidden terminal SL_COMMENT_HASH: /#[^\n\r]*/;

terminal ID: /([^:{}[\]"<>,\n -]+[^:{}[\]"<>,\n .]{0,1})+[^:{}[\]"<>,\n .-]|[^:{}[\]"<>,\n .-]{1,1}/;
terminal ConnectionToken: /[<>-]+/;
terminal EscapedText: /"[^"]+"/;
terminal Newline: /\n/;
