import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | JNV Alumni Network",
  description: "Privacy policy for the JNV Alumni Network platform.",
}

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: May 31, 2026</p>

      <h2>1. Introduction</h2>
      <p>
        JNV Alumni Network (&quot;we&quot;, &quot;our&quot;, &quot;the Platform&quot;) is committed to protecting the privacy
        of its users. This Privacy Policy explains how we collect, use, store, and protect your
        personal information when you use our platform.
      </p>

      <h2>2. Information We Collect</h2>
      <h3>2.1 Information You Provide</h3>
      <ul>
        <li><strong>Registration data:</strong> Full name, email address, mobile number, JNV school, batch year, state</li>
        <li><strong>Profile data:</strong> Profession, company, industry, skills, bio, LinkedIn URL, portfolio URL, WhatsApp number, profile photo</li>
        <li><strong>Content you create:</strong> Forum posts, comments, job postings, marketplace listings, event details, business listings, media uploads, mentorship requests</li>
        <li><strong>Communication data:</strong> Messages sent through the platform, application submissions</li>
      </ul>

      <h3>2.2 Information Collected Automatically</h3>
      <ul>
        <li><strong>Usage data:</strong> Pages visited, features used, search queries</li>
        <li><strong>Device data:</strong> Browser type, operating system, screen resolution</li>
        <li><strong>Log data:</strong> IP address, access times, referring URLs</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>To provide and maintain the platform and its features</li>
        <li>To verify your JNV alumni status through the approval process</li>
        <li>To enable alumni to find and connect with each other via the directory</li>
        <li>To facilitate job postings, marketplace transactions, and event management</li>
        <li>To send notifications about activity relevant to you (mentorship requests, job applications, event updates)</li>
        <li>To improve the platform through aggregated, anonymized analytics</li>
        <li>To enforce our Terms of Service and maintain platform security</li>
      </ul>

      <h2>4. Information Sharing</h2>
      <p>We do not sell your personal data to third parties. Your information may be shared in the following circumstances:</p>
      <ul>
        <li><strong>With other users:</strong> Your profile information (name, school, batch, profession, skills) is visible to other approved alumni in the directory. Contact details are only shown if you choose to provide them.</li>
        <li><strong>With administrators:</strong> Platform admins can view user data for moderation and approval purposes.</li>
        <li><strong>Legal requirements:</strong> When required by law, regulation, or legal process.</li>
        <li><strong>Platform security:</strong> To investigate violations of our Terms of Service.</li>
      </ul>

      <h2>5. Data Storage and Security</h2>
      <ul>
        <li>Your data is stored securely on Supabase (PostgreSQL) with Row Level Security (RLS) policies ensuring users can only access authorized data.</li>
        <li>Passwords are hashed and never stored in plain text.</li>
        <li>All data transmission uses HTTPS/TLS encryption.</li>
        <li>File uploads (avatars, listing images, media) are stored in secure, access-controlled storage buckets.</li>
      </ul>

      <h2>6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li><strong>Access:</strong> View all personal data we hold about you through your profile and settings pages.</li>
        <li><strong>Correction:</strong> Update your profile information at any time via the profile edit page.</li>
        <li><strong>Deletion:</strong> Delete your account and all associated data through Settings &gt; Danger Zone. This action is permanent and cannot be undone.</li>
        <li><strong>Restriction:</strong> Contact us to restrict processing of your data in certain circumstances.</li>
      </ul>

      <h2>7. Cookies</h2>
      <p>
        We use essential cookies for authentication and session management. These cookies are
        necessary for the platform to function and cannot be disabled. We do not use tracking
        or advertising cookies.
      </p>

      <h2>8. Data Retention</h2>
      <p>
        We retain your data for as long as your account is active. When you delete your account,
        all personal data is permanently removed from our systems, including profile data,
        listings, job posts, applications, forum posts, and all other user-generated content.
      </p>

      <h2>9. Children&apos;s Privacy</h2>
      <p>
        The platform is intended for JNV alumni and is not directed at children under 13.
        We do not knowingly collect data from children under 13.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify users of significant
        changes through the platform. Continued use of the platform after changes constitutes
        acceptance of the updated policy.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy or your data, please contact the platform
        administrators through the forum or announcements section.
      </p>
    </article>
  )
}
