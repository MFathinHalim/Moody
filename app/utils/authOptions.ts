// app/utils/authOptions.ts
import GoogleProvider from "next-auth/providers/google";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";
import jwt from "jsonwebtoken";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user }) {
      await connectDB();
      let existing = await User.findOne({ email: user.email });

      if (!existing) {
        existing = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }

      (user as any)._id = existing._id.toString();

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any)._id; // simpan id ke token
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name,
        email: token.email,
        image: token.image,
      };
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
