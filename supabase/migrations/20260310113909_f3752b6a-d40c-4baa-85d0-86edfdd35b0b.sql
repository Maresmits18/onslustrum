
DROP POLICY IF EXISTS "clubs_insert" ON clubs;
DROP POLICY IF EXISTS "Users can create clubs" ON clubs;
DROP POLICY IF EXISTS "Authenticated users can create clubs" ON clubs;
DROP POLICY IF EXISTS "allow_authenticated_insert_clubs" ON clubs;

CREATE POLICY "allow_authenticated_insert_clubs"
ON clubs
FOR INSERT
TO authenticated
WITH CHECK (true);
