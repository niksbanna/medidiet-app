# Configuring an Alternate AI Provider (OpenAI)

You can choose to use OpenAI instead of Google Gemini by setting the provider and API key in your environment. The app will prefer a per-user API key if present on the profile, otherwise it falls back to the environment variables below.

Set these environment variables for your build / local dev environment:

```
EXPO_PUBLIC_AI_PROVIDER=openai
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
# (Optional) EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

You can also set a per-user preference and API key in the `UserProfile` object (used by the app at runtime):

- `preferredAiProvider` = `"openai"` or `"gemini"`
- `openAIApiKey` = user's OpenAI API key (optional, overrides env var)

If no provider or key is configured the app will fall back to the local meal planner.

Security note: Never commit API keys to the repository. Use environment variables or a secure settings screen that stores keys locally (AsyncStorage) and mark them as sensitive.
