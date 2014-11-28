//start is a Node object, with already initialized g and h
var astar = function (start) {
    var openList = [];
    var closedList = [];

    openList.push(start);
    var k = 0;
    while (openList.length > 0) {
        k++;

        var currentNode = openList[0];

        //if the expanded node is an optimal solution, search is terminated.
        //Return the path
        if (currentNode.nrOfNodes() == 1) {
            var curr = currentNode;
            var ret = [];

            while (curr.parent) {
                ret.push(curr);
                curr = curr.parent;
            }
            ret.push(curr);
            console.log("FINE k=" + k);
            return ret.reverse();
        }

        //move the node from the open list to the closed one
        openList.splice(0, 1);
        closedList.push(currentNode);

        //get the neighbors of the current node and add them to the openList
        var neighbors = currentNode.getNeighbors();

        for (var neighborIdx = 0; neighborIdx < neighbors.length; neighborIdx++) {
            var neighbor = neighbors[neighborIdx];

            //search if node is already visited
            var visited = false;
            for (var closedIdx = closedList.length - 1; closedIdx >= 0; closedIdx--) {
                if (neighbor.equals(closedList[closedIdx])) {
                    visited = true;
                    break;
                }
            }
            //if so, continue
            if (visited) {
                continue;
            }

            var isNew = true;

            for (var j = openList.length - 1; j >= 0; j--) {
                if (neighbor.equals(openList[j])) {
                    isNew = false;
                    break;
                }
            }


            if (isNew) {
                // This the the first time we have arrived at this node, it must be the best
                // Also, we need to take the h (heuristic) score since we haven't done so yet

                gScoreIsBest = true;
                neighbor.h = neighbor.heuristic();
                // Found an optimal (so far) path to this node.	 Store info on how we got here and
                //	just how good it really is...
                neighbor.parent = currentNode;
                neighbor.g = currentNode.g + 1;

                insertionSortStep(openList, neighbor);
            }
        }
        if (k % 100 == 0) console.log(k, openList.length, currentNode.g, currentNode.f());
    }
    // No result was found -- empty array signifies failure to find path
    return [];
}