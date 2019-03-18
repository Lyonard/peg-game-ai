var init = function () {
    solution       = [];
    moves          = [];
    movesIndex     = 0;
    playInterval   = null;
    humanIsPlaying = true;
    aiIsPlaying    = false;

    startNode = new Node();
    prepareBoard( startNode );
};

var initAI = function () {
    solution = astar( startNode );

    for ( var i = 0; i < solution.length - 1; i++ ) {
        moves.push( diffMoves( solution[ i ], solution[ i + 1 ] ) );
    }
};

var prepareBoard = function ( startNode ) {
    var container = $( '#board_container' );
    $( '.cell.piece' ).remove();

    var top = 0;
    for ( var i = 0; i < startNode.board.length; i++ ) {
        var left   = 0;
        var topCss = (top === 0) ? top : top + "px";
        for ( var j = 0; j < startNode.board.length; j++ ) {
            var leftCss = (left === 0) ? left : left + "px";
            if ( startNode.board[ i ][ j ] === 1 ) {
                $( container ).append(
                    "<div class=\"cell piece\" id=\"cell" + i + j + "\"></div>\n"
                );
                $( "#cell" + i + j ).css( {
                                              top : "+=" + topCss,
                                              left: "+=" + leftCss
                                          } )
            }
            left += 60;
        }
        top += 60;
    }
};

var diffMoves = function ( move1, move2 ) {
    //console.log(move1, move2);
    var startPieces = [];
    var endPiece    = null;
    for ( var i = 0; i < move1.board.length; i++ ) {
        for ( var j = 0; j < move1.board.length; j++ ) {
            if ( move1.board[ i ][ j ] === 1 && move2.board[ i ][ j ] === 0 ) {
                startPieces.push( [ i, j ] );
            }
            else if ( move1.board[ i ][ j ] === 0 && move2.board[ i ][ j ] === 1 ) {
                endPiece = [ i, j ];
            }
        }
    }

    //move down from first piece found
    if ( startPieces[ 0 ][ 0 ] + 2 === endPiece[ 0 ] ) {
        return {
            start    : [ startPieces[ 0 ][ 0 ], startPieces[ 0 ][ 1 ] ],
            middle   : [ startPieces[ 1 ][ 0 ], startPieces[ 1 ][ 1 ] ],
            end      : endPiece,
            direction: 'down'
        };
    }
    if ( startPieces[ 1 ][ 0 ] + 2 === endPiece[ 0 ] ) {
        return {
            start    : [ startPieces[ 1 ][ 0 ], startPieces[ 1 ][ 1 ] ],
            middle   : [ startPieces[ 0 ][ 0 ], startPieces[ 0 ][ 1 ] ],
            end      : endPiece,
            direction: 'down'
        };
    }

    if ( startPieces[ 0 ][ 0 ] - 2 === endPiece[ 0 ] ) {
        return {
            start    : [ startPieces[ 0 ][ 0 ], startPieces[ 0 ][ 1 ] ],
            middle   : [ startPieces[ 1 ][ 0 ], startPieces[ 1 ][ 1 ] ],
            end      : endPiece,
            direction: 'up'
        };
    }
    if ( startPieces[ 1 ][ 0 ] - 2 === endPiece[ 0 ] ) {
        return {
            start    : [ startPieces[ 1 ][ 0 ], startPieces[ 1 ][ 1 ] ],
            middle   : [ startPieces[ 0 ][ 0 ], startPieces[ 0 ][ 1 ] ],
            end      : endPiece,
            direction: 'up'
        };
    }

    if ( startPieces[ 0 ][ 1 ] + 2 === endPiece[ 1 ] ) {
        return {
            start    : [ startPieces[ 0 ][ 0 ], startPieces[ 0 ][ 1 ] ],
            middle   : [ startPieces[ 1 ][ 0 ], startPieces[ 1 ][ 1 ] ],
            end      : endPiece,
            direction: 'right'
        };
    }
    if ( startPieces[ 1 ][ 1 ] + 2 === endPiece[ 1 ] ) {
        return {
            start    : [ startPieces[ 1 ][ 0 ], startPieces[ 1 ][ 1 ] ],
            middle   : [ startPieces[ 0 ][ 0 ], startPieces[ 0 ][ 1 ] ],
            end      : endPiece,
            direction: 'right'
        };
    }

    if ( startPieces[ 0 ][ 1 ] - 2 === endPiece[ 1 ] ) {
        return {
            start    : [ startPieces[ 0 ][ 0 ], startPieces[ 0 ][ 1 ] ],
            middle   : [ startPieces[ 1 ][ 0 ], startPieces[ 1 ][ 1 ] ],
            end      : endPiece,
            direction: 'left'
        };
    }
    if ( startPieces[ 1 ][ 1 ] - 2 === endPiece[ 1 ] ) {
        return {
            start    : [ startPieces[ 1 ][ 0 ], startPieces[ 1 ][ 1 ] ],
            middle   : [ startPieces[ 0 ][ 0 ], startPieces[ 0 ][ 1 ] ],
            end      : endPiece,
            direction: 'left'
        };
    }
};

var doMove = function ( move ) {

    var startCell   = move[ 'start' ];
    var middleCell  = move[ 'middle' ];
    var arrivalCell = move[ 'end' ];

    var piece       = $( '#cell' + startCell[ 0 ] + startCell[ 1 ] + '' );
    var middlePiece = $( '#cell' + middleCell[ 0 ] + middleCell[ 1 ] + '' );

    var positionSpace = "120px";

    var transformation = {};
    switch ( move[ 'direction' ] ) {
        case 'up':
            transformation.top = "-=" + positionSpace;
            break;
        case 'down':
            transformation.top = "+=" + positionSpace;
            break;
        case 'left':
            transformation.left = "-=" + positionSpace;
            break;
        case 'right':
            transformation.left = "+=" + positionSpace;
            break;
        default:
            break;

    }
    $( piece ).css( "z-index", 10000 )
        .animate( transformation, 1000, function () {
            $( middlePiece ).remove();
            $( this ).css( "z-index", 100 );
        } );

    $( piece ).attr( "id", "cell" + arrivalCell[ 0 ] + "" + arrivalCell[ 1 ] );
};

var selectPiece = function ( piece ) {
    var topCss  = Number( $( piece ).css( 'top' ).replace( "px", "" ) );
    var leftCss = Number( $( piece ).css( 'left' ).replace( "px", "" ) );

    $( piece ).addClass( 'selected' )
        .css( {
                  top : (topCss - 2) + "px",
                  left: (leftCss - 2) + "px"
              } )
};

var deselectPiece = function ( piece ) {
    var topCss  = Number( $( piece ).css( 'top' ).replace( "px", "" ) );
    var leftCss = Number( $( piece ).css( 'left' ).replace( "px", "" ) );

    $( piece ).removeClass( 'selected' )
        .css( {
                  top : (topCss + 2) + "px",
                  left: (leftCss + 2) + "px"
              } );
};

$( function () {
    $( 'body' )
        .on( 'click', '#reset', function () {
            $( '#pause' ).trigger( 'click' );
            init();
            initAI();
        } )
        .on( 'click', '#ai_play', function () {
            if ( !aiIsPlaying ) {
                if ( humanIsPlaying ) {
                    $( '#reset' ).trigger( 'click' );
                }
                $( '#board_controls' ).removeClass( 'hidden' );

                aiIsPlaying = true;
                $( '#play' ).trigger( 'click' );

                $( '#ai_play' ).addClass( 'disabled' );
                $( '#human_play' ).removeClass( 'disabled' );
            }
        } )
        .on( 'click', '#human_play', function () {
            if ( !humanIsPlaying ) {
                if ( aiIsPlaying ) {
                    $( '#reset' ).trigger( 'click' );
                }

                $( '#board_controls' ).addClass( 'hidden' );
                $( '#human_play' ).addClass( 'disabled' );
                $( '#ai_play' ).removeClass( 'disabled' );
                humanIsPlaying = true;
            }
        } )
        .on( 'click', '.cell.piece', function () {
            if ( humanIsPlaying ) {
                $( '.cell.piece.selected' ).each( function () {
                    deselectPiece( this );
                } );

                selectPiece( this );
            }
        } )
        .on( 'click', '.cell.empty', function () {
            if ( humanIsPlaying ) {
                var selectedPiece = $( '.cell.piece.selected' );

                if ( selectedPiece.length === 1 ) {
                    var selectedPieceCoords = Number( $( selectedPiece[ 0 ] ).attr( 'id' ).replace( "cell", "" ) );
                    var coords              = Number( $( this ).attr( 'id' ).replace( "empty", "" ) );

                    var x        = (selectedPieceCoords - selectedPieceCoords % 10) / 10;
                    var y        = selectedPieceCoords % 10;
                    var nextMove = null;

                    //right move
                    if ( selectedPieceCoords + 2 === coords ) {
                        nextMove = startNode.moveRight( x, y );
                    }
                    //left move
                    else if ( selectedPieceCoords - 2 === coords ) {
                        nextMove = startNode.moveLeft( x, y );
                    }
                    //up move
                    else if ( selectedPieceCoords - 20 === coords ) {
                        nextMove = startNode.moveUp( x, y );
                    }
                    //down move
                    else if ( selectedPieceCoords + 20 === coords ) {
                        nextMove = startNode.moveDown( x, y );
                    }

                    if ( nextMove !== null ) {
                        var move = diffMoves( startNode, nextMove );

                        deselectPiece( selectedPiece );
                        doMove( move );
                        startNode = nextMove;
                    }
                }
            }
        } )
        .on( 'click', '#showrules', function () {
            var rulesDiv = $( '#rules' );
            if ( rulesDiv.hasClass( 'height_0' ) ) {
                rulesDiv.removeClass( 'height_0' ).addClass( 'visible' );
                $( this ).html( "Hide rules" );
            }
            else {
                rulesDiv.removeClass( 'visible' ).addClass( 'height_0' );
                $( this ).html( "Show rules" );
            }
        } )
        .on( 'click', '#play', function () {
            if ( aiIsPlaying ) {
                $( this ).addClass( 'height_0' );

                $( '#pause' ).removeClass( 'height_0' );
                playInterval = setInterval( function () {
                    if ( movesIndex < moves.length ) {
                        doMove( moves[ movesIndex ] );
                        movesIndex++;
                    }
                }, 1500 );
            }
        } )
        .on( 'click', '#pause', function () {
            if ( aiIsPlaying && playInterval !== null ) {
                clearInterval( playInterval );
                $( '#pause' ).addClass( 'height_0' );
                $( '#play' ).removeClass( 'height_0' );
            }
        } )
        .on( 'click', '#stepbackward', function () {
            if ( aiIsPlaying ) {
                movesIndex--;
                if ( movesIndex < 0 ) {
                    movesIndex = 0;
                }
                if ( movesIndex >= solution.length ) {
                    movesIndex = solution.length - 1;
                }
                prepareBoard( solution[ movesIndex ] );
            }
        } )
        .on( 'click', '#stepforward', function () {
            if ( aiIsPlaying ) {
                movesIndex++;
                if ( movesIndex < 0 ) {
                    movesIndex = 0;
                }
                if ( movesIndex >= solution.length ) {
                    movesIndex = solution.length - 1;
                }
                prepareBoard( solution[ movesIndex ] );
            }
        } )

} );













