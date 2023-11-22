# PhoneNumber

The `PhoneNumber` type represents a phone number.

A `PhoneNumber` represents a phone number in a way suitable as an API wire
format.

This representation:

- should not be used for locale-specific formatting of a phone number, such as
  "+1 (650) 253-0000 ext. 123"
- is not designed for efficient storage
- may not be suitable for dialing - specialized libraries (see references)
  should be used to parse the number for that purpose

To do something meaningful with this number, such as format it for various
use-cases, you will need a library like
https://github.com/google/libphonenumber.

For instance, in Java this would be:

```java
dev.aep.type.PhoneNumber wireProto =
    dev.aep.type.PhoneNumber.newBuilder().build();
com.google.i18n.phonenumbers.Phonenumber.PhoneNumber phoneNumber =
    PhoneNumberUtil.getInstance().parse(wireProto.getNumber(), "ZZ");
if (!wireProto.getExtension().isEmpty()) {
  phoneNumber.setExtension(wireProto.getExtension());
}
```

## Schema

### `PhoneNumber`

A `PhoneNumber` has two main fields, exactly one of which must be populated:

- A `ShortCode` field named `short_code` (see below for details on `ShortCode`).
- A string field named `number`, representing an [E164][] number.

  This field is formatted as a leading plus sign (`+`), followed by a phone
  number that uses a relaxed ITU E.164 format consisting of the country calling
  code (1 to 3 digits) and the subscriber number, with no additional spaces or
  formatting, e.g.:

  - correct: "+15552220123"
  - incorrect: "+1 (555) 222-01234 x123".

  The ITU E.164 format limits the latter to 12 digits, but in practice not all
  countries respect that, so we relax that restriction here. National-only
  numbers are not allowed.

A `PhoneNumber` also has a string `extension` field, which is optional. An
`extension` can be no longer than 40 characters. Typically, this is a series of
numberical digits, but it may also include dialing characters such as `#`, `,`,
`p`, and `w`.

An `extension` **must not** include a leading "x" that services simply to
indicate that the value is a phone number extension; this is implicit in the
field itself.

### `ShortCode`

A `ShortCode` represents a phone number that is typically much shorter than
regular phone numbers and can be used to address messages in MMS and SMS
systems, as well as for abbreviated dialing (e.g. "Text 611 to see how many
minutes you have remaining on your plan.").

Short codes are restricted to a region and are not internationally dialable,
which means the same short code can exist in different regions, with different
usage and pricing, even if those regions share the same country calling code
(e.g. US and CA).

A `ShortCode` has two fields, both of which are required:

- A string field named `region_code`, representing a BCP-47 region code. This
  must be exactly one of:
  - Two alphabetical characters (such as "US"); OR
  - Three numeric digits (such as "419").
- A string field named `number`, comprising only numeric digits and representing
  the actual number (such as "611").

## Examples

- `{short_code: {region_code: "US", number: "911"}}`
- `{number: "+15552220123"}`
- `{number: "+15552220123", extension: "123,,456"}`

[E164]: https://en.wikipedia.org/wiki/E.164
