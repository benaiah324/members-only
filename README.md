# Members Only

An exclusive clubhouse web app where members post messages. Outsiders can read the stories but not see who wrote them or when. Club members see author names and timestamps. Admins see everything and can delete messages.

## Stack

- **Node.js** + **Express**
- **PostgreSQL** for data and session storage
- **Passport.js** (local strategy) for authentication
- **bcrypt** for password hashing
- **express-validator** for form validation

## Database models

### Users
| Field | Type | Notes |
|-------|------|-------|
| `first_name` | VARCHAR | Required |
| `last_name` | VARCHAR | Required |
| `email` | VARCHAR | Unique username |
| `password` | VARCHAR | bcrypt hash |
| `membership_status` | BOOLEAN | Default `false` — granted via secret passcode |
| `is_admin` | BOOLEAN | Default `false` — set via admin passcode at sign-up |

### Messages
| Field | Type | Notes |
|-------|------|-------|
| `title` | VARCHAR | Required |
| `text` | TEXT | Message body |
| `created_at` | TIMESTAMPTZ | Auto-set timestamp |
| `user_id` | FK → users | Author |

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your PostgreSQL connection string and passcodes.

3. **Create the database and tables**

   ```bash
   npm run db:setup
   ```

4. **Start the server**

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

## Default passcodes (change in `.env`)

| Purpose | Env variable | Default |
|---------|--------------|---------|
| Join the club | `MEMBERSHIP_PASSCODE` | `clubhouse2026` |
| Admin at sign-up | `ADMIN_PASSCODE` | `admin-secret` |

## User flows

1. **Sign up** — creates a user with `membership_status = false`
2. **Log in** — Passport local auth
3. **Join the club** — enter membership passcode to unlock author/date visibility
4. **Create message** — logged-in users only; link shown in nav when authenticated
5. **Home page** — everyone sees all message titles and text; only members/admins see author + date; only admins see delete buttons

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run production server |
| `npm run dev` | Run with nodemon |
| `npm run db:setup` | Create DB and apply schema |
