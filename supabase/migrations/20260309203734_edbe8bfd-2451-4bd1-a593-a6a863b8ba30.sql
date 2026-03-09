
-- Tighten invite codes update: only allow setting used_by to self
DROP POLICY "Users can use invite codes" ON public.invite_codes;
CREATE POLICY "Users can use invite codes"
  ON public.invite_codes FOR UPDATE TO authenticated
  USING (used_by IS NULL)
  WITH CHECK (used_by = auth.uid());

-- Tighten clubs insert: require authenticated (already done, but remove WITH CHECK true)
DROP POLICY "Authenticated users can create clubs" ON public.clubs;
CREATE POLICY "Authenticated users can create clubs"
  ON public.clubs FOR INSERT TO authenticated
  WITH CHECK (auth.role() = 'authenticated');
