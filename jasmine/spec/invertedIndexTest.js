describe("Read book data", function() {
  var filepath;
  beforeEach(function() {
    index = new Index();
    filepath = 'books.json';
    indexname = index.getfilename(filepath);
    spyOn(index, 'readjson').and.callThrough();
    content = index.readjson(filepath, indexname);
	});

  it("Verify non-empty JSON data", function() {
    expect(indexname).toEqual('books');
    expect(index.readjson).toHaveBeenCalled();
    expect(content).not.toEqual('empty json');
  });
  
  it("Ensure JSON objects have string property", function() {
    expect(content).not.toEqual('empty json');
    var result = index.jsondata[indexname];
    for (var i in result) {
      for (var j in result[i]) {
        expect(typeof j).toEqual('string');
      }
    }
  });
});

describe("Populate index", function() {
  var filepath, result;
  beforeEach(function() {
    index = new Index();
    filepath = 'books.json';
    filepath2 = 'users.json';

    indexname = index.getfilename(filepath);
    indexname2 = index.getfilename(filepath2);

    spyOn(index, 'createIndex').and.callThrough();
    spyOn(index, 'getIndex').and.callThrough();

    index.createIndex(filepath);
    result = index.getIndex(filepath);
    index.createIndex(filepath2);
    result2 = index.getIndex(filepath2);
  });

  it("check if index is created", function() {
    expect(index.createIndex).toHaveBeenCalledWith(filepath);
    expect(result).not.toEqual(indexname + " does not exist");
    expect(result).toEqual(jasmine.objectContaining({
    			imagination: ['0'] 
    		}
    	));
	});
  
  it("Ensure index objects are not overwritten", function() {
    expect(index.createIndex.calls.count()).toEqual(2);
    expect(index.createIndex).toHaveBeenCalledWith(filepath2);
    expect(result).not.toEqual(indexname + " does not exist");
    expect(result2).not.toEqual(indexname2 + " does not exist");
  });

  it("verify index key-object map", function() {});
	});

describe("Search index", function() {
  beforeEach(function() {
    index = new Index();
    filepath = 'books.json';

    spyOn(index, 'createIndex').and.callThrough();
    spyOn(index, 'getIndex').and.callThrough();
    spyOn(index, 'searchIndex').and.callThrough();

    index.createIndex(filepath);
  });

  it("Returns array of indices of objects of search query", function() {
    expect(index.searchIndex).toHaveBeenCalled;
    var searched = index.searchIndex('alice');
    expect(searched).toEqual({
      books: {
          alice: ['0']
      }
    });
  });

  it("should handle varied number of search terms", function() {
    expect(index.searchIndex).toHaveBeenCalled;
    var searched = index.searchIndex('alice powerful wonderland');
    expect(searched).toEqual({
      books: {
        alice: ['0'],
        powerful: ['1'],
        wonderland: ['0']
      }
    });
  });

  it("should handle array of search terms", function() {
    expect(index.searchIndex).toHaveBeenCalled;
    var searched = index.searchIndex(['alice', 'powerful', 'wonderland']);
    expect(searched).toEqual({
      books: {
        alice: ['0'],
        powerful: ['1'],
        wonderland: ['0']
      }
    });
  });

  it("should handle index specifiers for search terms", function() {
    expect(index.searchIndex).toHaveBeenCalled;
    //index specifier must be the first term in the array
    var searched = index.searchIndex(['in: books', 'alice', 'powerful', 'wonderland']);
    expect(searched).toEqual({
      alice: ['0'],
      powerful: ['1'],
      wonderland: ['0']
    });
      // index specifier may be placed anywhere in a string search
    var searched = index.searchIndex('alice  in:books powerful wonderland');
    expect(searched).toEqual({
      alice: ['0'],
      powerful: ['1'],
      wonderland: ['0']
    });
  });

  it("should return error message when index specifiers does not exist", function() {
    var searched = index.searchIndex(['in: users', 'alice', 'powerful', 'wonderland']);
    expect(index.searchIndex).toHaveBeenCalled;
    expect(searched).toEqual('users index does not exist');
  });

  it("should return searches from all indexes", function() {
    index.createIndex('users.json');
    var searched = index.searchIndex(['alice', 'powerful', 'wonderland']);
    expect(index.createIndex.calls.count()).toBeGreaterThan(1);
    expect(searched).toEqual({
      books: {
        alice: ['0'],
        powerful: ['1'],
        wonderland: ['0']
	    },
      users: {
        alice: ['0'],
        powerful: 'not found',
        wonderland: ['0']
      }
    });
  });
});