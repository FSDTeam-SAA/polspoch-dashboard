
import React from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen relative bg-[#FCFBF8]">

            {/* Page Content */}
            <main className="flex-1 p-4">{children}</main>

        </div>
    );
}
