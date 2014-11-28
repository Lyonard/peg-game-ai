Array.prototype.clone = function () {
    return JSON.parse(JSON.stringify(this));
};

Array.prototype.addToSet = function (elemArr) {
    var i = 0;
    var found = false;
    while (i < this.length && !found) {
        if (this[i][0] == elemArr[0] && this[i][1] == elemArr[1]) found = true;
        i++;
    }
    if (!found) this.push(elemArr);
}

var Node = function (board, g) {
    if (board == null) {
        board = [
            [2, 2, 1, 1, 1, 2, 2],
            [2, 2, 1, 1, 1, 2, 2],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [2, 2, 1, 1, 1, 2, 2],
            [2, 2, 1, 1, 1, 2, 2]
        ];
    }

    if (g == null) g = 0;

    this.board = board;
    this.g = g;
    this.h = this.heuristic();
    this.parent = null;
    this.debug = null;
};

//a piece is isolated iff the 8 nearby cells are empty or walls
Node.prototype.roundedBy = function (x, y, pieceType) {
    if (pieceType == null) pieceType = 0;

    return typeof this.board[x + 1] != 'undefined' && typeof this.board[x + 1][y] != 'undefined' && this.board[x + 1][y] == pieceType &&
        typeof this.board[x - 1] != 'undefined' && typeof this.board[x - 1][y] != 'undefined' && this.board[x - 1][y] == pieceType &&
        typeof this.board[x] != 'undefined' && typeof this.board[x][y + 1] != 'undefined' && this.board[x][y + 1] == pieceType &&
        typeof this.board[x] != 'undefined' && typeof this.board[x][y - 1] != 'undefined' && this.board[x][y - 1] == pieceType;
};

Node.prototype.isolatedPeg = function (x, y) {
    var isolated = this.roundedBy(x, y, 0);

//    (isolated) ? console.log(x,y) : null;
    return isolated;
};

Node.prototype.isolatedSpace = function (x, y) {
    return this.roundedBy(x, y, 1);
};

Node.prototype.isFronteer = function (x, y) {
    return this.board[x][y] == 1 &&
        (
            typeof this.board[x - 1] == 'undefined' ||
                typeof this.board[x + 1] == 'undefined' ||
                typeof this.board[x - 1][y] == 'undefined' ||
                typeof this.board[x + 1][y] == 'undefined' ||
                typeof this.board[x][y + 1] == 'undefined' ||
                typeof this.board[x][y - 1] == 'undefined' ||
                this.board[x - 1][y] != 1 ||
                this.board[x + 1][y] != 1 ||
                this.board[x][y + 1] != 1 ||
                this.board[x][y - 1] != 1
            );

};

Node.prototype.getPerimeter = function () {
    var perimeterSize = 0;
    var perimeterSet = [];
    for (var i = 0; i < this.board.length; i++) {
        for (var j = 0; j < this.board.length; j++) {
            if (this.board[i][j] == 1) {
                for (var xx = i - 1; xx <= i + 1; xx++) {
                    for (var yy = j - 1; yy <= j + 1; yy++) {
                        if (typeof this.board[xx] == 'undefined' ||
                            typeof this.board[xx][yy] == 'undefined' ||
                            this.board[xx][yy] != 1) perimeterSet.addToSet([xx, yy]);
                    }
                }
            }
        }
    }
    return perimeterSet.length;
}


Node.prototype.nrOfNodes = function () {
    var configurationWeight = 0;

    for (var i = 0; i < this.board.length; i++) {
        for (var j = 0; j < this.board.length; j++) {
            if (this.board[i][j] == 1)
                configurationWeight++;
        }
    }
    return configurationWeight;
};

Node.prototype.heuristic = function () {
    var nrOfNodes = 0;
    var fronteerSize = this.getPerimeter();
    var nrIsolatedNodes = 0;

    for (var i = 0; i < this.board.length; i++) {
        for (var j = 0; j < this.board.length; j++) {
            if (this.board[i][j] == 1)
                nrOfNodes++;

            //if (this.board[i][j] == 1 && this.isFronteer(i, j))
            //    fronteerSize++;

            if (this.board[i][j] == 1 && this.isolatedPeg(i, j))
                nrIsolatedNodes++;
            else if (this.board[i][j] == 0 && this.isolatedSpace(i, j))
                nrIsolatedNodes++
        }
    }

    return ( 1.38 * fronteerSize * ( 1 + 0.8 * nrIsolatedNodes)) * Math.pow(nrOfNodes, 0.1);
};

// g(x) + h(x)
Node.prototype.f = function () {

    return this.g + this.h;
};

//for each cell of the board, check if an eventual piece can move.
//if it can, add the new configuration to the result
Node.prototype.getNeighbors = function (board) {
    var result = [];
    for (var i = 0; i < this.board.length; i++) {
        for (var j = 0; j < this.board.length; j++) {

            if (this.moveUp(i, j) != null) {
                result.push(this.moveUp(i, j));
            }

            if (this.moveDown(i, j) != null) {
                result.push(this.moveDown(i, j));
            }

            if (this.moveLeft(i, j) != null) {
                result.push(this.moveLeft(i, j));
            }

            if (this.moveRight(i, j) != null) {
                result.push(this.moveRight(i, j));
            }
        }
    }

    return result;
};

Node.prototype.moveUp = function (x, y) {
    if (x < 0 || x > 6 || y > 6 || y < 0) return null;

    //not enough space for the move
    if (x < 2) return null;

    //not a piece
    if (this.board[x][y] != 1) return null;

    //there's not a jumpable piece
    if (this.board[x - 1][y] != 1) return null;

    //there's no space to land
    if (this.board[x - 2][y] != 0) return null;

    var copyBoard = this.board.clone();

    //remove the current piece
    copyBoard[x][y] = 0;

    //remove the jumped piece
    copyBoard[x - 1][y] = 0;

    //place the jumping piece into the landing cell
    copyBoard[x - 2][y] = 1;

    return new Node(copyBoard);
};

Node.prototype.moveDown = function (x, y) {
    if (x < 0 || x > 6 || y > 6 || y < 0) return null;

    //not enough space for the move
    if (x > 4) return null;

    //not a piece
    if (this.board[x][y] != 1) return null;

    //there's not a jumpable piece
    if (this.board[x + 1][y] != 1) return null;

    //there's no space to land
    if (this.board[x + 2][y] != 0) return null;

    var copyBoard = this.board.clone();

    //remove the current piece
    copyBoard[x][y] = 0;

    //remove the jumped piece
    copyBoard[x + 1][y] = 0;

    //place the jumping piece into the landing cell
    copyBoard[x + 2][y] = 1;

    return new Node(copyBoard);
};

Node.prototype.moveLeft = function (x, y) {
    if (x < 0 || x > 6 || y > 6 || y < 0) return null;

    //not enough space for the move
    if (y < 2) return null;

    //not a piece
    if (this.board[x][y] != 1) return null;

    //there's not a jumpable piece
    if (this.board[x][y - 1] != 1) return null;

    //there's no space to land
    if (this.board[x][y - 2] != 0) return null;

    var copyBoard = this.board.clone();

    //remove the current piece
    copyBoard[x][y] = 0;

    //remove the jumped piece
    copyBoard[x][y - 1] = 0;

    //place the jumping piece into the landing cell
    copyBoard[x][y - 2] = 1;

    return new Node(copyBoard);
};

Node.prototype.moveRight = function (x, y) {
    if (x < 0 || x > 6 || y > 6 || y < 0) return null;

    //not enough space for the move
    if (y > 4) return null;

    //not a piece
    if (this.board[x][y] != 1) return null;

    //there's not a jumpable piece
    if (this.board[x][y + 1] != 1) return null;

    //there's no space to land
    if (this.board[x][y + 2] != 0) return null;

    var copyBoard = this.board.clone();

    //remove the current piece
    copyBoard[x][y] = 0;

    //remove the jumped piece
    copyBoard[x][y + 1] = 0;

    //place the jumping piece into the landing cell
    copyBoard[x][y + 2] = 1;

    return new Node(copyBoard);
};

Node.prototype.equals = function (node) {
    var equals = true;
    for (var i = this.board.length - 1; i >= 0; i--) {
        for (var j = this.board.length - 1; j >= 0; j--) {
            if (this.board[i][j] != node.board[i][j]) {
                equals = false;
                break;
            }
        }
    }

    return equals || this.mirrorX(node) || this.mirrorY(node) || this.clockwiseRot(node) || this.counterclockwiseRot(node);
};

Node.prototype.mirrorX = function (node) {
    var maxX = this.board.length - 1;

    for (var i = maxX; i >= 0; i--) {
        for (var j = maxX; j >= 0; j--) {
            if (this.board[i][j] != node.board[ maxX - i][j]) return false;
        }

    }

    return true;
};

Node.prototype.mirrorY = function (node) {
    var maxY = this.board.length - 1;
    for (var i = maxY; i >= 0; i--) {
        for (var j = maxY; j >= 0; j--) {
            if (this.board[i][j] != node.board[i][maxY - j]) return false;
        }
    }

    return true;
};

Node.prototype.clockwiseRot = function (node) {
    var maxX = this.board.length - 1;
    for (var i = 0, k = maxX; i < maxX + 1; i++) {
        for (var j = 0; j < maxX + 1; j++) {
            if (this.board[i][j] != node.board[j][k]) return false;
        }
        k--;
    }
    return true;
};

Node.prototype.counterclockwiseRot = function (node) {
    var maxX = this.board.length - 1;
    for (var i = 0, k = 0; i < maxX + 1; i++) {
        for (var j = 0; j < maxX + 1; j++) {
            if (this.board[i][j] != node.board[maxX - j][k]) return false;
        }
        k++;
    }
    return true;
};

Node.prototype.toString = function () {
    var result = [];
    for (var i = 0; i < this.board.length; i++) {
        for (var j = 0; j < this.board.length; j++) {
            result.push(this.board[i][j]);
            result.push(" ");
        }
        result.push("\n<br>");
    }
    return result.join("");
};

var insertionSortStep = function (list, elem) {
    var idx = 0;
    var elemF = elem.f();
    while (idx < list.length && list[idx].f() < elemF) idx++;
    list.splice(idx, 0, elem);
    return list;
}
