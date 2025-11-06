// This service now calls our OWN secure backend helper, not Google's API directly from the browser.

export const translateText = async (text: string): Promise<string> => {
  if (!text.trim()) {
    return "";
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'The translation server failed.');
    }

    const data = await response.json();
    return data.translation;

  } catch (error) {
    console.error("Error calling translation service:", error);
    // Provide a user-friendly error message.
    throw new Error("Failed to translate the search query. Please try again.");
  }
};
