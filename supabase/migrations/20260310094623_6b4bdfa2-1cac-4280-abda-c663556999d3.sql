
-- Fix: Drop restrictive INSERT policy on clubs and recreate as permissive
DROP POLICY IF EXISTS "Authenticated users can create clubs" ON clubs;
CREATE POLICY "Authenticated users can create clubs" ON clubs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Fix: Drop restrictive INSERT policy on club_members and recreate as permissive
DROP POLICY IF EXISTS "Users can join clubs" ON club_members;
CREATE POLICY "Users can join clubs" ON club_members
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix: Drop restrictive SELECT policies and recreate as permissive
DROP POLICY IF EXISTS "Members can view their clubs" ON clubs;
CREATE POLICY "Members can view their clubs" ON clubs
  FOR SELECT TO authenticated
  USING (is_club_member(auth.uid(), id));

DROP POLICY IF EXISTS "Owners and admins can update clubs" ON clubs;
CREATE POLICY "Owners and admins can update clubs" ON clubs
  FOR UPDATE TO authenticated
  USING (get_club_role(auth.uid(), id) = ANY (ARRAY['owner', 'admin']));

DROP POLICY IF EXISTS "Members can view club members" ON club_members;
CREATE POLICY "Members can view club members" ON club_members
  FOR SELECT TO authenticated
  USING (is_club_member(auth.uid(), club_id));

DROP POLICY IF EXISTS "Owners and admins can update members" ON club_members;
CREATE POLICY "Owners and admins can update members" ON club_members
  FOR UPDATE TO authenticated
  USING (get_club_role(auth.uid(), club_id) = ANY (ARRAY['owner', 'admin']));

DROP POLICY IF EXISTS "Owners can delete members" ON club_members;
CREATE POLICY "Owners can delete members" ON club_members
  FOR DELETE TO authenticated
  USING (get_club_role(auth.uid(), club_id) = 'owner');

DROP POLICY IF EXISTS "Members can view invite codes" ON invite_codes;
CREATE POLICY "Members can view invite codes" ON invite_codes
  FOR SELECT TO authenticated
  USING (is_club_member(auth.uid(), club_id));

DROP POLICY IF EXISTS "Owners and admins can create invite codes" ON invite_codes;
CREATE POLICY "Owners and admins can create invite codes" ON invite_codes
  FOR INSERT TO authenticated
  WITH CHECK (get_club_role(auth.uid(), club_id) = ANY (ARRAY['owner', 'admin']));

DROP POLICY IF EXISTS "Users can use invite codes" ON invite_codes;
CREATE POLICY "Users can use invite codes" ON invite_codes
  FOR UPDATE TO authenticated
  USING (used_by IS NULL)
  WITH CHECK (used_by = auth.uid());

-- Add status column to club_members
ALTER TABLE club_members ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active'
  CHECK (status IN ('pending', 'active', 'rejected'));

-- Allow new club creator (owner) to read the club they just created
-- by also allowing SELECT if user_id matches for club_members check
CREATE POLICY "Users can view own memberships" ON club_members
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
