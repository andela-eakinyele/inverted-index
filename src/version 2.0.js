var fs  = require('fs'), 
	path = require('path'), async = require('async');
var index_by_keys = ['',''], index_all = '', tokens = '', 
	filepaths = '', key_count = 0, keys = [], newdata = '';

var args = process.argv.slice(-1);
var flag = (args.indexOf('-g') >= 0);

function Index(){
	// variables for serializing indices
	this.indexname = [];
	this.jsondata = {};
	this.nindexes = {};
	this.count = 0;
}

// obtain name of JSON file for serializing index
Index.prototype.getfilename = function(filepath){
	if(filepath !== null){
		return path.basename(filepath, path.extname(filepath));
	}
	else{return null;}
};

// creates an index from the JSON data 
Index.prototype.createIndex = function(filepath){
	filepaths = filepath;
	var new_index = this.getfilename(filepath);
	if (this.indexname.indexOf(new_index) < 0) {
		this.indexname.push(new_index);
		++this.count;
	}
	this.nindexes[new_index] = {};		
	this.jsondata[new_index] = {};
};

// reads the content ofthe JSON file, and builds index
Index.prototype.readingFile = function (filepath, indexname, callback){
	// binding 
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
			index_all = ''; index_by_keys = ['']; keys = []; key_count = 0;

			// concatenate content of each object to for building index
			newdata.forEach(function(item, index){

				// re-initialize key value pair count object
				key_count = 0;
				// looping through each object in the data
				// concatenate data into a single string (index_all)
				// group by keys in object (index_by Keys)
				for (var key in item){
					index_all += ' ' + item[key];
					index_by_keys[key_count] += ' '+item[key];
					key_count++;
					index_by_keys[key_count] = '';		
				}
				--key_count;
			});
			concats(null);
		}
		], function concats(err, results){
				if (err) return console.error(err);			
				callback(index_all, index_by_keys);
  });
	
};

Index.prototype.getIndex = function (indexname){	
	var obj = this;
	obj.readingFile(filepaths, indexname, 
		function(index_all, index_by_keys){
			getTokens(index_all, index_by_keys);
			generateTokendata(obj, tokens, obj.jsondata[indexname], indexname);
			console.log(obj.nindexes[indexname]);
	});
};

function getTokens(index_all, index_by_keys){
	var tokens_i;
	
	// for full text search
	if(!flag){
		tokens ='';
		console.log("executed no flag");
		tokens_i = index_all.toLowerCase().split(/[.,\s]+/); //split by period, comma and spaces
		tokener(tokens_i);
	}
	// for group index search
	else{
		tokens = [];
		console.log("executed flag");
		index_by_keys.forEach(function(item, index){
			if(item !== ''){
			tokens_i = item.toLowerCase().split(/[.,\s]+/);
			tokener(tokens_i);}
		});		
	}
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
	if(!flag){
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

	else
	{
		for(var key1 in jsondata){
			var mapkey = 0;
			for(var key2 in jsondata[key1]){
				if(obj.nindexes[indexname][key2] === undefined){obj.nindexes[indexname][key2] = {};}
					tokens[mapkey].forEach(function(item){
						if(obj.nindexes[indexname][key2][item] == undefined){
							obj.nindexes[indexname][key2][item] = [];
						}
						var Str = jsondata[key1][key2].toLowerCase();
						if (Str.indexOf(item) !== -1){
							obj.nindexes[indexname][key2][item].push(key1);
						}	
					});	
					mapkey++;						
			} 
		}
	}

}
index1 = new Index();
index1.createIndex('../../spec/jasmine_examples/books.json');
index1.getIndex('books');
index1.createIndex('../../spec/jasmine_examples/users.json');
index1.getIndex('users');
index1.getIndex('books');

