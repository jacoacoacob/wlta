# Data Design
_This document is the output of the exercies outlined in https://kb.databasedesignbook.com/posts/google-calendar/_


## Anchors
> Basically the only thing that anchors handle is IDs and counting. All the data is handled by attributes, discussed in the next section.

I'm adding a **Description** column here to give a high-level idea of what each Anchor represents.

| Anchor              | Description                                                                 | Physical Table  |
| ---                 | ---                                                                         | ---             |
| `User`              | A person who uses the app                                                   |
| `Tag`               | A specific kind of activity                                                 |
| `Tag Score`         | How much a user likes or dislikes the kind of activity described by a `Tag` |             
| `Activity`          | What a `User` did and for how long                                          |
| `Activity Template` | Data to pre-populate a form to create an `Activity`                         |
| `Activity Search`   | Data to pre-populate a search form to retrieve a list of saved `Activities` |

## Attributes
> Attributes store the actual information about anchors.

### `User` Attributes
A person who uses the app.

| Question                        | Logical Type  | Example Value                          | Physical Column | Physical Type |
| ---                             | ---           | ---                                    | ---             | ---           |
| What is the user's display name | `string`      | my_name                                |                 |               |

### `Tag` Attributes
A specific kind of activity

| Question                        | Logical Type  | Example Value                          | Physical Column | Physical Type |
| ---                             | ---           | ---                                    | ---             | ---           |
| What is the name of this tag    | `string`      | dishes                                 |                 |               |
| How would you describe this tag | `string`      | putting the dishes in the dishwasher   |                 |               |
| When was this tag created       | `timestamp`   | 2025-09-27T15:33:17.287Z               |                 |               |
| When was this tag updated       | `timestamp`   | 2025-09-29T18:19:46.931Z               |                 |               |

### `Tag Score` Attributes
How much a user likes or dislikes the kind of activity described by a [`Tag`](#tag-attributes)

| Question                        | Logical Type  | Example Value                          | Physical Column | Physical Type |
| ---                             | ---           | ---                                    | ---             | ---           |
| What is the name of this tag    | `string`      | dishes                                 |                 |               |
| How would you describe this tag | `string`      | putting the dishes in the dishwasher   |                 |               |
| When was this tag created       | `timestamp`   | 2025-09-27T15:33:17.287Z               |                 |               |
| When was this tag updated       | `timestamp`   | 2025-09-29T18:19:46.931Z               |                 |               |

### `Activity` Attributes
What a [`User`](#user-attributes) did and for how long

| Question                                                  | Logical Type  | Example Value             | Physical Column  | Physical Type |
| ---                                                       | ---           | ---                       | ---              | ---           |
| What text shows up as the title on a listing page         | `string`      | dishes and counters       |                  |               |
| What extra description does the user see on a detail page | `string`      | idk                       |                  |               |
| When did it start                                         | `timestamp`   | 2025-09-27T15:33:17.287Z  |
| When did it end                                           | `timestamp`   | 2025-09-29T18:19:46.931Z  |  


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

### `User` < `Tag` 
A [`User`](#user-attributes) creates multiple [`Tags`](#tag-attributes).
A [`Tag`](#tag-attributes) is created by one [`User`](#user-attributes).

| Cardnality  | Physical Column |
| ---         | ---             |
| 1:n         |                 |

