# Operation

An `Operation` represents a long-running operation that is the result of a
network API call.

## Schema

An `Operation` has the following fields:

- `path` is a string representing the path of the operation resource. This is
  the standard `path` field used for all resources in resource-oriented APIs.

- `metadata` is an object containing service-specific metadata associated with
  the operation. It typically contains progress information and common metadata
  such as create time. Some services might not provide such metadata. Any method
  that returns a long-running operation should document the metadata type, if
  any.

- `done` is a boolean field indicating whether the operation has completed. If
  the value is `false`, it means the operation is still in progress. If `true`,
  the operation is completed, and either `error` or `response` is available.

- Two mutually exclusive fields containing the result of an operation:

  - `error` is the error result of the operation in case of failure or
    cancellation. Its type should match the standard error representation in a
    given API or IDL (for example, `google.rpc.Status` in protocol buffer APIs).

  - `response` is the normal response of the operation in case of success.
    Depending on the method, this may be the empty object, the resource on which
    the operation is performed, or a custom response.
