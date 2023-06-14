import CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";
const { authSecret } = useRuntimeConfig();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

const confirmPasswordHash = (plainPassword: string, hashedPassword: string) => {
  return new Promise((resolve) => {
    bcrypt.compare(plainPassword, hashedPassword, function (err, res) {
      resolve(res);
    });
  });
};

export default NuxtAuthHandler({
  session: {
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  secret: authSecret,
  pages: {
    // Change the default behavior to use `/login` as the path for the sign-in page
    signIn: "/",
  },
  callbacks: {
    // Callback when the JWT is created / updated, see https://next-auth.js.org/configuration/callbacks#jwt-callback
    jwt: async ({ token, user }) => {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        token.jwt = user ? (user as any).access_token || "" : "";
        token.id = user ? user.id || "" : "";
        token.role = user ? (user as any).role || "" : "";
        typeof window !== 'undefined' ? localStorage.setItem("userId", token.id as string) : null;

      }
      return Promise.resolve(token);
    },
    // Callback whenever session is checked, see https://next-auth.js.org/configuration/callbacks#session-callback
    session: async ({ session, token }) => {
      (session as any).role = token.role;
      (session as any).uid = token.id;
      return Promise.resolve(session);
    },
  },
  // TODO: ADD YOUR OWN AUTHENTICATION PROVIDER HERE, READ THE DOCS FOR MORE: https://sidebase.io/nuxt-auth
  providers: [
    //// @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    // GithubProvider.default({
    //   clientId: process.env.GITHUB_CLIENT_ID || 'enter-your-client-id-here',
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET || 'enter-your-client-secret-here' // TODO: Replace this with an env var like "process.env.GITHUB_CLIENT_SECRET". The secret should never end up in your github repository
    // }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "(hint: jsmith)",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "(hint: hunter2)",
        },
      },
      async authorize(credentials: any) {
        if (credentials != null) {
          // Any object returned will be saved in `user` property of the JWT
          if (credentials?.role === "admin") {
            if (credentials?.otp && credentials?.adminId) {
              const adminUser = await prisma.admin.findUnique({
                where: {
                  id: credentials.adminId,
                },
              });

              if (adminUser !== null) {
                const res = await confirmPasswordHash(
                  credentials.otp,
                  adminUser.otp
                );
                const user = {
                  id: adminUser.id,
                  name: adminUser.name,
                  role: "admin",
                };
                if (res === true && adminUser.otpExpiryDate > new Date())  {
                  return user;
                } else {
                  throw new Error("Invalid otp. Please try again");
                }
              } else {
                throw new Error("Invalid credentials");
              }
            }
          } else if (credentials?.role === "contributor") {
            if (credentials?.otp && credentials?.contrId) {
              const contributorUser = await prisma.contributors.findUnique({
                where: {
                  id: credentials.contrId,
                },
              });
              if (contributorUser !== null && contributorUser?.isActive) {
                if (contributorUser?.failedAttempts >= 3) {
                  throw new Error("Multiple failed attempts, you account has been locked, please contact system admin");
                }
                const res = await confirmPasswordHash(
                  credentials.otp,
                  contributorUser.otp
                );
                const user = {
                  id: contributorUser.id,
                  name: contributorUser.name,
                  role: "contributor",
                };
                if (res === true && contributorUser.otpExpiryDate > new Date()) {
                  await prisma.contributors.update({
                    where: {
                      id: contributorUser.id,
                    },
                    data: {
                      failedAttempts: 0
                    }
                  });
                  return user;
                } else {
                  await prisma.contributors.update({
                    where: {
                      id: contributorUser.id,
                    },
                    data: {
                      failedAttempts: {
                        increment: 1,
                      }
                    }
                  });
                  throw new Error("Invalid credentials");
                }
              } else {
                throw new Error("Invalid credentials");
              }
            }
          } else {
            if (credentials?.username && credentials?.password) {
              const testTakerUser = await prisma.testTakers.findUnique({
                where: {
                  username: credentials.username,
                },
              });
              if (testTakerUser !== null) {
                if (testTakerUser?.failedAttempts >= 3) {
                  throw new Error("Multiple failed attempts, you account has been locked, please contact system admin");
                }
                const res = await confirmPasswordHash(
                  credentials.password,
                  testTakerUser.password
                );
                const user = {
                  id: testTakerUser.id,
                  name: testTakerUser.name,
                  role: "testtaker",
                };
                if (res === true) {
                  await prisma.testTakers.update({
                    where: {
                      id: testTakerUser.id,
                    },
                    data: {
                      failedAttempts: 0
                    }
                  });
                  return user;
                } else {
                  await prisma.testTakers.update({
                    where: {
                      id: testTakerUser.id,
                    },
                    data: {
                      failedAttempts: {
                        increment: 1,
                      }
                    }
                  });
                  throw new Error("Invalid credentials");
                }
              } else {
                throw new Error("Invalid credentials");
              }
            }
          }
        } else {
          console.error(
            "Warning: Malicious login attempt registered, bad credentials provided"
          );

          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
});
