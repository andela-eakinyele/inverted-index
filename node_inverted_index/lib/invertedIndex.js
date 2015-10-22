
var index_all = '', tokens = '', newdata = '';
var fs  = require('fs');
function Index(){
	// variables for serializing indices
	this.indexname = [];
	this.jsondata = {};
	this.nindexes = {};
	this.count = 0;

	// creates an index from the JSON data 
	this.createIndex = function(filepath){
		// initialize variables for index
		var obj  = this;
		var new_index = obj.getfilename(filepath);
		if (obj.indexname.indexOf(new_index) < 0) {
			obj.indexname.push(new_index);
			++this.count;
		}
		obj.nindexes[new_index] = {};		
		obj.jsondata[new_index] = {};

		// read file and generate index
		obj.readjson(filepath, new_index) 
		getTokens(index_all);
		generateTokendata(obj, tokens, obj.jsondata[new_index], new_index);
	};

	// return index 
	this.getIndex = function (filepath){	
		var obj = this;
		var index = obj.getfilename(filepath);
		if(obj.indexname.indexOf(index) < 0){
			return index + " index does not exist";
		}
		return obj.nindexes[index];
	};

	// return search results 
	this.searchIndex = function (terms){

		var obj = this, flag, indexname;
		// check for flag for index object specifier
		if(typeof terms === 'object'){
			flag = terms[0].search(/in:\s*\w+/);
			if(flag > -1){
				indexname = (/in:\s*(\w+)/).exec(terms[0])[1];
				terms = terms.slice(1);}
		}
		// parse string into array
		else{
			flag = terms.search(/in:\s*\w+/);
			if(flag > -1) indexname = (/in:\s*(\w+)/).exec(terms)[1];

			terms = terms.replace(/in:\w+/, '').trim().split(/[.,\s*]+/);
		}
		// use flag to search specified index
		if(flag > -1){
			if(obj.nindexes[indexname] == undefined){
				return indexname +' index does not exist';
			}			
			return searching(obj, terms, indexname);
		}
		// search in all indices
		else{
			var result_all = {};
			for (var key in obj.nindexes){
				result_all[key] = {};
				result_all[key] = searching(obj, terms, key);
			}
			return result_all;
		}
	};

		// obtain name of JSON file for serializing index
		this.getfilename = function(filepath){
			if(filepath !== undefined && filepath !== ''){
				var path = filepath.split(/[.\/]+/);
				return path[path.length - 2];
			}
			else{return null;}
		};

		// reads the content ofthe JSON file, and builds index
		this.readjson = function (filepath, indexname){
			// binding object
			var obj = this;
			var Buffer = fs.readFileSync(filepath);
				try{
					newdata =JSON.parse(Buffer);	
				}
				catch(e){
					return e.message;
				}

			obj.jsondata[indexname] = newdata;
			// initialize variables
			index_all = '';
			// concatenate content of each object to for building index
			newdata.forEach(function(item, index){
				for (var key in item){
					index_all += ' ' + item[key];
				}
			});	
		};
	}

// These are helper functions called during create and Search index operations
// get unique tokens
function getTokens(index_all){
	var tokens_i;	
	// for full text search
		tokens ='';
		tokens_i = index_all.toLowerCase().split(/[.,\s*]+/); //split by period, comma and spaces
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

// Search index
function searching(obj, terms, indexname){
	var results = {}; 
  terms.forEach(function(item, index){
		results[item] = [];
		if(obj.nindexes[indexname][item.toLowerCase()] == undefined){
			results[item] = 'not found';
		}
		else{					
			results[item] = obj.nindexes[indexname][item.toLowerCase()];
		}
	});
 return results;
}


module.exports = Index;