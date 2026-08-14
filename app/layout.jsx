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
            __html: `(function(){try{var t=localStorage.getItem('jira:theme')||localStorage.getItem('iam-theme');if(t){document.documentElement.dataset.theme=t}else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.dataset.theme='dark'}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
