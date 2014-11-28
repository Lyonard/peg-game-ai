var prepareBoard = function (startNode) {
    var container = $('#board_container');
    $('.cell.piece').remove();

    var top = 0;
    for (var i = 0; i < startNode.board.length; i++) {
        var left = 0;
        var topCss = (top == 0) ? top : top + "px";
        for (var j = 0; j < startNode.board.length; j++) {
            var leftCss = (left == 0) ? left : left + "px";
            if (startNode.board[i][j] == 1) {
                $(container).append(
                    "<div class=\"cell piece\" id=\"cell" + i + j + "\"></div>\n"
                );
                $("#cell" + i + j).css({
                    top: "+=" + topCss,
                    left: "+=" + leftCss
                })
            }
            left += 60;
        }
        top += 60;
    }
};

var diffMoves = function (move1, move2) {
    //console.log(move1, move2);
    var startPieces = [];
    var endPiece = null;
    for (var i = 0; i < move1.board.length; i++) {
        for (var j = 0; j < move1.board.length; j++) {
            if (move1.board[i][j] == 1 && move2.board[i][j] == 0) startPieces.push([i, j]);
            else if (move1.board[i][j] == 0 && move2.board[i][j] == 1) endPiece = [i, j];
        }
    }

    //move down from first piece found
    if (startPieces[0][0] + 2 == endPiece[0]) return { start: [startPieces[0][0], startPieces[0][1]],
        middle: [startPieces[1][0], startPieces[1][1]],
        end: endPiece,
        direction: 'down'
    };
    if (startPieces[1][0] + 2 == endPiece[0]) return { start: [startPieces[1][0], startPieces[1][1]],
        middle: [startPieces[0][0], startPieces[0][1]],
        end: endPiece,
        direction: 'down'
    };


    if (startPieces[0][0] - 2 == endPiece[0]) return { start: [startPieces[0][0], startPieces[0][1]],
        middle: [startPieces[1][0], startPieces[1][1]],
        end: endPiece,
        direction: 'up'
    };
    if (startPieces[1][0] - 2 == endPiece[0]) return { start: [startPieces[1][0], startPieces[1][1]],
        middle: [startPieces[0][0], startPieces[0][1]],
        end: endPiece,
        direction: 'up'
    };


    if (startPieces[0][1] + 2 == endPiece[1]) return { start: [startPieces[0][0], startPieces[0][1]],
        middle: [startPieces[1][0], startPieces[1][1]],
        end: endPiece,
        direction: 'right'
    };
    if (startPieces[1][1] + 2 == endPiece[1]) return { start: [startPieces[1][0], startPieces[1][1]],
        middle: [startPieces[0][0], startPieces[0][1]],
        end: endPiece,
        direction: 'right'
    };


    if (startPieces[0][1] - 2 == endPiece[1]) return { start: [startPieces[0][0], startPieces[0][1]],
        middle: [startPieces[1][0], startPieces[1][1]],
        end: endPiece,
        direction: 'left'
    };
    if (startPieces[1][1] - 2 == endPiece[1]) return { start: [startPieces[1][0], startPieces[1][1]],
        middle: [startPieces[0][0], startPieces[0][1]],
        end: endPiece,
        direction: 'left'
    };
}

var doMove = function (moves, moveIndex) {

    var move = moves[moveIndex];
    var startCell = move['start'];
    var middleCell = move['middle'];
    var arrivalCell = move['end'];

    var piece = $('#cell' + startCell[0] + startCell[1] + '');
    var middlePiece = $('#cell' + middleCell[0] + middleCell[1] + '');

    var positionSpace = "120px";

    var transformation = {};
    switch (move['direction']) {
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
    $(piece).css("z-index", 10000)
            .animate(transformation, 1000, function () {
            $(middlePiece).remove();
            $(this).css("z-index",100);
    });

    $(piece).attr("id", "cell" + arrivalCell[0] + "" + arrivalCell[1]);
}

$(function () {
    $('#play').click(function () {
        $(this).addClass('hidden');

        $('#pause').removeClass('hidden');
        playInterval = setInterval(function () {
            if (movesIndex < moves.length) {
                doMove(moves, movesIndex);
                movesIndex++;
            }
        }, 1500);
    });

    $('#pause').on('click', function () {
        if (playInterval != null) {
            clearInterval(playInterval);
            $('#pause').addClass('hidden');
            $('#play').removeClass('hidden');
        }
    });

    $('#stepbackward').click(function () {
        movesIndex--;
        if (movesIndex < 0) movesIndex = 0;
        if (movesIndex >= solution.length) movesIndex = solution.length - 1;
        prepareBoard(solution[movesIndex]);
    });

    $('#stepforward').click(function () {
        movesIndex++;
        if (movesIndex < 0) movesIndex = 0;
        if (movesIndex >= solution.length) movesIndex = solution.length - 1;
        prepareBoard(solution[movesIndex]);
    });

    $('#showrules').on('click', function () {
        if ($('#rules').hasClass('hidden')) {
            $('#rules').removeClass('hidden').addClass('visible');
            $(this).html("Hide rules");
        }
        else {
            $('#rules').removeClass('visible').addClass('hidden');
            $(this).html("Show rules");
        }
    });

});













