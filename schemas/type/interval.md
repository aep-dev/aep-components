# Interval

`Interval` represents a time interval, encoded as a `Timestamp` start
(inclusive) and a `Timestamp` end (exclusive).

The start must be less than or equal to the end. When the start equals the end,
the interval is empty (matches no time). When both start and end are
unspecified, the interval matches any time.

# Schema

An `Interval` has two fields:

- The `start` field is a `Timestamp` representing the start of the interval.

  If specified, a Timestamp matching this interval will have to be the same or
  after the start.

- The `end` field is a `Timestamp` representing the end of the interval.

  If specified, a `Timestamp` matching this interval will have to be before the
  end.
