# Data Design
This document is the output of the exercies outlined in https://kb.databasedesignbook.com/posts/google-calendar/


## Anchors
> Basically the only thing that anchors handle is IDs and counting. All the data is handled by attributes, discussed in the next section.

Additionally, each anchor can be assumed to have attributes to answer

| Question              | Logical Type  | Example Value             | Physical Column | Physical Type |
| ---                   | ---           | ---                       | ---             | ---           |
| When was it created   | `timestamp`   | 2025-09-27T15:33:17.287Z  | `created_at`    | `timestamptz` |
| When was it updated   | `timestamp`   | 2025-09-29T18:19:46.931Z  | `updated_at`    | `timestamptz` |
| Has it been archived  | `boolean`     | False                     | `is_archived`   | `boolean`     |


| Anchor                                                | Physical Table        |
| ---                                                   | ---                   |
| [`User`](#user-attributes)                            | `user_profile`        |
| [`Category`](#category-attributes)                    | `categories`          |
| [`Tag`](#tag-attributes)                              | `tags`                |
| [`Tag Score`](#tag-score-attributes)                  | `tag_scores`          |
| [`Activity`](#activity-attributes)                    | `activities`          |
| [`Activity Template`](#activity-template-attributes)  | `activity_templates`  |
| [`Activity Search`](#activity-attributes)             | `activity_searches`   |

## Attributes
> Attributes store the actual information about anchors.

### `User` Attributes
| Question                            | Logical Type  | Example Value                   | Physical Column | Physical Type |
| ---                                 | ---           | ---                             | ---             | ---           |
| What is the user's display name     | `string`      | my_name                         | `display_name`  | `text`        |
| Does the user have a profile photo  | `string`      | assets.myapp.com/user-id/photo  | `photo`         | `text`        |                               

<details>
<summary><code>User</code> Links</summary>

- [`User` < `Category`](#user--category)
- [`User` < `Tag`](#user--tag)
- [`User` < `Tag Score`](#user--tag-score)
- [`User` < `Activity`](#user--activity)
- [`User` < `Activity Template`](#user--activity-template)
- [`User` < `Activity Search`](#user--activity-search)
</details>

### `Category` Attributes
| Question                                                    | Logical Type  | Example Value                                 | Physical Column | Physical Type |
| ---                                                         | ---           | ---                                           | ---             | ---           |
| What general kind of activity does this category represent  | `string`      | cleaning, leisure, money job, admin           | `name`          | `text`        |
| Do you want to describe this category in more detail        | `string`      | making appointments, balancing budgets, etc.  | `description`   | `text`        |

<details>
<summary><code>Category</code> Links</summary>

- [`Category` > `User`](#user--category)
- [`Category` = `Tag`](#category--tag)
</details>

### `Tag` Attributes
| Question                                                | Logical Type  | Example Value                          | Physical Column | Physical Type |
| ---                                                     | ---           | ---                                    | ---             | ---           |
| What specific kind of activity does this tag represent  | `string`      | dishes, clean stove, cooking           | `name`          | `text`        |
| Do you want to describe this activity in more detail    | `string`      | putting the dishes in the dishwasher   | `description`   | `text`        |

<details>
<summary><code>Tag</code> Links</summary>

- [`Tag` > `User`](#user--category)
- [`Tag` = `Activity`](#tag--activity)
- [`Tag` = `Activity Template`](#tag--activity-template)
- [`Tag` = `Activity Search`](#tag--activity-search)
- [`Tag` < `Tag Score`](#tag--tag-score)
</details>

### `Tag Score` Attributes
| Question                                                                                                                | Logical Type  | Example Value       | Physical Column | Physical Type |
| ---                                                                                                                     | ---           | ---                 | ---             | ---           |
| How much does a [`User`](#user-attributes) like or dislike doing the activity represented by a [`Tag`](#tag-attributes) | `int`         | 2                   | `score`         | `smallint`    |
| Do you want to describe this score in more detail                                                                       | `string`      | I was really tired  | `description`   | `text`        |

<details>
<summary><code>Tag Score</code> Links</summary>

- [`Tag Score` > `Tag`](#tag--tag-score)
- [`Tag Score` > `User`](#user--tag-score)
</details>

### `Activity` Attributes
| Question             | Logical Type  | Example Value             | Physical Column  | Physical Type |
| ---                  | ---           | ---                       | ---              | ---           |
| When did it start    | `timestamp`   | 2025-09-27T15:33:17.287Z  | `started_at`     | `timestamptz` |
| When did it end      | `timestamp`   | 2025-09-29T18:19:46.931Z  | `ended_at`       | `timestamptz` |

<details>
<summary><code>Activity</code> Links</summary>

- [`Activity` > `User`](#user--activity)
- [`Activity` = `Tag`](#tag--activity)
</details>

### `Activity Template` Attributes
Data to pre-populate a form to create an [`Activity`](#activity-attributes)

| Question                                                               | Logical Type  | Example Value             | Physical Column  | Physical Type  |
| ---                                                                    | ---           | ---                       | ---              | ---            |
| What title does a user see when they're browsing `Activity Templates`  | `string`      | idk                       | `name`           | `text`         |

<details>
<summary><code>Activity Template</code> Links</summary>

- [`Activity Template` > `User`](#user--activity-template)
- [`Activity Template` = `Tag`](#tag--activity-template)

</details>

### `Activity Search` Attributes
Data to pre-populate a form to create an [`Activity`](#activity-attributes)
| Question                                                               | Logical Type  | Example Value                                                | Physical Column  | Physical Type  |
| ---                                                                    | ---           | ---                                                          | ---              | ---            |
| What title does a user see when they're browsing `Activity Searches `  | `string`      | last 7 days                                                  | `name`           | `text`         |
| What kind of date/time range will this search be bounded by            | `collection`  | { "type": "interval", "start": "now", end: "now - 7 days" }  | `params`         | `json`         |

<details>
<summary><code>Activity Search</code> Links</summary>

- [`Activity Search` > `User`](#user--activity-search)
- [`Activity Search` = `Tag`](#tag--activity-search)
</details>

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

### `User` < `Category` 
A [`User`](#user-attributes) creates multiple [`Categories`](#category-attributes).
A [`Category`](#category-attributes) is created by one [`User`](#user-attributes).

| Cardnality  | Physical Table or Column  |
| ---         | ---                       |
| 1:n         | `categories.owner_id`     |

### `User` < `Tag` 
A [`User`](#user-attributes) creates multiple [`Tags`](#tag-attributes).
A [`Tag`](#tag-attributes) is created by one [`User`](#user-attributes).

| Cardnality  | Physical Table or Column  |
| ---         | ---                       |
| 1:n         | `tags.owner_id`           |

### `User` < `Tag Score` 
A [`User`](#user-attributes) creates multiple [`Tag Scores`](#tag-score-attributes).
A [`Tag Score`](#tag-score-attributes) is created by one [`User`](#user-attributes).

| Cardnality  | Physical Table or Column  |
| ---         | ---                       |
| 1:n         | `tag_scores.owner_id`     |

### `User` < `Activity` 
A [`User`](#user-attributes) creates multiple [`Activities`](#activity-attributes).
An [`Activity`](#activity-attributes) is created by one [`User`](#user-attributes).

| Cardnality  | Physical Table or Column  |
| ---         | ---                       |
| 1:n         | `activities.owner_id`     |

### `User` < `Activity Template` 
A [`User`](#user-attributes) creates multiple [`Activity Templates`](#activity-template-attributes).
An [`Activity Template`](#activity-template-attributes) is created by one [`User`](#user-attributes).

| Cardnality  | Physical Table or Column      |
| ---         | ---                           |
| 1:n         | `activity_templates.owner_id` |

### `User` < `Activity Search` 
A [`User`](#user-attributes) creates multiple [`Activity Searches`](#activity-search-attributes).
An [`Activity Search`](#activity-search-attributes) is created by one [`User`](#user-attributes).

| Cardnality  | Physical Table or Column      |
| ---         | ---                           |
| 1:n         | `activity_searches.owner_id`  |

### `Category` = `Tag`
A [`Category`](#category-attributes) may be linked to multiple [`Tags`](#tag-attributes).
A [`Tag`](#tag-attributes) may be linked to multiple [`Categories`](#category-attributes).

| Cardnality  | Physical Table or Column  |
| ---         | ---                       |
| m:n         | `categories_tags`         |

### `Tag` = `Activity`
A [`Tag`](#tag-attributes) may be linked to multiple [`Activities`](#activity-attributes).
An [`Activity`](#activity-attributes) may be linked to multiple [`Tags`](#tag-attributes).

| Cardnality  | Physical Table or Column  |
| ---         | ---                       |
| m:n         | `tags_activities`         |

### `Tag` = `Activity Template`
A [`Tag`](#tag-attributes) may be linked to multiple [`Activity Templates`](#activity-template-attributes).
An [`Activity Template`](#activity-template-attributes) may be linked to multiple [`Tags`](#tag-attributes).

| Cardnality  | Physical Table or Column  |
| ---         | ---                       |
| m:n         | `tags_activity_templates` |

### `Tag` = `Activity Search`
A [`Tag`](#tag-attributes) may be linked to multiple [`Activity Searches`](#activity-search-attributes).
An [`Activity Search`](#activity-search-attributes) may be linked to multiple [`Tags`](#tag-attributes).

| Cardnality  | Physical Table or Column  |
| ---         | ---                       |
| m:n         | `tags_activity_searches`  |

### `Tag` < `Tag Score`
A [`Tag`](#tag-attributes) may be linked to multiple [`Tag Scores`](#tag-score-attributes).
A [`Tag Score`](#tag-score-attributes) may be linked to one [`Tag`](#tag-attributes).

| Cardnality  | Physical Table or Column  |
| ---         | ---                       |
| 1:n         | `tag_scores.tag_id`       |