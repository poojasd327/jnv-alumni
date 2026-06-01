const APP_NAME = "JNV Alumni Network"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

function baseLayout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${APP_NAME}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:#1e3a5f;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">${APP_NAME}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.5;">
                &copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.<br/>
                <a href="${APP_URL}/settings" style="color:#1e3a5f;text-decoration:underline;">Manage email preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function buttonHtml(text: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td style="background-color:#1e3a5f;border-radius:6px;padding:12px 24px;">
      <a href="${href}" style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">${text}</a>
    </td>
  </tr>
</table>`
}

export function welcomeEmail(name: string) {
  return {
    subject: `Welcome to ${APP_NAME}!`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:18px;">Welcome, ${name}!</h2>
      <p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.6;">
        Your account has been <strong>approved</strong> and you now have full access to the ${APP_NAME} platform.
      </p>
      <p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.6;">
        Here's what you can do:
      </p>
      <ul style="margin:0 0 12px;padding-left:20px;color:#374151;font-size:14px;line-height:1.8;">
        <li>Complete your profile to help batchmates find you</li>
        <li>Browse the alumni directory and reconnect</li>
        <li>Share and explore job opportunities</li>
        <li>Join discussions in the forum</li>
        <li>Discover upcoming events and reunions</li>
      </ul>
      ${buttonHtml("Go to Dashboard", APP_URL)}
    `),
  }
}

export function accountRejectedEmail(name: string) {
  return {
    subject: `${APP_NAME} — Account Update`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:18px;">Hi ${name},</h2>
      <p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.6;">
        We were unable to verify your JNV alumni status at this time. Your registration could not be approved.
      </p>
      <p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.6;">
        If you believe this is an error, please reach out to our support team with additional verification details (school name, passing year, ID card, etc.).
      </p>
      ${buttonHtml("Contact Support", `${APP_URL}/support`)}
    `),
  }
}

export function newMessageEmail(recipientName: string, senderName: string, preview: string) {
  return {
    subject: `New message from ${senderName}`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:18px;">Hi ${recipientName},</h2>
      <p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.6;">
        <strong>${senderName}</strong> sent you a message:
      </p>
      <div style="background-color:#f3f4f6;border-radius:6px;padding:16px;margin:16px 0;">
        <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;font-style:italic;">
          "${preview.length > 200 ? preview.slice(0, 200) + "…" : preview}"
        </p>
      </div>
      ${buttonHtml("Read & Reply", `${APP_URL}/messages`)}
    `),
  }
}

export function eventReminderEmail(name: string, eventTitle: string, eventDate: string, eventId: string) {
  return {
    subject: `Reminder: ${eventTitle}`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:18px;">Hi ${name},</h2>
      <p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.6;">
        This is a friendly reminder about an upcoming event you might be interested in:
      </p>
      <div style="background-color:#f3f4f6;border-radius:6px;padding:16px;margin:16px 0;">
        <h3 style="margin:0 0 8px;color:#111827;font-size:16px;">${eventTitle}</h3>
        <p style="margin:0;color:#6b7280;font-size:14px;">${eventDate}</p>
      </div>
      ${buttonHtml("View Event Details", `${APP_URL}/events/${eventId}`)}
    `),
  }
}

export function jobMatchEmail(name: string, jobTitle: string, company: string, jobId: string) {
  return {
    subject: `New job opportunity: ${jobTitle}`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:18px;">Hi ${name},</h2>
      <p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.6;">
        A new job matching your profile has been posted by a fellow alumni:
      </p>
      <div style="background-color:#f3f4f6;border-radius:6px;padding:16px;margin:16px 0;">
        <h3 style="margin:0 0 4px;color:#111827;font-size:16px;">${jobTitle}</h3>
        <p style="margin:0;color:#6b7280;font-size:14px;">${company}</p>
      </div>
      ${buttonHtml("View Job", `${APP_URL}/jobs/${jobId}`)}
    `),
  }
}

export function mentorshipRequestEmail(mentorName: string, menteeName: string, area: string) {
  return {
    subject: `New mentorship request from ${menteeName}`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:18px;">Hi ${mentorName},</h2>
      <p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.6;">
        <strong>${menteeName}</strong> has requested your mentorship in <strong>${area}</strong>.
      </p>
      <p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.6;">
        Log in to review the request and connect with them.
      </p>
      ${buttonHtml("View Request", `${APP_URL}/mentorship`)}
    `),
  }
}

export function announcementEmail(name: string, title: string, preview: string, announcementId: string) {
  return {
    subject: `📢 ${title}`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:18px;">Hi ${name},</h2>
      <p style="margin:0 0 12px;color:#374151;font-size:14px;line-height:1.6;">
        A new announcement has been posted:
      </p>
      <div style="background-color:#f3f4f6;border-radius:6px;padding:16px;margin:16px 0;">
        <h3 style="margin:0 0 8px;color:#111827;font-size:16px;">${title}</h3>
        <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">
          ${preview.length > 300 ? preview.slice(0, 300) + "…" : preview}
        </p>
      </div>
      ${buttonHtml("Read More", `${APP_URL}/announcements/${announcementId}`)}
    `),
  }
}

export function weeklyDigestEmail(name: string, stats: { newMembers: number; newJobs: number; upcomingEvents: number; forumPosts: number }) {
  return {
    subject: `Your weekly digest — ${APP_NAME}`,
    html: baseLayout(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:18px;">Hi ${name},</h2>
      <p style="margin:0 0 16px;color:#374151;font-size:14px;line-height:1.6;">
        Here's what happened this week in the JNV Alumni community:
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0;">
        <tr>
          <td style="padding:12px;background-color:#eff6ff;border-radius:6px;text-align:center;width:25%;">
            <p style="margin:0;font-size:24px;font-weight:700;color:#1e3a5f;">${stats.newMembers}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">New Members</p>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;background-color:#f0fdf4;border-radius:6px;text-align:center;width:25%;">
            <p style="margin:0;font-size:24px;font-weight:700;color:#166534;">${stats.newJobs}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">New Jobs</p>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;background-color:#fef3c7;border-radius:6px;text-align:center;width:25%;">
            <p style="margin:0;font-size:24px;font-weight:700;color:#92400e;">${stats.upcomingEvents}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Events</p>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;background-color:#fce7f3;border-radius:6px;text-align:center;width:25%;">
            <p style="margin:0;font-size:24px;font-weight:700;color:#9d174d;">${stats.forumPosts}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Discussions</p>
          </td>
        </tr>
      </table>
      ${buttonHtml("Explore Now", APP_URL)}
    `),
  }
}
