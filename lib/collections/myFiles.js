import SimpleSchema from 'simpl-schema';
// create a new FileCollection with all default values
myFiles = new FileCollection('myFiles',
  { resumable: true,   // Enable built-in resumable.js upload support
    http: [
      { method: 'get',
        path: '/:md5',  // this will be at route "/gridfs/myFiles/:md5"
        lookup: function (params, query) {  // uses express style url params
          return { md5: params.md5 };       // a query mapping url to myFiles
        }
      }
    ]
  }
);

/*
// this is not used at present - example code
fc = new FileCollection('fs',  // base name of collection
  { resumable: false,          // Disable resumable.js upload support
    resumableIndexName: undefined,    // Not used when resumable is false
    chunkSize: 2*1024*1024 - 1024,    // Use 2MB chunks for gridFS and resumable
    baseURL: '\gridfs\fs',     // Default base URL for all HTTP methods
    locks: {                   // Parameters for gridfs-locks
      timeOut: 360,            // Seconds to wait for an unavailable lock
      pollingInterval: 5,      // Seconds to wait between lock attempts
      lockExpiration: 90       // Seconds until a lock expires
    },
    http: []    // HTTP method definitions, none by default
  }
);
*/
