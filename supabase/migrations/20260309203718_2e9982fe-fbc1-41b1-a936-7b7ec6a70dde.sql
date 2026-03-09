
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 1. CLUBS TABLE
CREATE TABLE public.clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#C85A7C',
  secondary_color text DEFAULT '#D4A853',
  font text DEFAULT 'Playfair Display',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_clubs_updated_at
  BEFORE UPDATE ON public.clubs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. CLUB_MEMBERS TABLE
CREATE TABLE public.club_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  full_name text,
  avatar_url text,
  joined_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, club_id)
);

ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;

-- 3. INVITE_CODES TABLE
CREATE TABLE public.invite_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  used_by uuid REFERENCES auth.users(id),
  expires_at timestamp with time zone,
  used_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- 4. STORAGE BUCKET FOR LOGOS
INSERT INTO storage.buckets (id, name, public) VALUES ('club-logos', 'club-logos', true);

-- Storage policies
CREATE POLICY "Club logos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'club-logos');

CREATE POLICY "Authenticated users can upload club logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'club-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update club logos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'club-logos' AND auth.role() = 'authenticated');

-- 5. SECURITY DEFINER FUNCTIONS for RLS (avoid recursion)
CREATE OR REPLACE FUNCTION public.is_club_member(_user_id uuid, _club_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.club_members
    WHERE user_id = _user_id AND club_id = _club_id
  );
$$;

CREATE OR REPLACE FUNCTION public.get_club_role(_user_id uuid, _club_id uuid)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM public.club_members
  WHERE user_id = _user_id AND club_id = _club_id
  LIMIT 1;
$$;

-- 6. RLS POLICIES

-- Clubs: members can read their own clubs
CREATE POLICY "Members can view their clubs"
  ON public.clubs FOR SELECT TO authenticated
  USING (public.is_club_member(auth.uid(), id));

-- Clubs: owners/admins can update
CREATE POLICY "Owners and admins can update clubs"
  ON public.clubs FOR UPDATE TO authenticated
  USING (public.get_club_role(auth.uid(), id) IN ('owner', 'admin'));

-- Clubs: authenticated users can create clubs
CREATE POLICY "Authenticated users can create clubs"
  ON public.clubs FOR INSERT TO authenticated
  WITH CHECK (true);

-- Club members: members can see other members of their clubs
CREATE POLICY "Members can view club members"
  ON public.club_members FOR SELECT TO authenticated
  USING (public.is_club_member(auth.uid(), club_id));

-- Club members: allow insert (for joining)
CREATE POLICY "Users can join clubs"
  ON public.club_members FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Club members: owners/admins can update members
CREATE POLICY "Owners and admins can update members"
  ON public.club_members FOR UPDATE TO authenticated
  USING (public.get_club_role(auth.uid(), club_id) IN ('owner', 'admin'));

-- Club members: owners can remove members
CREATE POLICY "Owners can delete members"
  ON public.club_members FOR DELETE TO authenticated
  USING (public.get_club_role(auth.uid(), club_id) = 'owner');

-- Invite codes: members can view codes for their clubs
CREATE POLICY "Members can view invite codes"
  ON public.invite_codes FOR SELECT TO authenticated
  USING (public.is_club_member(auth.uid(), club_id));

-- Invite codes: owners/admins can create
CREATE POLICY "Owners and admins can create invite codes"
  ON public.invite_codes FOR INSERT TO authenticated
  WITH CHECK (public.get_club_role(auth.uid(), club_id) IN ('owner', 'admin'));

-- Invite codes: allow update for joining (mark as used)
CREATE POLICY "Users can use invite codes"
  ON public.invite_codes FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);
