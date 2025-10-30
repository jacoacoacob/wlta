CREATE SCHEMA IF NOT EXISTS api;

CREATE TABLE api.profiles (
    id uuid DEFAULT gen_random_uuid(),
    user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    handle varchar(16) UNIQUE CONSTRAINT valid_profile_handle CHECK(
        handle ~ '^[a-z0-9_]+$'
    ),
    display_name text,
    photo text
);

ALTER TABLE api.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE api.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    is_archived boolean NOT NULL DEFAULT false,
    user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name text NOT NULL,
    -- hex code #ffaacc
    color varchar(9),
    description text
);

ALTER TABLE api.categories ENABLE ROW LEVEL SECURITY;

CREATE TABLE api.tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    is_archived boolean NOT NULL DEFAULT false,
    user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name text NOT NULL,
    description text
);

ALTER TABLE api.tags ENABLE ROW LEVEL SECURITY;

CREATE TABLE api.tag_scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    is_archived boolean NOT NULL DEFAULT false,
    user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    description text,
    score smallint NOT NULL
);

ALTER TABLE api.tag_scores ENABLE ROW LEVEL SECURITY;

CREATE TABLE api.activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    is_archived boolean NOT NULL DEFAULT false,
    user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    started_at timestamptz NOT NULL,
    ended_at timestamptz NOT NULL
);

ALTER TABLE api.activities ENABLE ROW LEVEL SECURITY;

CREATE TABLE api.activity_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    is_archived boolean NOT NULL DEFAULT false,
    user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name text NOT NULL
);

ALTER TABLE api.activity_templates ENABLE ROW LEVEL SECURITY;

CREATE TABLE api.activity_searches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    is_archived boolean NOT NULL DEFAULT false,
    user_id uuid REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name text NOT NULL
    params json
);

ALTER TABLE api.activity_searches ENABLE ROW LEVEL SECURITY;

-- m:n profiles = profiles
CREATE TABLE api.linked_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    own_user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    linked_user_id uuid FOREIGN KEY REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- m:n categories = tags
CREATE TABLE api.categories_tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id REFERENCES api.categories(id) ON UPDATE CASCADE ON DELETE CASCADE,
    tag_id REFERENCES api.tags(id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE api.categories_tags ENABLE ROW LEVEL SECURITY;

-- m:n tags = activities
CREATE TABLE api.tags_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id REFERENCES api.activities(id) ON UPDATE CASCADE ON DELETE CASCADE,
    tag_id REFERENCES api.tags(id) ON UPDATE CASCADE ON DELETE CASCADE  
);

ALTER TABLE api.tags_activities ENABLE ROW LEVEL SECURITY;

-- m:n tags = activity_templates
CREATE TABLE api.tags_activity_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_template_id REFERENCES api.activity_templates(id) ON UPDATE CASCADE ON DELETE CASCADE,
    tag_id REFERENCES api.tags(id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE api.tags_activity_templates ENABLE ROW LEVEL SECURITY;

-- m:n tags = activity_searches
CREATE TABLE api.tags_activity_searches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_search_id REFERENCES api.activity_searches(id) ON UPDATE CASCADE ON DELETE CASCADE,
    tag_id REFERENCES api.tags(id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE api.tags_activity_searches ENABLE ROW LEVEL SECURITY;


CREATE SCHEMA IF NOT EXISITS private;

CREATE OR REPLACE FUNCTION get_linked_profiles_user_ids(own_user_id uuid)
RETURNS SETOF uuid
AS $$
    SELECT linked_user_id
      FROM api.linked_profiles lup
     WHERE lup.own_user_id = $1
$$ STABLE LANGUAGE SQL SECURITY DEFINER;


CREATE POLICY "Users can see their own and linked users' user profiles"
ON api.profiles
FOR SELECT
TO authenticated
USING (
    (SELECT auth.uid()) = user_id OR
    user_id IN (
        SELECT private.get_linked_profiles_user_ids((SELECT auth.uid()))
    )
);

-- Profiles should be created by a trigger when a user signs up
CREATE POLICY "Users cannot create new profiles"
ON api.profiles
FOR INSERT
TO authenticated
USING (false);

CREATE POLICY "Users can update their own profile"
ON api.profiles
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id) -- check the *existing* row
WITH CHECK ((SELECT auth.uid()) = user_id) -- check the *new* row

-- Profiles should not be deletable by clients connected with the
-- 'authenticated' role (logged in web app users). They should be
-- deletable by clients connected with the 'service_role' role
-- https://supabase.com/docs/guides/database/postgres/roles#servicerole
CREATE POLICY "Users cannot delete their own profile"
ON api.profiles
TO authenticated
USING (false);


CREATE POLICY "Users can see their own categories and those from linked profiles"
ON api.categories
TO authenticated
USING (
    -- Both archived and non-archived categories that they own
    -- Only non-archived categories from linked profiles
)