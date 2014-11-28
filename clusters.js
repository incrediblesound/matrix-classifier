var cluster = function(){
	this.instances = {};
};

cluster.prototype.input = function(label, matrix){
	// for a given input type, create a matrix of cells equal in size to the input matrix
	this.instances[label] = this.instances[label] || this.makeCellMatrix(matrix);
	// iterate over the matrices and input the data from each index of the input matrix into the cell
	forMatrix(this.instances[label], matrix, function(cell, data){
		cell.input(data);
	});
};

cluster.prototype.isInstanceOf = function(matrix){
	var result = {};
	var instanceKeys = Object.keys(this.instances);
	forEach(instanceKeys, function(key, idx, context){
		result[key] = [];
		forMatrix(context.instances[key], matrix, function(cell, input){
			if(cell.table[input] !== undefined){
				result[key].push(cell.table[input]);
			} else {
				result[key].push(0);
			}
		});
		result[key] = average(result[key]);
	}, this);
	return result;
}

cluster.prototype.makeCellMatrix = function(matrix){
	var height = matrix.length;
	var width = matrix[0].length;
	var result = [], row;
	for(var i = 0; i < height; i++){
		result.push(arrayOf(width, function(){ return new Cell(); }));
	};
	return result;
}

cluster.prototype.matrixInput = function(cellMatrix, inputMatrix){

}

var Cell = function(){
	this.memory = {};
	this.table = {};
	this.length = 0;
}

Cell.prototype.input = function(value){
	this.memory[value] = this.memory[value] || [];
	var records = Object.keys(this.memory);
	forEach(records, function(record, key, context){
		if(record !== value.toString()){
			context.memory[record].push(0);
		} else {
			context.memory[value].push(1);
		}
	}, this);
	this.length ++;
	this.makeTable();
}

Cell.prototype.makeTable = function(){
	var records = Object.keys(this.memory);
	var max = 0;
	var diff, copy;
	forEach(records, function(record, key, context){
		copy = context.memory[record].slice();
		if(copy.length < context.length){
			diff = context.length - copy.length;
			copy = copy.concat(arrayOf(diff, function(){ return 0; }));
		}
		var avg = average(copy);
		context.table[record] = avg;
	}, this);
}

var A = [
[0,0,1,0,0],
[0,1,0,1,0],
[1,1,1,1,1],
[1,0,0,0,1]
];

var B = [
[1,0,0,0,0],
[0,0,1,0,0],
[1,0,0,0,0],
[0,0,1,0,0]
];

var A2 = [
[0,0,1,0,0],
[1,0,0,0,1],
[1,1,1,1,1],
[1,0,0,0,1]
];

var B2 = [
[1,1,0,0,0],
[0,0,1,0,0],
[1,1,0,0,0],
[0,0,1,0,0]
];

function forEach(array, fn, context){
	for(var i = 0, l = array.length; i < l; i++){
		fn(array[i], i, context);
	}
}

function arrayOf(num, fn){
	var result = [];
	for(var i = 0; i < num; i++){
		result.push(fn());
	}
	return result;
}

function average(array){
	var result = 0;
	for(var i = 0; i < array.length; i++){
		result += array[i];
	}
	result = result/array.length;
	return result;
}

function forMatrix(matrixA, matrixB, fn){
	forEach(matrixA, function (rowA, rowIdx){
		forEach(rowA, function (cellA, cellIdx){
			fn(cellA, matrixB[rowIdx][cellIdx]);
		})
	})
}