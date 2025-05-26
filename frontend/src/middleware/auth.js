import { authMiddleware } from "@clerk/clerk-react";

export default authMiddleware({
  publicRoutes: ["/", "/services", "/professionals"],
  ignoredRoutes: ["/api/webhook"]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 