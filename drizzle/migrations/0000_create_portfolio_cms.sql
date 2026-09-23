CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_portfolio_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = 'medbouissa.contact@gmail.com'
$$;
GRANT EXECUTE ON FUNCTION public.is_portfolio_owner() TO authenticated;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_portfolio_owner() AND EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE POLICY "Owner can bootstrap role" ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND role = 'admin' AND public.is_portfolio_owner());
CREATE POLICY "Owner can read role" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() AND public.is_portfolio_owner());

CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published content is public" ON public.site_content FOR SELECT TO anon, authenticated USING (published OR public.is_portfolio_owner());
CREATE POLICY "Owner manages content" ON public.site_content FOR ALL TO authenticated USING (public.is_portfolio_owner()) WITH CHECK (public.is_portfolio_owner());

CREATE TABLE public.project_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true
);
GRANT SELECT ON public.project_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.project_categories TO authenticated;
GRANT ALL ON public.project_categories TO service_role;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published categories are public" ON public.project_categories FOR SELECT TO anon, authenticated USING (published OR public.is_portfolio_owner());
CREATE POLICY "Owner manages categories" ON public.project_categories FOR ALL TO authenticated USING (public.is_portfolio_owner()) WITH CHECK (public.is_portfolio_owner());

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  technologies text[] NOT NULL DEFAULT '{}',
  category_slug text NOT NULL DEFAULT 'unity-games',
  image_url text NOT NULL DEFAULT '',
  demo_url text NOT NULL DEFAULT '',
  code_url text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published projects are public" ON public.projects FOR SELECT TO anon, authenticated USING (published OR public.is_portfolio_owner());
CREATE POLICY "Owner manages projects" ON public.projects FOR ALL TO authenticated USING (public.is_portfolio_owner()) WITH CHECK (public.is_portfolio_owner());

CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  group_name text NOT NULL DEFAULT 'Engineering',
  level integer NOT NULL DEFAULT 80 CHECK (level BETWEEN 0 AND 100),
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.skills TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published skills are public" ON public.skills FOR SELECT TO anon, authenticated USING (published OR public.is_portfolio_owner());
CREATE POLICY "Owner manages skills" ON public.skills FOR ALL TO authenticated USING (public.is_portfolio_owner()) WITH CHECK (public.is_portfolio_owner());

CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period text NOT NULL,
  role_title text NOT NULL,
  company text NOT NULL,
  level integer NOT NULL DEFAULT 1,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.experiences TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.experiences TO authenticated;
GRANT ALL ON public.experiences TO service_role;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published experiences are public" ON public.experiences FOR SELECT TO anon, authenticated USING (published OR public.is_portfolio_owner());
CREATE POLICY "Owner manages experiences" ON public.experiences FOR ALL TO authenticated USING (public.is_portfolio_owner()) WITH CHECK (public.is_portfolio_owner());

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (char_length(name) BETWEEN 2 AND 120 AND char_length(email) BETWEEN 5 AND 254 AND char_length(subject) BETWEEN 2 AND 200 AND char_length(message) BETWEEN 10 AND 5000);
CREATE POLICY "Owner manages messages" ON public.contact_messages FOR ALL TO authenticated USING (public.is_portfolio_owner()) WITH CHECK (public.is_portfolio_owner());

CREATE INDEX projects_public_order_idx ON public.projects (published, sort_order);
CREATE INDEX skills_public_order_idx ON public.skills (published, sort_order);
CREATE INDEX experiences_public_order_idx ON public.experiences (published, sort_order);
CREATE INDEX messages_created_idx ON public.contact_messages (created_at DESC);