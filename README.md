# API Enhancement Proposals

[![BSR](https://img.shields.io/badge/BSR-Module-0C65EC)][bsr-aep-type][![BSR](https://img.shields.io/badge/BSR-Module-0C65EC)][bsr-aep-conformance]

Common types used in AEPs

[bsr-aep-conformance]: https://buf.build/aep/conformance
[bsr-aep-type]: https://buf.build/aep/type

## Protobuf Extensions

aep.dev has registered the extension ids 1253-1263 with the [global extension registry](https://github.com/protocolbuffers/protobuf/blob/main/docs/options.md). Any extensions added to this project should use these values.

To minimize the need to add new ids to the global registry, additions should try to re-use the existing extensions as much as possible (for example, additional field annotations should be added as fields to `aep.api.field_info`).
