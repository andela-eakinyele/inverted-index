# inverted-index
This is a simple application used to generate index of json formatted files
It enables a quick search of words based on the index generated.

## Usage
The usage of the application is as follows:

### Creating Index
1.  Create a new Index instance using the "new constructor" e.g new Index();
2.  Call the createIndex(filepath) method of the instance passing in the json filepath as argument
3.  Call the getIndex(filename) to see the index generated

### Search
####  Full index search
```
  A full index search searches through all generated indices for all json files
  This is executed by calling the *searchIndex(terms)*
```

####  Index specifiers
```
  Index specifier restricts searches to specific index
  *only one* specifier is implemented, further development will include multiple specifiers
  Index specifiers utilize the format in:indexname
```

####  Search terms
```
  Search may include either:
  - strings containing one or more words e.g. 'I am Alice'
  - Array of words e.g ['I', 'am', 'Alice']
  Note that to use specifiers in array, the specifier must be the first element in the array
      e.g ['in:books', 'Alice', 'powerful']
  For string the specifier may occur anywhere in the search string
  e.g 'alice in:users powerful'  or "alice powerful in:users"
```