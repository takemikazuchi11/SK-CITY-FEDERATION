# SK Calapan City Federation — Website User Manual

**Basic guide for Users & Administrators**  
*English · Editable source document · Add your own screenshots*

---

## How to use this file

- Edit this Markdown file in any text editor, VS Code, or Cursor.
- Copy sections into PowerPoint, Word, or Google Slides as needed.
- Replace `[INSERT SCREENSHOT: description]` placeholders with your images.
- Regenerate the PowerPoint: run `node docs/user-manual/generate-pptx.mjs` (requires `pptxgenjs`).

---

## 1. Introduction

### About this website

The **SK Calapan City Federation** website is the official online platform for youth programs, announcements, events, and transparency documents.

**What you can do:**

| Role | Capabilities |
|------|-------------|
| **User (Youth member)** | Browse content, register for events, manage account, download KK ID Card |
| **Editor** | Create announcements and events, upload resources |
| **Moderator** | Manage barangay-specific content and resources |
| **Admin** | Full platform management — users, events, disclosure, analytics |

`[INSERT SCREENSHOT: Dashboard home page]`

---

## 2. Getting Started

### 2.1 Creating an account

1. Open the website and go to **Login** (`/login`).
2. Select the **Register** tab.
3. Enter your **first name**, **last name**, **email**, **password**, and **barangay**.
4. Click **Register**.
5. Sign in with your new credentials.

**Optional:** Use **Sign in with Google** if you prefer OAuth login.

`[INSERT SCREENSHOT: Register tab on login page]`

### 2.2 Signing in

1. Go to **Login**.
2. Enter your **email** and **password**.
3. Click **Sign in**.

`[INSERT SCREENSHOT: Login page]`

### 2.3 Signing out

1. Click your **profile avatar** (top-right corner).
2. Scroll to the bottom of the profile menu.
3. Click **Logout**.

`[INSERT SCREENSHOT: Profile menu with Logout button]`

---

## 3. Dashboard & Navigation

### 3.1 Top navigation bar

| Menu | What it contains |
|------|-----------------|
| **Home** | Dashboard — announcements, events, news, disclosure board |
| **About** | Vision/mission, SK history, federation officers, barangay officials, about website |
| **Programs** | CYDC, Katipunan ng Kabataan (KK), Events |
| **Process** | BIR filing, COA report, ETPS, EFPS, fidelity bonding, disclosure, COA handbook |
| **Resources** | Downloadable documents |
| **Contact Us** | Contact the SK Federation |

`[INSERT SCREENSHOT: Top navigation bar with dropdowns open]`

### 3.2 Profile menu (all signed-in users)

| Menu item | Purpose |
|-----------|---------|
| **KK ID Card** | View and download your Katipunan ng Kabataan ID |
| **Account Settings** | Update profile, photo, password |
| **My Events** | Events you registered for |
| **Notifications** | Alerts and updates |
| **Support & Help** | FAQs and contact the dev team |

`[INSERT SCREENSHOT: Profile sidebar menu]`

---

## 4. User Guide — Everyday Features

### 4.1 Announcements & news

- Announcements appear on the **dashboard home page**.
- Click an announcement to read full details.
- Some announcements include **polls** — vote when available.
- **News** articles are shown in the news section; click to read more.

`[INSERT SCREENSHOT: Announcements on dashboard]`

### 4.2 Events

**Browse events**

1. Go to **Programs → Events**.
2. Click an event to view date, location, and description.

**Register for an event**

1. Open the event detail page.
2. Click **Register** (you must be signed in).
3. View your registrations under **My Events** in the profile menu.

`[INSERT SCREENSHOT: Events list]`
`[INSERT SCREENSHOT: Event detail with Register button]`

### 4.3 KK ID Card

1. Open **KK ID Card** from the profile menu.
2. If you have an approved KK registration, your card is displayed.
3. If not registered, follow the link to complete **KK registration**.
4. Click **Download** to save the ID as a PDF.

`[INSERT SCREENSHOT: KK ID Card page]`

### 4.4 Account settings

1. Profile menu → **Account Settings**.
2. Update name, phone, barangay, and profile photo.
3. Change your password in the password section.
4. Save your changes.

`[INSERT SCREENSHOT: Account Settings page]`

### 4.5 Resources & transparency

- **Resources** — browse and download federation files.
- **Disclosure Board** (dashboard) — quarterly financial transparency reports.
- **Process** pages — step-by-step guides for compliance (BIR, COA, EFPS, etc.).
- **Chatbot** — ask questions from the dashboard home page.

`[INSERT SCREENSHOT: Resources page]`
`[INSERT SCREENSHOT: Disclosure board section]`

---

## 5. Admin Guide — Management Tools

> **Note:** Admin features require an account with the **admin** role. Admin menu items appear at the top of the profile sidebar when signed in as an administrator.

### 5.1 User roles

| Role | Permissions (summary) |
|------|----------------------|
| **Admin** | Full access — users, events, announcements, disclosure, analytics |
| **Moderator** | Manage own barangay content and resources |
| **Editor** | Create announcements/events, upload resources |
| **User** | Standard member access |

### 5.2 Admin profile menu extras

When signed in as admin, the profile menu also shows:

- **Admin Dashboard**
- **Create Announcement**
- **Create Poll Announcement**
- **Create Event**
- **Add Files SKCF** (disclosure management)

`[INSERT SCREENSHOT: Admin profile menu items]`

### 5.3 Admin dashboard

**Path:** `/dashboard/admin`

- View platform statistics (users, events, announcements, KK registrations).
- Manage users, event participation, and KK registrations via tabs.
- Review analytics charts and event feedback.

`[INSERT SCREENSHOT: Admin Dashboard]`

### 5.4 Creating announcements

1. Profile menu → **Create Announcement**.
2. Enter title, content, category, and optional image.
3. Set visibility dates (start/end).
4. Publish — users may receive notifications.

**Polls:** Profile menu → **Create Poll Announcement**.

`[INSERT SCREENSHOT: Create Announcement form]`

### 5.5 Creating events

1. Profile menu → **Create Event**.
2. Fill in title, date, time, location, description, and image.
3. Save — the event appears under **Programs → Events**.
4. Track sign-ups in **Admin Dashboard → Event Participation**.

`[INSERT SCREENSHOT: Create Event form]`

### 5.6 Disclosure & user management

**Disclosure files**

1. Profile menu → **Add Files SKCF**.
2. Upload quarterly disclosure documents.
3. Files appear on the dashboard **Disclosure Board**.

**User management**

1. Admin Dashboard → **User Management** tab.
2. View users and update roles as needed.

`[INSERT SCREENSHOT: Disclosure management page]`
`[INSERT SCREENSHOT: User management table]`

---

## 6. FAQ & Support

### Frequently asked questions

**How do I register for events?**  
Go to Programs → Events, open an event, and click Register.

**How do I update my profile?**  
Profile menu → Account Settings.

**I'm not receiving notifications.**  
Check your account settings. If the issue continues, contact Support & Help.

**How do I get my KK ID Card?**  
Complete KK registration first, then open KK ID Card from the profile menu.

**How can I suggest new features?**  
Go to Support & Help and contact the development team.

### Support & Help

**Path:** `/dashboard/support`

- Email the development team directly from the page.
- Typical response time: **24–48 hours** (business days).

**Development team**

- Justin Goyena — Lead Developer
- Rose Ericka Leynes — Developer
- Charles Masangkay — Developer

`[INSERT SCREENSHOT: Support & Help page]`

---

## Screenshot checklist

Use this list when capturing screenshots for the manual:

- [ ] Login page
- [ ] Register tab
- [ ] Dashboard home
- [ ] Top navigation (with dropdowns)
- [ ] Profile menu
- [ ] Events list
- [ ] Event detail / Register button
- [ ] KK ID Card page
- [ ] Account Settings
- [ ] My Events
- [ ] Notifications
- [ ] Resources page
- [ ] Disclosure board
- [ ] Support & Help page
- [ ] Admin Dashboard
- [ ] Create Announcement form
- [ ] Create Event form
- [ ] Disclosure management
- [ ] User management table

---

*SK Calapan City Federation — Youth. Service. Progress.*
