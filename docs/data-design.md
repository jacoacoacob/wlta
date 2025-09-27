# Data Design
This document is the output of the exercies outlined in https://kb.databasedesignbook.com/posts/google-calendar/

## Anchors
> Basically the only thing that anchors handle is IDs and counting.  All the data is handled by attributes, discussed in the next section.

| Anchor            | Physical Table  |
| ---               | ---             
| User              |
| Tag               |
| Tag Score         |                 
| Activity          |
| Activity Template |
| Activity Search   |

## Attributes
> Attributes store the actual information about anchors.

| Anchor | Question                        | Logical Type  | Example Value                         | Physical Column | Physical Type |
| ---    | ---                             | ---           | ---                                   | ---             | ---           |
| Tag    | What is the name of this tag    | `string`      | dishes                                |                 |               |
| Tag    | How would you describe this tag | `string`      | putting the dishes in the dishwasher  |                 |               |
| Tag    | When was this tag created       | `timestamp`   | 2025-09-27T15:33:17.287Z              |                 |               |
| Tag    | When was this tag updated       | `timestamp`   | 2025-09-29T18:19:46.931Z              |                 |               |

## Links
> Attributes cannot contain IDs. Instead, when two anchors are involved, we need to use links
> ...
> Links help to pin down the correct design for many complicated scenarios.  To describe the link, you need to write down two sentences.  If the sentences don’t make sense or do not match the reality of the business — you’ve just prevented a design mistake!
>
> What do we see in this table?
>
> - Link connects two anchors.  Anchors could be different, like here, or the same. For example, “Employee is a manager of Employee” is one example of one such link.
>
> - To specify cardinality, we use a custom notation with the “<” character (other possibilities are: “—”, “=”, and “>”).  It is the same as “1:N”, but additionally it allows you to specify which anchor is “only one” and which is “several”.
>
> - We use two formalized sentences that involve two anchors, a verb, and information about cardinality.  Those sentences allow us to validate and document our design.
> 
> - We write down the cardinality again, in a more familiar way in a separate column.  Pinning down cardinality is essential, so we make a lot of fuss about it.

_a note on cardnality notation with help from https://stackoverflow.com/a/3397384_

`m:n` (or `=`) represents many-to-many relationships.

`1:n` (or `<`) represents one-to-many relationships.

`1:1` (or `–`) represents one-to-one relationships


| Anchor_1 * Anchor_2 | Sentences                                               | Cardnality  | Physical Column |
| ---                 | ---                                                     | ---         | ---             |
| User < Tag          | User creates multiple Tags. Tag is created by one user. | 1:n         |                 |