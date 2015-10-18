var fs  = require('fs'), 
	path = require('path'), async = require('async');
var index_all = '', tokens = '', 
	filepaths = '', newdata = '';

function Index(){
	// variables for serializing indices
	this.indexname = [];
	this.jsondata = {};
	this.nindexes = {};
	this.count = 0;
}

// creates an index from the JSON data 
Index.prototype.createIndex = function(filepath){
	var obj  = this;
	filepaths = filepath;
	var new_index = obj.getfilename(filepath);
	if (obj.indexname.indexOf(new_index) < 0) {
		obj.indexname.push(new_index);
		++this.count;
	}
	obj.nindexes[new_index] = {};		
	obj.jsondata[new_index] = {};

	obj.readingFile(filepaths, new_index, 
		function(index_all){
			getTokens(index_all);
			generateTokendata(obj, tokens, obj.jsondata[new_index], new_index);
			return obj.nindexes[new_index];
	});

};

// return index 
Index.prototype.getIndex = function (indexname){	
	var obj = this;
		return obj.createIndex(indexname);
};

// return index 
Index.prototype.searchIndex = function (terms){	
	var obj = this;
	if(terms.length > 0){
		terms.forEach(function(item){
			if(obj.nindexes[indexname][item]) console.log;
		});
	}
	else{if(obj.nindexes[indexname][terms]) console.log;}
};

// obtain name of JSON file for serializing index
Index.prototype.getfilename = function(filepath){
	if(filepath !== null){
		return path.basename(filepath, path.extname(filepath));
	}
	else{return null;}
};

// reads the content ofthe JSON file, and builds index
Index.prototype.readingFile = function (filepath, indexname, callback){
	// binding object 
	var obj = this;
	async.waterfall([
		function(concats){
			fs.readFile(filepaths, function(err, data){
				if (err) return console.log("error opening reading json");
				if (data == '') return console.log("JSON file is empty");
				try{
					newdata = (JSON.parse(data));
				}
				catch(e){
					return console.log(e.message);
				}
				concats(null, newdata, indexname);
			});	
		},

		function(newdata, indexname, concats){
			obj.jsondata[indexname] = newdata;
			// initialize variables
			index_all = '';
			// concatenate content of each object to for building index
			newdata.forEach(function(item, index){
				// looping through each object in the data
				// concatenate data into a single string (index_all)
				for (var key in item){
					index_all += ' ' + item[key];
				}
			});
			concats(null);
		}
		], function concats(err){
				if (err) return console.error(err);			
				callback(index_all);
  });	
};


function getTokens(index_all){
	var tokens_i;	
	// for full text search
		tokens ='';
		tokens_i = index_all.toLowerCase().split(/[.,\s]+/); //split by period, comma and spaces
		tokener(tokens_i);
}

// sorts concatenated data and collect unique tokens
function tokener(tokens_i){
	tokens_i = tokens_i.filter(
				function(tokens_i){
					return tokens_i !== '';});
			tokens_i = tokens_i.sort().filter(function(a,b,c){
				return (b == c.indexOf(a)); });
			if (typeof tokens !== 'string') tokens.push(tokens_i);
			else tokens = tokens_i;
}

// generates index by group or full index
function generateTokendata(obj, tokens, jsondata, indexname){
		tokens.forEach(function(item, index){
			obj.nindexes[indexname][item] = [];		
			for(var keys in jsondata){
				loopb:
				for( var key in jsondata[keys]){
						var Str = jsondata[keys][key].toLowerCase(); 
					if (Str.indexOf(item) > -1){
						obj.nindexes[indexname][item].push(keys);
						break loopb;
					}
				}
			}
		});
	}

index1 = new Index();

index1.getIndex('../../spec/jasmine_examples/books.json');
