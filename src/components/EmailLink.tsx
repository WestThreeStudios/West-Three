// The studio email as a link that opens a Gmail draft addressed to it —
// same destination as the footer link. Used inside the folder dropdowns.

export const EMAIL = "westthreestudio@gmail.com";
export const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

export default function EmailLink() {
  return (
    <a
      href={GMAIL_COMPOSE}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-ink underline decoration-ink/30 underline-offset-2 transition-colors hover:decoration-ink"
    >
      {EMAIL}
    </a>
  );
}
