Matrix Classifier
=================

This project thus far consists of an object called the cluster which essentially holds a map of type labels to matrices of cell objects. Cell objects take an input value and maintain a table of probabilities for receiving a given input based on past inputs.

```javascript
var cell = new Cell();
cell.input(0);
cell.input(1);
cell.input(1);
cell.table //=> { '0': 3.333, '1': 6.666 }
```

So you can create a cluster and then give it a matrix as input along with a label. 

```javascript
var cluster = new Cluster();
cluster.input('empty', [[0,0,0],[0,0,0],[0,0,0]]);
cluster.instances //=> { 'empty': [[Cell,Cell,Cell],...] }
// each one of these cells contains a probability of 1 for the input 0 
```
Every time you enter a matrix with the same label as a previously entered matrix the cells will adjust their probabilities. Then you can determine the type of a given input matrix with the isInstanceOf method.

```javascript
var cluster = new Cluster();
cluster.input('empty', [[0,0,0],[0,0,0],[0,0,0]]);
cluster.input('full', [[1,1,1],[1,1,1],[1,1,1]]);
cluster.isInstanceOf([[1,1,1],[1,1,1],[1,1,0]]) //=> { 'empty': 0.111, 'full': 0.888 }

```
