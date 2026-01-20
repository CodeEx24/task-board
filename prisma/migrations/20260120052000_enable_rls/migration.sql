-- Enable Row Level Security on Board table
ALTER TABLE "Board" ENABLE ROW LEVEL SECURITY;

-- Enable Row Level Security on Task table
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (allow all operations for now)
-- These can be made more restrictive when authentication is added

CREATE POLICY "Allow all operations on Board" ON "Board"
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on Task" ON "Task"
  FOR ALL
  USING (true)
  WITH CHECK (true);
