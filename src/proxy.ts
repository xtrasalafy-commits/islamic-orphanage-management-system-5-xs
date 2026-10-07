import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = [
  "/dashboard",
  "/anak",
  "/kebutuhan",
  "/perlindungan",
  "/kegiatan",
  "/donasi",
  "/pengeluaran",
  "/pengasuh",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get("panti_session")?.value);

  if (!hasSession && PROTECTED.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (hasSession && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/anak/:path*",
    "/kebutuhan/:path*",
    "/perlindungan/:path*",
    "/kegiatan/:path*",
    "/donasi/:path*",
    "/pengeluaran/:path*",
    "/pengasuh/:path*",
    "/login",
  ],
};
