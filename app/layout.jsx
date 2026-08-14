import "./globals.css";
import LiveBackground from "../components/LiveBackground";

export const metadata = {
  title: "Jira Access — Bipolar Factory",
  description: "Single Admin Provisioning Controller for Task Projects, User Access Matrices, and Real-time Audit Logs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('iam-theme')||localStorage.getItem('jira:theme');if(t){document.documentElement.dataset.theme=t}var p=localStorage.getItem('iam-bg-preset');if(p){document.documentElement.dataset.bgPreset=p}var m=localStorage.getItem('iam-bg-motion');if(m){document.documentElement.dataset.bgMotion=m}}catch(e){}})()`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <LiveBackground />
        {children}
      </body>
    </html>
  );
}
