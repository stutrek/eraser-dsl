grammar EraserDsl

entry Model:
    (nodes+=(NodeDeclaration) | connections+=(Connection) | Newline)*;

NodeDeclaration:
    name=ID ('[' (settings+=Setting ','?)* ']')? ('{' Newline+ (children+=NodeDeclaration*)* '}')? (Newline+ | EOF);

Setting:
    key=ID ':' value=ID|EscapedText;

Connection:
    (node=[RefItem:ID] ('[' (settings+=Setting ','?)* ']')? ','?) connectionType=ConnectionToken (to+=ConnectionTarget)+;

ConnectionTarget:
    (node=[RefItem:ID] ('[' (settings+=Setting ','?)* ']')? ','?) (':'message=ID)? connectionType=ConnectionToken?;

type RefItem = NodeDeclaration | Connection | ConnectionTarget;


hidden terminal WS: /[ \t]+/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /(\/\/)[^\n\r]*/;
hidden terminal SL_COMMENT_HASH: /#[^\n\r]*/;


terminal ID: /([^:{}[\]"<>,\n-]+[^:{}[\]"<>,\n]{0,1})+[^:{}[\]"<>,\n\- ]|[^:{}[\]"<>,\n- ]{1,1}/;
terminal ConnectionToken: /[<>-]+/;
terminal EscapedText: /"[^"]+"/;
terminal Newline: /\n/;
