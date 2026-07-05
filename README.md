# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1e49eeda-b375-49ea-be21-892412c77e87

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1e49eeda-b375-49ea-be21-892412c77e87) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1e49eeda-b375-49ea-be21-892412c77e87) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## HitPay Automated Booking System

This project includes a fully automated booking flow using HitPay as the payment gateway. It replaces the old WhatsApp booking flow.

### Backend Setup & Environment Variables

1. Navigate to the `server/` directory and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Copy `server/.env.example` to `server/.env` and fill in the required variables:
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (must be the service_role key to bypass RLS for backend operations).
   - `HITPAY_API_KEY` and `HITPAY_SALT` (from your HitPay dashboard).
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_CALENDAR_ID`, `GOOGLE_SHEET_ID` (for syncing dates and logging).

3. Start the backend server:
   ```bash
   npm start
   ```

### HitPay Dashboard Setup

1. Go to your HitPay Dashboard > Settings > API Keys.
2. Copy your API Key and Salt into the backend `.env`.
3. In the HitPay webhook settings, you do **not** need to set a global webhook URL if you don't want to, as the backend dynamically passes the webhook URL (`/api/webhooks/hitpay`) in every payment request.
4. Ensure your HitPay account has the necessary payment methods enabled (FPX, DuitNow QR, Cards, etc.).

### Switching from Sandbox to Production

When you are ready to take live payments, the client needs to create their own real HitPay account. You will need to change these three environment variables in `server/.env`:

1. `HITPAY_API_URL`: Change this from `https://api.sandbox.hit-pay.com/v1` to `https://api.hit-pay.com/v1`.
2. `HITPAY_API_KEY`: Replace with the production API Key from their live HitPay dashboard.
3. `HITPAY_SALT`: Replace with the production Salt from their live HitPay dashboard.

*Nothing else in the codebase is hardcoded to Sandbox. Making these three changes in `.env` is all that's required to go live.*

### Database Migration

To support the booking lock and sequential reference generation, run the SQL migration in your Supabase SQL editor:
- Copy the contents of `supabase/migrations/01_hitpay_booking.sql`.
- Run it in your Supabase project's SQL Editor.

### Configuration

- **Soft-lock / Expiry Timing**: By default, the system locks dates for **30 minutes** after a user initiates checkout. You can change this in `server/index.js` by modifying `p_lock_minutes: 30` in the `create_pending_booking` RPC call.
- **Cron Job**: The backend runs a node-cron job every 5 minutes (`*/5 * * * *`) to sweep and mark bookings as `EXPIRED` if the 30-minute lock has passed without a successful payment. You can adjust this schedule in `server/index.js`.
