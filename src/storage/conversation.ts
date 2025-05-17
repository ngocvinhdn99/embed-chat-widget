const CONVERSATION_KEY = "doraverse_widget_chat_conversations";

interface StoredMessage {
  type: "user" | "system";
  text: string;
  timestamp: number;
}

interface StoredConversation {
  conversationId: string;
  messages: StoredMessage[];
  expiredAt: string;
}

export function saveConversation(
  conversationId: string,
  requestMessage: { text: string },
  responseMessage: { text?: string; content?: { type: string; text: string }[] }
) {
  try {
    const existingData = localStorage.getItem(CONVERSATION_KEY);
    let conversation: StoredConversation;

    const expiredAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now

    if (existingData) {
      conversation = JSON.parse(existingData);
      conversation.expiredAt = expiredAt;
    } else {
      conversation = {
        conversationId,
        messages: [],
        expiredAt,
      };
    }

    // Add request message
    conversation.messages.push({
      type: "user",
      text: requestMessage.text,
      timestamp: Date.now(),
    });

    // Add response message
    conversation.messages.push({
      type: "system",
      text: responseMessage.content?.[0]?.text || responseMessage.text || "",
      timestamp: Date.now(),
    });

    localStorage.setItem(CONVERSATION_KEY, JSON.stringify(conversation));
  } catch (error) {
    console.error("Failed to save conversation:", error);
  }
}

export function loadConversation(): StoredConversation | null {
  try {
    const storedData = localStorage.getItem(CONVERSATION_KEY);
    if (!storedData) return null;

    const conversation: StoredConversation = JSON.parse(storedData);
    const expiredAt = new Date(conversation.expiredAt);

    // Check if conversation has expired
    if (expiredAt < new Date()) {
      localStorage.removeItem(CONVERSATION_KEY);
      return null;
    }

    return conversation;
  } catch (error) {
    console.error("Failed to load conversation:", error);
    localStorage.removeItem(CONVERSATION_KEY);
    return null;
  }
}
