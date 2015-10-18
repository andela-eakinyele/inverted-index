describe("Read book data", function(){
	var Index = require('../../lib/jasmine_examples/invertedIndex');
	var filepath;

	
beforeEach(function(){
	index = new Index();
	filepath = 'books.json';
});

	it("Verify non-empty JSON data", function(){
		console.log(index.createIndex(filepath));
		expect(next).toEqual('error opening json');
		expect(4).toEqual(4);
		//expect(next).toBeFalsy();
	});
});

describe("Populate index", function(){

	it("check if index is created",function(){

	});
	it("verify index key-object map",function(){

	});

});

describe("Search index", function(){

	it("Returns array of indices of objects of search query",function(){

	});
	it("verify index key-object map",function(){

	});

});