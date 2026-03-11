
-- Fix club_members: drop all restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Members can view club members" ON club_members;
DROP POLICY IF EXISTS "Users can view own memberships" ON club_members;
DROP POLICY IF EXISTS "Users can join clubs" ON club_members;
DROP POLICY IF EXISTS "Owners and admins can update members" ON club_members;
DROP POLICY IF EXISTS "Owners can delete members" ON club_members;
DROP POLICY IF EXISTS "club_members_select" ON club_members;
DROP POLICY IF EXISTS "club_members_insert" ON club_members;
DROP POLICY IF EXISTS "members_can_read_own" ON club_members;
DROP POLICY IF EXISTS "members_can_insert_own" ON club_members;
DROP POLICY IF EXISTS "owners_can_read_club_members" ON club_members;
DROP POLICY IF EXISTS "owners_can_update_members" ON club_members;

-- Users can read their own memberships
CREATE POLICY "members_can_read_own"
ON club_members FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Owners/admins can read ALL members of their club
CREATE POLICY "owners_can_read_club_members"
ON club_members FOR SELECT
TO authenticated
USING (
  club_id IN (
    SELECT cm.club_id FROM club_members cm
    WHERE cm.user_id = auth.uid()
    AND cm.role IN ('owner', 'admin')
    AND cm.status = 'active'
  )
);

-- Users can insert themselves
CREATE POLICY "members_can_insert_own"
ON club_members FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Owners/admins can update members in their club
CREATE POLICY "owners_can_update_members"
ON club_members FOR UPDATE
TO authenticated
USING (
  club_id IN (
    SELECT cm.club_id FROM club_members cm
    WHERE cm.user_id = auth.uid()
    AND cm.role IN ('owner', 'admin')
    AND cm.status = 'active'
  )
);

-- Owners can delete members
CREATE POLICY "owners_can_delete_members"
ON club_members FOR DELETE
TO authenticated
USING (
  club_id IN (
    SELECT cm.club_id FROM club_members cm
    WHERE cm.user_id = auth.uid()
    AND cm.role = 'owner'
    AND cm.status = 'active'
  )
);

-- Fix clubs: drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Members can view their clubs" ON clubs;
DROP POLICY IF EXISTS "Owners and admins can update clubs" ON clubs;
DROP POLICY IF EXISTS "allow_authenticated_insert_clubs" ON clubs;

CREATE POLICY "members_can_view_clubs"
ON clubs FOR SELECT
TO authenticated
USING (is_club_member(auth.uid(), id));

CREATE POLICY "authenticated_can_insert_clubs"
ON clubs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "owners_admins_can_update_clubs"
ON clubs FOR UPDATE
TO authenticated
USING (get_club_role(auth.uid(), id) IN ('owner', 'admin'));

-- Fix invite_codes: drop restrictive and recreate as permissive
DROP POLICY IF EXISTS "Members can view invite codes" ON invite_codes;
DROP POLICY IF EXISTS "Owners and admins can create invite codes" ON invite_codes;
DROP POLICY IF EXISTS "Users can use invite codes" ON invite_codes;

CREATE POLICY "members_can_view_invite_codes"
ON invite_codes FOR SELECT
TO authenticated
USING (is_club_member(auth.uid(), club_id));

CREATE POLICY "owners_admins_can_create_invite_codes"
ON invite_codes FOR INSERT
TO authenticated
WITH CHECK (get_club_role(auth.uid(), club_id) IN ('owner', 'admin'));

-- Anyone authenticated can read invite codes to validate them (for joining)
CREATE POLICY "authenticated_can_read_unused_invite_codes"
ON invite_codes FOR SELECT
TO authenticated
USING (used_by IS NULL);

CREATE POLICY "authenticated_can_use_invite_codes"
ON invite_codes FOR UPDATE
TO authenticated
USING (used_by IS NULL)
WITH CHECK (used_by = auth.uid());
