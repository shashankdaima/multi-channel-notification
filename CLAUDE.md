# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Development with auto-reload (nodemon)
npm start         # Run compiled production code (node dist/server.js)
npm run lint      # ESLint on all TypeScript files
```

There are no tests yet (placeholder script only). TypeScript compiles to `/dist`.

## Architecture

This is a **multi-channel notification dispatch API** (Express/TypeScript) that sends messages across Email, SMS, Push (FCM), Slack, and MQTT simultaneously.

### Request Flow

```
POST /notification/dispatch
  → notification.controller.ts
  → MonitoringImplService.addNotification()     # persist to Supabase/PostgreSQL
  → NotificationDispatcherImplementation        # fan out in parallel
      ├── EmailNotificationDispatcherImplementation   (Gmail OAuth2 + Nodemailer)
      ├── PushNotificationDispatcherImplementation    (Firebase FCM)
      ├── SmsNotificationDispatcherImplementation     (Twilio)
      ├── SlackNotificationDispatcherImplementation   (Slack API)
      └── MqttNotificationDispatcherImplementation    (MQTT - currently disabled/broken)
  → MonitoringImplService.upsertNotificationChannel() # update delivery status
```

### Key Patterns

- **Result<T> pattern**: All service methods return `Success<T>` or `MyError<T>` (see `src/utils/`). Never throw — always return a Result.
- **Channel discrimination**: `BaseChannel` has a `type` field. `AllChannel` triggers all dispatchers; specific types route to a single dispatcher.
- **Monitoring**: Every dispatch attempt is tracked in PostgreSQL (`notification_status` table) with `pending → delivered/failed` states.

### Environment / Config

All credentials are centralized in `src/config.ts` — add new env vars there. Required services: Firebase Admin (google-services.json), Gmail OAuth2, Twilio, Slack API token, PostgreSQL (Supabase), MQTT broker.

### Known Issues

- MQTT dispatcher is incomplete and is disabled in `NotificationDispatcherImplementation`.
- No unit tests exist yet; the README mentions Jest as the planned test framework.
