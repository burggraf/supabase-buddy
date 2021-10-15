CREATE TABLE IF NOT EXISTS snippets (
  id UUID UNIQUE PRIMARY KEY DEFAULT uuid_generate_v4(),
  userid UUID DEFAULT auth.uid() REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  statement_delimiter TEXT NOT NULL DEFAULT ';',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user can manipulate their own snippets" 
  ON public.snippets FOR ALL 
  USING (userid = auth.uid()) 
  WITH CHECK (userid = auth.uid());