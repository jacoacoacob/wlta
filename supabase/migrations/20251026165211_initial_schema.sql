CREATE SCHEMA IF NOT EXISTS api;

GRANT USAGE ON SCHEMA api TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA api TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA api TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA api TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA api GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA api GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA api GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

CREATE TABLE api.profiles (
    id uuid DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
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
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name text NOT NULL,
    color varchar(16),
    description text
);

ALTER TABLE api.categories ENABLE ROW LEVEL SECURITY;

CREATE TABLE api.tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    is_archived boolean NOT NULL DEFAULT false,
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name text NOT NULL,
    description text
);

ALTER TABLE api.tags ENABLE ROW LEVEL SECURITY;

CREATE TABLE api.tag_scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    is_archived boolean NOT NULL DEFAULT false,
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    description text,
    score smallint NOT NULL
);

ALTER TABLE api.tag_scores ENABLE ROW LEVEL SECURITY;

CREATE TABLE api.activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    is_archived boolean NOT NULL DEFAULT false,
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    started_at timestamptz NOT NULL,
    ended_at timestamptz
);

ALTER TABLE api.activities ENABLE ROW LEVEL SECURITY;

CREATE TABLE api.activity_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    is_archived boolean NOT NULL DEFAULT false,
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name text NOT NULL
);

ALTER TABLE api.activity_templates ENABLE ROW LEVEL SECURITY;

CREATE TABLE api.activity_searches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    is_archived boolean NOT NULL DEFAULT false,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name text NOT NULL,
    params json
);

ALTER TABLE api.activity_searches ENABLE ROW LEVEL SECURITY;

-- m:n profiles = profiles
CREATE TABLE api.linked_profiles (
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    linked_user_id uuid NOT NULL REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (user_id, linked_user_id)
);

-- m:n categories = tags
CREATE TABLE api.categories_tags (
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES api.categories(id) ON UPDATE CASCADE ON DELETE CASCADE,
    tag_id uuid NOT NULL REFERENCES api.tags(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (category_id, tag_id)
);

ALTER TABLE api.categories_tags ENABLE ROW LEVEL SECURITY;

-- m:n tags = activities
CREATE TABLE api.tags_activities (
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    activity_id uuid NOT NULL REFERENCES api.activities(id) ON UPDATE CASCADE ON DELETE CASCADE,
    tag_id uuid NOT NULL REFERENCES api.tags(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (activity_id, tag_id)
);

ALTER TABLE api.tags_activities ENABLE ROW LEVEL SECURITY;

-- m:n tags = activity_templates
CREATE TABLE api.tags_activity_templates (
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    activity_template_id uuid NOT NULL REFERENCES api.activity_templates(id) ON UPDATE CASCADE ON DELETE CASCADE,
    tag_id uuid NOT NULL REFERENCES api.tags(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (activity_template_id, tag_id)
);

ALTER TABLE api.tags_activity_templates ENABLE ROW LEVEL SECURITY;

-- m:n tags = activity_searches
CREATE TABLE api.tags_activity_searches (
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    activity_search_id uuid NOT NULL REFERENCES api.activity_searches(id) ON UPDATE CASCADE ON DELETE CASCADE,
    tag_id uuid NOT NULL REFERENCES api.tags(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (activity_search_id, tag_id)
);

ALTER TABLE api.tags_activity_searches ENABLE ROW LEVEL SECURITY;

CREATE SCHEMA IF NOT EXISTS util;

CREATE OR REPLACE FUNCTION util.get_linked_user_ids()
RETURNS SETOF uuid
SET search_path = ''
AS $$
    SELECT linked_user_id
      FROM api.linked_profiles lup
     WHERE lup.user_id = (SELECT auth.uid())
$$ STABLE LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION util.set_updated_at()
RETURNS trigger
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ VOLATILE LANGUAGE PLPGSQL SECURITY DEFINER;

CREATE TRIGGER categories_updated_at_trigger
AFTER UPDATE ON api.categories
FOR EACH ROW
EXECUTE FUNCTION util.set_updated_at();

CREATE POLICY "Users can see their own and linked users' user profiles"
ON api.profiles
FOR SELECT
TO authenticated
USING (
    (SELECT auth.uid()) = user_id OR
    user_id IN (
        SELECT util.get_linked_user_ids()
    )
);

-- Profiles should be created by a trigger when a user signs up
CREATE POLICY "Users cannot create new profiles"
ON api.profiles
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Users can update their own profile"
ON api.profiles
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id) -- check the *existing* row
WITH CHECK ((SELECT auth.uid()) = user_id); -- check the *new* row

-- Profiles should not be deletable by clients connected with the
-- 'authenticated' role (logged in web app users). They should be
-- deletable by clients connected with the 'service_role' role
-- https://supabase.com/docs/guides/database/postgres/roles#servicerole
CREATE POLICY "Users cannot delete their own profile"
ON api.profiles
FOR DELETE
TO authenticated
USING (false);


CREATE POLICY "Users can see their own and shared categories"
ON api.categories
FOR SELECT
TO authenticated
USING (
    -- Both archived and non-archived categories that they own
    -- Only non-archived categories from linked profiles
    (SELECT auth.uid()) = user_id OR (
        user_id IN (SELECT util.get_linked_user_ids()) AND
        is_archived = false
    )
);

CREATE POLICY "Users can create their own categories"
ON api.categories
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own categories"
ON api.categories
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own categories"
ON api.categories
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);


CREATE POLICY "Users can see their own and shared tags"
ON api.tags
FOR SELECT
TO authenticated
USING (
    -- Both archived and non-archived tags that they own
    -- Only non-archived tags from linked profiles
    (SELECT auth.uid()) = user_id OR (
        user_id IN (SELECT util.get_linked_user_ids()) AND
        is_archived = false
    )
);

CREATE POLICY "Users can create new tags"
ON api.tags
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own tags"
ON api.tags
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own tags"
ON api.tags
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);


CREATE POLICY "Users can see their own and shared category-tag links"
ON api.categories_tags
FOR SELECT
TO authenticated
USING (
  (SELECT auth.uid()) = user_id OR (
    user_id IN (SELECT util.get_linked_user_ids())
  )
);

CREATE POLICY "Users can create their own category-tag links"
ON api.categories_tags
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT EXISTS (
    SELECT 1
    FROM api.categories c
    JOIN api.tags       t
      ON (
        t.id = tag_id AND
        t.user_id = (SELECT auth.uid())
      ) AND (
        c.id = category_id AND
        c.user_id = (SELECT auth.uid())
      )
  ))
);

CREATE POLICY "Users can destroy their own category-tag links"
ON api.categories_tags
FOR DELETE
TO authenticated
USING (
  (SELECT EXISTS (
    SELECT 1
    FROM api.categories c
    JOIN api.tags       t
      ON (
        t.id = tag_id AND
        t.user_id = (SELECT auth.uid())
      ) AND (
        c.id = category_id AND
        c.user_id = (SELECT auth.uid())
      )
  ))
);

CREATE POLICY "Users can see their own and shared activities"
ON api.activities
FOR SELECT
TO authenticated
USING (
    (SELECT auth.uid()) = user_id OR (
        user_id IN (SELECT util.get_linked_user_ids()) AND
        is_archived = false
    )
);

CREATE POLICY "Users can create their own activities"
ON api.activities
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own activities"
ON api.activities
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own activites"
ON api.activities
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);
