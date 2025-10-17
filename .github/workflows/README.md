# GitHub Actions Workflows

## AI PR Review

The `ai-pr-review.yml` workflow provides automated AI-powered code reviews for pull requests using Google Gemini.

### Features

- **Automatic Triggers**: Runs on PR opened, synchronized, or reopened
- **AI-Powered Analysis**: Uses Google Gemini API to review code changes
- **Contextual Feedback**: Understands React Native, Expo, TypeScript, and medical app specifics
- **Automatic Comments**: Posts review feedback directly on the PR

### Setup

#### Required Secrets

Add the following secret to your GitHub repository:

1. **`GEMINI_API_KEY`**: Your Google Gemini API key
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Go to: Repository Settings → Secrets and variables → Actions → New repository secret
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key

#### Automatic Secret

- **`GITHUB_TOKEN`**: Automatically provided by GitHub Actions (no setup needed)

### How It Works

1. **Trigger**: Workflow starts when a PR is opened, updated, or reopened
2. **Checkout**: Checks out the PR code with full history
3. **Get Diff**: Fetches the changes using `gh pr diff`
4. **AI Review**: Sends the diff to Google Gemini API for analysis
5. **Post Comment**: Posts the AI review as a comment on the PR

### Review Focus Areas

The AI reviewer focuses on:

- Code quality and TypeScript best practices
- React Native and Expo conventions
- Potential bugs or issues
- Performance concerns
- Security vulnerabilities
- Medical/health data handling
- Accessibility issues
- UI/UX improvements

### Limitations

- Diff is truncated to 10,000 lines if larger
- AI reviews are suggestions, not requirements
- Does not replace human code review

### Usage

No manual action needed! The workflow runs automatically on all PRs.

To disable the workflow:
- Delete or rename the `.github/workflows/ai-pr-review.yml` file
- Or add `skip ci` or `[skip ci]` to your commit message

### Troubleshooting

**Workflow doesn't run:**
- Check that the workflow file is in `.github/workflows/`
- Verify GitHub Actions are enabled in repository settings
- Check workflow permissions (requires `pull-requests: write`)

**API errors:**
- Verify `GEMINI_API_KEY` secret is set correctly
- Check API key is valid and has quota
- Review workflow logs in Actions tab

**Comment not posted:**
- Verify `GITHUB_TOKEN` has PR write permissions
- Check workflow run logs for errors
- Ensure PR is not from a fork (forks have limited permissions)

### Example Output

When the workflow runs successfully, you'll see:
- ✅ A comment from the bot on your PR
- 🤖 AI-generated code review with specific feedback
- 📊 Workflow status in the PR checks section

### Customization

To customize the AI review behavior, edit the prompt in `ai-pr-review.yml`:

```javascript
const prompt = `You are an expert code reviewer...`;
```

You can adjust:
- Review focus areas
- Tone and style of feedback
- Level of detail
- Specific technologies to check
