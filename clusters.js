var Cluster = function(resolution){
	this.instances = {};
	this.resolution = resolution || false;
};

Cluster.prototype.input = function(label, matrix){
	if(this.resolution){
		matrix = this.convertResolution(matrix);
	}
	// for a given input type, create a matrix of cells equal in size to the input matrix
	this.instances[label] = this.instances[label] || this.makeCellMatrix(matrix);
	// iterate over the matrices and input the data from each index of the input matrix into the cell
	forMatrix(this.instances[label], matrix, function(cell, data){
		cell.input(data);
	});
};

Cluster.prototype.isInstanceOf = function(matrix){
	if(this.resolution){
		matrix = this.convertResolution(matrix);
	}
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
};

Cluster.prototype.makeCellMatrix = function(matrix){
	var height = matrix.length;
	var width = matrix[0].length;
	var result = [], row;
	for(var i = 0; i < height; i++){
		result.push(arrayOf(width, function(){ return new Cell(); }));
	};
	return result;
};

Cluster.prototype.convertResolution = function(matrix){
	var size = this.resolution;
	var height = matrix.length;
	var width = matrix[0].length;
	var result = makeMatrix(size, size);
	var diffHeight = size - matrix.length;
	// var diffWidth = size - matrix[0].length;
	if(diffHeight < 0){
		diffHeight = Math.abs(diffHeight);
		for(var row = 0; row < height; row++){
			for(var col = 0; col < width; col++){
				var newVal = matrix[row][col];
				var toRow = Math.floor(row/diffHeight);
				var toCol = Math.floor(col/diffHeight);
				result[toRow][toCol] = result[toRow][toCol] || [];
				result[toRow][toCol].push(newVal);
			}
		}
	} else {
		diffHeight = Math.abs(diffHeight);
		for(var row = 0; row < size; row++){
			for(var col = 0; col < size; col++){
				var toRow = Math.floor(row/diffHeight);
				var toCol = Math.floor(col/diffHeight);
				var newVal = matrix[toRow][toCol];
				result[row][col] = result[row][col] || [];
				result[row][col].push(newVal);
			}
		}
	}
	for(var row = 0; row < result.length; row++){
		for(var col = 0; col < result[row].length; col++){
			result[row][col] = average(result[row][col]);
		}
	}
	return result;
};

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
	if(typeof matrixB === 'function'){
		fn = matrixB;
		matrixB = undefined;
	}
	forEach(matrixA, function (rowA, rowIdx){
		forEach(rowA, function (cellA, cellIdx){
			if(matrixB !== undefined){
				fn(cellA, matrixB[rowIdx][cellIdx]);
			} else {
				fn(cellA);
			}
		})
	})
}






[
[0,0],
[0,0]
]

[
[0,0,0,0],
[0,0,0,0],
[0,0,0,0],
[0,0,0,0]
]


function makeMatrix(height, width){
	var result = [];
	for(var i = 0; i < height; i++){
		result.push(arrayOf(width, function(){ return }));
	}
	return result;
};




















