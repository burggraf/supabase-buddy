CREATE TABLE IF NOT EXISTS snippets (
  id UUID UNIQUE PRIMARY KEY DEFAULT uuid_generate_v4(),
  user UUID NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  statement_delimiter TEXT NOT NULL DEFAULT ';',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP
);