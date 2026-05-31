import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | JNV Alumni Network",
  description: "Terms of service for the JNV Alumni Network platform.",
}

export default function TermsOfServicePage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none">
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: May 31, 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the JNV Alumni Network platform (&quot;the Platform&quot;), you agree to be
        bound by these Terms of Service. If you do not agree to these terms, you must not use the
        Platform.
      </p>

      <h2>2. Eligibility</h2>
      <ul>
        <li>You must be a former student (alumni) of any Jawahar Navodaya Vidyalaya (JNV) school in India.</li>
        <li>Your account is subject to verification and approval by Platform administrators.</li>
        <li>You must be at least 13 years of age to use the Platform.</li>
        <li>You must provide accurate and truthful information during registration.</li>
      </ul>

      <h2>3. Account Responsibilities</h2>
      <ul>
        <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
        <li>You are responsible for all activity that occurs under your account.</li>
        <li>You must notify us immediately of any unauthorized use of your account.</li>
        <li>You may not create multiple accounts or share your account with others.</li>
      </ul>

      <h2>4. Acceptable Use</h2>
      <p>You agree to use the Platform only for lawful purposes. You must not:</p>
      <ul>
        <li>Post false, misleading, or fraudulent content</li>
        <li>Impersonate another person or misrepresent your JNV affiliation</li>
        <li>Harass, abuse, threaten, or intimidate other users</li>
        <li>Post content that is obscene, defamatory, hateful, or discriminatory</li>
        <li>Spam, post unsolicited advertisements, or engage in promotional abuse</li>
        <li>Post content that infringes on intellectual property rights</li>
        <li>Attempt to gain unauthorized access to the Platform or other users&apos; accounts</li>
        <li>Use automated tools, bots, or scrapers to access the Platform</li>
        <li>Interfere with or disrupt the Platform&apos;s infrastructure</li>
        <li>Use the Platform for any illegal activity</li>
      </ul>

      <h2>5. Content Ownership and License</h2>
      <ul>
        <li>You retain ownership of content you post on the Platform (forum posts, listings, job postings, media, etc.).</li>
        <li>By posting content, you grant the Platform a non-exclusive, royalty-free license to display, distribute, and store your content as necessary to operate the Platform.</li>
        <li>The Platform reserves the right to remove any content that violates these Terms.</li>
      </ul>

      <h2>6. Marketplace</h2>
      <ul>
        <li>The Platform facilitates connections between buyers and sellers but is not a party to any transaction.</li>
        <li>All transactions are conducted directly between users. The Platform is not responsible for the quality, safety, or legality of items listed.</li>
        <li>Users are responsible for complying with applicable laws regarding their transactions.</li>
        <li>Listings must accurately represent the items being sold.</li>
      </ul>

      <h2>7. Jobs Board</h2>
      <ul>
        <li>Job postings must represent genuine employment opportunities.</li>
        <li>The Platform does not guarantee employment or verify the accuracy of job postings.</li>
        <li>Employers must comply with applicable employment laws.</li>
        <li>Job applications and hiring decisions are between the applicant and employer.</li>
      </ul>

      <h2>8. Mentorship</h2>
      <ul>
        <li>Mentorship connections are facilitated by the Platform but the relationship is between the mentor and mentee.</li>
        <li>The Platform does not guarantee the quality or outcomes of mentorship.</li>
        <li>Both mentors and mentees should engage in good faith and maintain professional conduct.</li>
      </ul>

      <h2>9. Moderation and Enforcement</h2>
      <ul>
        <li>The Platform reserves the right to remove content, issue warnings, suspend, or permanently ban accounts that violate these Terms.</li>
        <li>A three-strike warning system may be applied for repeated violations.</li>
        <li>Decisions by Platform administrators regarding content moderation are final.</li>
      </ul>

      <h2>10. Limitation of Liability</h2>
      <ul>
        <li>The Platform is provided &quot;as is&quot; without warranties of any kind.</li>
        <li>We are not liable for any damages arising from your use of the Platform.</li>
        <li>We are not responsible for content posted by users.</li>
        <li>We are not liable for any transactions between users.</li>
        <li>We do not guarantee the accuracy of information provided by users.</li>
      </ul>

      <h2>11. Account Termination</h2>
      <ul>
        <li>You may delete your account at any time through Settings. This permanently removes all your data.</li>
        <li>The Platform may terminate your account for violations of these Terms.</li>
        <li>Upon termination, your right to use the Platform ceases immediately.</li>
      </ul>

      <h2>12. Changes to Terms</h2>
      <p>
        We may modify these Terms at any time. Significant changes will be communicated through
        the Platform. Continued use after changes constitutes acceptance of the modified Terms.
      </p>

      <h2>13. Governing Law</h2>
      <p>
        These Terms are governed by the laws of India. Any disputes arising from these Terms
        shall be subject to the jurisdiction of the courts of India.
      </p>

      <h2>14. Contact</h2>
      <p>
        For questions about these Terms, contact the Platform administrators through the forum
        or announcements section.
      </p>
    </article>
  )
}
