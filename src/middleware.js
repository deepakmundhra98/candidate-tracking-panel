import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    // Exclude /admin/login and /admin/forgetpassword from redirection
    if (
      !pathname.startsWith("/admin/login") &&
      !pathname.startsWith("/admin/forgetpassword")
    ) {
      let token = request.cookies.get("token");
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }

    // Redirect to dashboard if already logged in and trying to access login page
    if (pathname.startsWith("/admin/login")) {
      let token = request.cookies.get("token");
      if (token) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
  }

  if (pathname.startsWith("/employer")) {
    // Exclude /admin/login and /admin/forgetpassword from redirection
    if (
      !pathname.startsWith("/employer/login") &&
      !pathname.startsWith("/employer/forgetpassword") &&
      !pathname.startsWith("/employer/resetpassword")
    ) {
      let token = request.cookies.get("tokenEmployer");
      if (!token) {
        return NextResponse.redirect(new URL("/employer/login", request.url));
      }
    }

    // Redirect to dashboard if already logged in and trying to access login page
    if (pathname.startsWith("/employer/login")) {
      let token = request.cookies.get("tokenEmployer");
      if (token) {
        return NextResponse.redirect(
          new URL("/employer/dashboard", request.url)
        );
      }
    }
  }

  // if (pathname.startsWith('/staff')) {
  //   // Exclude /admin/login and /admin/forgetpassword from redirection
  //   if (!pathname.startsWith('/staff/login') && !pathname.startsWith('/staff/signup')) {
  //     let token = request.cookies.get('tokenStaff');
  //     if (!token) {
  //       return NextResponse.redirect(new URL('/staff/login', request.url));
  //     }
  //   }

  //   // Redirect to dashboard if already logged in and trying to access login page
  //   if (pathname.startsWith('/staff/login')) {
  //     let token = request.cookies.get('tokenStaff');
  //     if (token) {
  //       return NextResponse.redirect(new URL('/staff/dashboard', request.url));
  //     }
  //   }
  // }

  if (pathname.startsWith("/staff")) {
    // Exclude /staff/login from redirection
    if (
      !pathname.startsWith("/staff/login") &&
      !pathname.startsWith("/staff/forgetpassword") &&
      !pathname.startsWith("/staff/resetpassword")
    ) {
      let token = request.cookies.get("tokenStaff");
      if (!token) {
        return NextResponse.redirect(new URL("/staff/login", request.url));
      }
    }

    // Redirect to dashboard if already logged in and trying to access login page
    if (pathname.startsWith("/staff/login")) {
      let token = request.cookies.get("tokenStaff");
      if (token) {
        return NextResponse.redirect(new URL("/staff/dashboard", request.url));
      }
    }
  }

  // Rules for Candidate panel
  if (pathname.startsWith("/candidate-panel")) {
    // Exclude /staff/login from redirection
    if (
      !pathname.startsWith("/candidate-panel/login") &&
      !pathname.startsWith("/candidate-panel/forgot-password") &&
      !pathname.startsWith("/candidate-panel/register") &&
      !pathname.startsWith("/candidate-panel/resetpassword")
    ) {
      let token = request.cookies.get("tokenCandidate");
      if (!token) {
        return NextResponse.redirect(new URL("/candidate-panel/login", request.url));
      }
    }

    // Redirect to dashboard if already logged in and trying to access login page
    if (pathname.startsWith("/candidate-panel/login")) {
      let token = request.cookies.get("tokenCandidate");
      if (token) {
        return NextResponse.redirect(new URL("/candidate-panel/dashboard", request.url));
      }
    }
  }
}
