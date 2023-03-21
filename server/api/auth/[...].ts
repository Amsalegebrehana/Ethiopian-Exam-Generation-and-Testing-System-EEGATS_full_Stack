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
        // console.warn(
        //   "ATTENTION: You should replace this with your real providers or credential provider logic! The current setup is not safe"
        // );
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!
        if (credentials != null) {
          // Any object returned will be saved in `user` property of the JWT
          if (credentials?.role === "admin") {
            if (credentials?.email && credentials?.password) {
              const adminUser = await prisma.admin.findUnique({
                where: {
                  email: credentials.email,
                },
              });

              if (adminUser !== null) {
                const res = await confirmPasswordHash(
                  credentials.password,
                  adminUser.password
                );
                const user = {
                  id: adminUser.id,
                  name: adminUser.name,
                  role: "admin",
                };
                if (res === true) {
                  return user;
                } else {
                  return null;
                }
              } else {
                return null;
              }
            }
          } else if (credentials?.role === "contributor") {
            if (credentials?.email && credentials?.password) {
              const contributorUser = await prisma.contributors.findUnique({
                where: {
                  email: credentials.email,
                },
              });
              if (contributorUser !== null && contributorUser?.isActive) {
                const res = await confirmPasswordHash(
                  credentials.password,
                  contributorUser.password
                );
                const user = {
                  id: contributorUser.id,
                  name: contributorUser.name,
                  role: "contributor",
                };
                if (res === true) {
                  return user;
                } else {
                  return null;
                }
              } else {
                return null;
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
                  return user;
                } else {
                  return null;
                }
              } else {
                return null;
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
