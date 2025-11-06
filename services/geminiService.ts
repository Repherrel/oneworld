// This service now calls our OWN secure backend helpers, not Google's API directly from the browser.

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
    throw new Error("Failed to translate the search query. Please try again.");
  }
};


export const detectLanguage = async (text: string): Promise<string> => {
  if (!text.trim()) {
    return "en"; // Assume english if empty
  }

  try {
    const response = await fetch('/api/detect-language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
        // If detection fails, conservatively assume it needs translation
        console.error("Language detection failed, proceeding with translation.");
        return "unknown"; 
    }

    const data = await response.json();
    // Return the language code (e.g., 'en', 'es')
    return data.languageCode;

  } catch (error) {
    console.error("Error calling language detection service:", error);
    // If there's a network error, assume it needs translation
    return "unknown";
  }
};
