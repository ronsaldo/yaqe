#!/bin/sh

SET_NAME=$1
DIR=$2
OUTPUT=$3

FILES=$(find $DIR | grep .svg)
SET_SIZE=48

cat > $OUTPUT << EOH
<!--
Icon set generated automatically
-->
<link rel="import" href="../../lib/iron-icon/iron-icon.html">
<link rel="import" href="../../lib/iron-iconset-svg/iron-iconset-svg.html">

<iron-iconset-svg name="$SET_NAME" size="$SET_SIZE">
EOH

for F in $FILES; do
    ICON_NAME=$(basename "$F" | sed 's/.svg//g' )
    #echo "$F -> $ICON_NAME"
    
    cat $F | sed -r "s/id=\"svg.*\"/id=\"$ICON_NAME\"/" >> $OUTPUT

done

cat >> $OUTPUT << EOF
</iron-iconset-svg>
EOF

