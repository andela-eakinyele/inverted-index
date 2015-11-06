// These are helper functions called during create and Search index operations
// get unique tokens
function getTokens(index_all) {
  var tokens_i;
  // for full text search
  tokens = '';
  tokens_i = index_all.toLowerCase().split(/[.,\s*]+/); //split by period, comma and spaces
  tokener(tokens_i);
}
// sorts concatenated data and collect unique tokens
function tokener(tokens_i) {
  tokens_i = tokens_i.filter(function(tokens_i) {
    return tokens_i !== '';
  });
  tokens_i = tokens_i.sort().filter(function(a, b, c) {
    return (b == c.indexOf(a));
  });
  if (typeof tokens !== 'string') tokens.push(tokens_i);
  else tokens = tokens_i;
}
// generates index by group or full index
function generateTokendata(obj, tokens, jsondata, indexname) {
  tokens.forEach(function(item, index) {
    obj.nindexes[indexname][item] = [];
    for (var keys in jsondata) {
      if (hasOwn.call(jsondata, keys)){
        loopb: for (var key in jsondata[keys]) {
          if (hasOwn.call(jsondata[keys], key)){
            var Str = jsondata[keys][key].toLowerCase();
              if (Str.indexOf(item) > -1) {
                obj.nindexes[indexname][item].push(keys);
                break loopb;
              }
          }
        }
      }
    }
  });
}
// Search index
function searching(obj, terms, indexname) {
  if(terms == undefined || terms == '') return 'Enter search terms';
  var results = {};
  terms.forEach(function(item, index) {
    results[item] = [];
    if (obj.nindexes[indexname][item.toLowerCase()] == undefined) {
      results[item] = 'not found';
    } else {
      results[item] = obj.nindexes[indexname][item.toLowerCase()];
    }
  });
  return results;
}