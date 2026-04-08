CREATE TABLE message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES profiles(id),
  participant_2_id UUID NOT NULL REFERENCES profiles(id),
  round_drop_id UUID REFERENCES round_drops(id),
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(participant_1_id, participant_2_id, round_drop_id)
);

CREATE INDEX idx_message_threads_participants ON message_threads(participant_1_id, participant_2_id);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_profile_id UUID NOT NULL REFERENCES profiles(id),
  receiver_profile_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_thread ON messages(thread_id, created_at);
CREATE INDEX idx_messages_receiver ON messages(receiver_profile_id, read_at);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
