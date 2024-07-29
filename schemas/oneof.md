# Oneof

As used by the [AEPs](http://aep.dev), a `oneof` represents a set of mutually
exclusive fields.

## Schema

Rather than a generic schema for `oneof`, we provide common components
supplementing the language features of specific IDLs. Using these enables
uniform behavior (and JSON serialization) across IDLs.

### protobuf

Protobuf's built-in `oneof` supports mutual exclusion of fields. However, it
does not have a way for an API indicate that at least one of the fields must be
set. For this purpose, a protobuf `oneof` may be annotated with
[`aep.api.OneOfBehavior`](../proto/aep-api/aep/api/oneof_behavior.proto):

```proto
message Document {
  // ...

  // The owner of the document.
  oneof owner {
    // The user who owns the document.
    string user = 1 [(google.api.resource_reference) = {
      type: "apis.example.com/User",
    }];

    // The group that owns the document.
    string group = 2 [(google.api.resource_reference) = {
      type: "apis.example.com/Group",
    }];
  } [(aep.api.OneOfBehavior) = {required: true}];
}
```

### OAS

OAS 3 has a concept called `oneOf`, but it has different semantics than the
`oneof` defined by this document; the OAS concept says that a single field must
match exactly one of multiple possible schemas, rather than specifying mutual
exclusion over multiple properties.

In order to represent a `oneof` in OAS, in a way that produces JSON equivalent
to that of protobuf, we define an extension `x-aep-oneof`:

```yaml
components:
  schemas:
    Document:
      type: object
      properties:
        user: { type: string }
        group: { type: string }
        x-aep-oneof:
          name: owner
          properties: [user, group]
          required: true
```

The `x-aep-oneof` extension is used to indicate that at least one of the fields
in the `oneOf` array must be set.

**Note:** OAS extension not yet defined.
