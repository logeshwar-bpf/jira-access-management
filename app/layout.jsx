import "./globals.css";

export const metadata = {
  title: "Jira Access — Bipolar Factory",
  description: "Single Admin Provisioning Controller for Task Projects, User Access Matrices, and Real-time Audit Logs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('iam-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
