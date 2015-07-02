// http://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate

/**
 * Removes a module from the cache
 */
function uncache(moduleName) {
  // Run over the cache looking for the files
  // loaded by the specified module name
  searchCache(moduleName, function(mod) {
    delete require.cache[mod.id];
  });

  // Remove cached paths to the module.
  // Thanks to @bentael for pointing this out.
  Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
    if (cacheKey.indexOf(moduleName) > 0) {
      delete module.constructor._pathCache[cacheKey];
    }
  });
};

/**
 * Runs over the cache to search for all the cached
 * files
 */
function searchCache(moduleName, callback) {
  // Resolve the module identified by the specified name
  var mod = require.resolve(moduleName);

  // Check if the module has been resolved and found within
  // the cache
  if (mod && ((mod = require.cache[mod]) !== undefined)) {
    // Recursively go over the results
    (function run(mod) {
      // Go over each of the module's children and
      // run over it
      mod.children.forEach(function(child) {
        run(child);
      });

      // Call the specified callback providing the
      // found module
      callback(mod);
    })(mod);
  }
};

module.exports = uncache;
