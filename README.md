# [Functions] Global variables behaving as locals
 
1. clone repo
2. cd to `functions` dir
3. install deps
4. run `npm start -- -- --project <firebase-project-id-or-alias>`
5. invoke the https functions: `subscribe`, `subscribe2`, `increment` multiple times

### Expected behavior
As stated in this [official video](https://www.youtube.com/watch?v=2mjfI0FYP7Y) global vars should maintain their values.
The global vars `i, j, k` should continue incrementing indefinitely from invocation to invocation.
The vars should be shared by all invactions, should they not?

### Actual behavior
The SSE functions `subscribe`, `subscribe2` behave as if they create a local var from the global one. Changing a var doesn't affect the global scope.

The function `increment` behaves as expected though it seems to run in isolation so it doesn't affect the global vars of the other functions. If I understand correctly this behavior is what the video states....

The subscriber functions do not return, they timeout. Is this why the vars don't persist?
Even though, during invocation the vars change but are not changed on the global scope.

### Findings
- https://cloud.google.com/blog/products/serverless/cloud-run-now-supports-http-grpc-server-streaming
- https://github.com/rickkas7/sse-examples/blob/master/11-google-firebase/package.json

