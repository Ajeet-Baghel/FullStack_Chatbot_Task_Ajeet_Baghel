# Video Walkthrough and Submission Checklist

## Suggested Walkthrough

Aim for a three-to-five-minute recording.

1. Introduce the DroneTV AI Support & Lead Assistant and its React, Express, and PostgreSQL stack.
2. Show the responsive landing page, services, and courses.
3. Submit the contact form and explain its validation and service/course dropdown.
4. Open the chatbot, expand FAQs, select a question, and show the conversation history and reset action.
5. Submit an enquiry from the chatbot.
6. Open the admin dashboard, refresh the records, search and filter enquiries, open a record, update its status, and delete a test record.
7. Briefly show the Express API routes, PostgreSQL schema, and environment-variable configuration.
8. Run or mention the client and server production builds.
9. End with the GitHub repository and deployed demo URLs.

## Screenshots

The following screenshots are included under `docs/screenshots/`:

- `home.png`
- `services-courses.png`
- `contact-form.png`
- `chatbot-conversation.png`
- `chatbot-faq.png`
- `admin-dashboard.png`
- `admin-enquiry-detail.png`

After adding them, embed the most useful screenshots in the root README.

## Final Verification

- Install dependencies from a clean checkout.
- Apply `server/src/schema.sql` to PostgreSQL.
- Confirm `GET /api/health` reports a connected database.
- Build both client and server successfully.
- Submit enquiries through both forms.
- Confirm submitted enquiries appear in the admin dashboard.
- Confirm search, filtering, status updates, and deletion work.
- Check desktop and mobile layouts.
- Confirm `.env`, credentials, and generated build output are not committed.
- Review the repository for temporary files and outdated documentation.

## Submission Package

- GitHub repository URL
- Live frontend URL
- Live backend health URL
- Video walkthrough URL
- Screenshots
- API endpoint documentation
- Database schema
- Updated resume or portfolio link when requested

## Known Production Requirement

The demonstration admin login is client-side. Implement server-side authentication and protect enquiry management endpoints before making the application publicly accessible.
