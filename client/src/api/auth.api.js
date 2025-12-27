// --- existing functions (keep them as they are) ---
export const getProfile = async (userId) => {
  const res = await fetch(`/api/profile/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return await res.json();
};

export const updateProfile = async (userId, data) => {
  const res = await fetch(`/api/profile/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return await res.json();
};

// --- new Gemini API call ---
export const sendChatMessage = async (message) => {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) throw new Error("Failed to get AI response");
  return await res.json();
};
