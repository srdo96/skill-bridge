var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express10 from "express";

// src/env.ts
import "dotenv/config";
import { z } from "zod";
var envSchema = z.object({
  PORT: z.coerce.number().default(5e3),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  CORS_ORIGIN: z.string(),
  ADMIN_NAME: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string()
});
var parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error("Invalid env.....");
  console.log(z.prettifyError(parsedEnv.error));
  process.exit(1);
}
var env = {
  port: parsedEnv.data.PORT,
  dbUrl: parsedEnv.data.DATABASE_URL,
  betterAuthSecret: parsedEnv.data.BETTER_AUTH_SECRET,
  betterAuthUrl: parsedEnv.data.BETTER_AUTH_URL,
  corsOrigin: parsedEnv.data.CORS_ORIGIN,
  adminName: parsedEnv.data.ADMIN_NAME,
  adminEmail: parsedEnv.data.ADMIN_EMAIL,
  adminPassword: parsedEnv.data.ADMIN_PASSWORD
};

// src/lib/auth.ts
import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// generated/prisma/enums.ts
var UserRoles = {
  STUDENT: "STUDENT",
  TUTOR: "TUTOR",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BAN: "BAN"
};
var BookingStatus = {
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// generated/prisma/client.ts
import "process";
import * as path from "path";
import { fileURLToPath } from "url";
import "@prisma/client/runtime/client";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'enum UserRoles {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BAN\n}\n\nmodel User {\n  id            String        @id\n  name          String\n  email         String\n  emailVerified Boolean       @default(true)\n  image         String?\n  createdAt     DateTime      @default(now())\n  updatedAt     DateTime      @updatedAt\n  role          UserRoles     @default(STUDENT)\n  phone         String?\n  status        UserStatus    @default(ACTIVE)\n  sessions      Session[]\n  accounts      Account[]\n  bookings      Booking[]\n  tutorProfiles TutorProfile?\n  reviews       Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Days {\n  SATURDAY\n  SUNDAY\n  MONDAY\n  TUESDAY\n  WEDNESDAY\n  THURSDAY\n  FRIDAY\n}\n\nmodel Availability {\n  availability_id  String @id @default(uuid())\n  tutor_profile_id String\n  day_of_week      Days\n  start_time       String\n  end_time         String\n\n  created_at DateTime @default(now())\n  updated_at DateTime @updatedAt\n\n  tutor_profile TutorProfile @relation(fields: [tutor_profile_id], references: [tutor_profile_id], onDelete: Cascade)\n\n  @@unique([tutor_profile_id, day_of_week, start_time, end_time], name: "unique_per_tutor_day_time")\n  @@map("availability")\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nmodel Booking {\n  booking_id       String        @id @default(uuid())\n  student_id       String\n  tutor_profile_id String\n  subject_id       String\n  day_of_week      Days\n  start_time       String\n  end_time         String\n  // start_time       DateTime\n  // end_time         DateTime\n  status           BookingStatus @default(CONFIRMED)\n  price            Decimal       @db.Decimal(7, 2)\n  meeting_link     String?       @db.Text\n  created_at       DateTime      @default(now())\n  updated_at       DateTime      @updatedAt\n\n  student      User         @relation(fields: [student_id], references: [id])\n  subject      Subject      @relation(fields: [subject_id], references: [subject_id])\n  tutorProfile TutorProfile @relation(fields: [tutor_profile_id], references: [tutor_profile_id])\n  reviews      Review[]\n\n  @@map("bookings")\n}\n\nmodel Category {\n  category_id String    @id @default(uuid())\n  name        String    @unique @db.VarChar(250)\n  desc        String?   @db.VarChar(250)\n  img_url     String?   @db.Text\n  created_at  DateTime  @default(now())\n  updated_at  DateTime  @updatedAt\n  subjects    Subject[]\n\n  @@map("categories")\n}\n\nmodel Subject {\n  subject_id    String         @id @default(uuid())\n  name          String         @unique @db.VarChar(250)\n  desc          String?        @db.Text\n  img_url       String?        @db.Text\n  category_id   String\n  category      Category       @relation(fields: [category_id], references: [category_id])\n  created_at    DateTime       @default(now())\n  updated_at    DateTime       @updatedAt\n  bookings      Booking[]\n  tutorSubjects TutorSubject[]\n\n  @@map("subjects")\n}\n\nmodel Review {\n  review_id        String   @id @default(uuid())\n  booking_id       String   @unique\n  tutor_profile_id String\n  student_id       String\n  rating           Int\n  comment          String?  @db.Text\n  created_at       DateTime @default(now())\n\n  booking      Booking      @relation(fields: [booking_id], references: [booking_id])\n  tutorProfile TutorProfile @relation(fields: [tutor_profile_id], references: [tutor_profile_id])\n  student      User         @relation(fields: [student_id], references: [id])\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel TutorProfile {\n  tutor_profile_id   String   @id @default(uuid())\n  hourly_rate        Decimal  @db.Decimal(10, 2)\n  year_of_experience Int      @default(0)\n  avg_rating         Decimal  @default(0.0) @db.Decimal(2, 1)\n  tutor_id           String   @unique\n  is_featured        Boolean  @default(false)\n  created_at         DateTime @default(now())\n  updated_at         DateTime @updatedAt\n\n  tutor          User           @relation(fields: [tutor_id], references: [id])\n  bookings       Booking[]\n  availabilities Availability[]\n  tutorSubjects  TutorSubject[]\n  reviews        Review[]\n\n  @@map("tutor_profiles")\n}\n\nmodel TutorSubject {\n  tutor_profile_id String\n  subject_id       String\n\n  tutor   TutorProfile @relation(fields: [tutor_profile_id], references: [tutor_profile_id], onDelete: Cascade)\n  subject Subject      @relation(fields: [subject_id], references: [subject_id], onDelete: Cascade)\n\n  @@id([tutor_profile_id, subject_id])\n  @@map("tutor_subjects")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"UserRoles"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToUser"},{"name":"tutorProfiles","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Availability":{"fields":[{"name":"availability_id","kind":"scalar","type":"String"},{"name":"tutor_profile_id","kind":"scalar","type":"String"},{"name":"day_of_week","kind":"enum","type":"Days"},{"name":"start_time","kind":"scalar","type":"String"},{"name":"end_time","kind":"scalar","type":"String"},{"name":"created_at","kind":"scalar","type":"DateTime"},{"name":"updated_at","kind":"scalar","type":"DateTime"},{"name":"tutor_profile","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"}],"dbName":"availability"},"Booking":{"fields":[{"name":"booking_id","kind":"scalar","type":"String"},{"name":"student_id","kind":"scalar","type":"String"},{"name":"tutor_profile_id","kind":"scalar","type":"String"},{"name":"subject_id","kind":"scalar","type":"String"},{"name":"day_of_week","kind":"enum","type":"Days"},{"name":"start_time","kind":"scalar","type":"String"},{"name":"end_time","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"meeting_link","kind":"scalar","type":"String"},{"name":"created_at","kind":"scalar","type":"DateTime"},{"name":"updated_at","kind":"scalar","type":"DateTime"},{"name":"student","kind":"object","type":"User","relationName":"BookingToUser"},{"name":"subject","kind":"object","type":"Subject","relationName":"BookingToSubject"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"BookingToReview"}],"dbName":"bookings"},"Category":{"fields":[{"name":"category_id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"desc","kind":"scalar","type":"String"},{"name":"img_url","kind":"scalar","type":"String"},{"name":"created_at","kind":"scalar","type":"DateTime"},{"name":"updated_at","kind":"scalar","type":"DateTime"},{"name":"subjects","kind":"object","type":"Subject","relationName":"CategoryToSubject"}],"dbName":"categories"},"Subject":{"fields":[{"name":"subject_id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"desc","kind":"scalar","type":"String"},{"name":"img_url","kind":"scalar","type":"String"},{"name":"category_id","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToSubject"},{"name":"created_at","kind":"scalar","type":"DateTime"},{"name":"updated_at","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToSubject"},{"name":"tutorSubjects","kind":"object","type":"TutorSubject","relationName":"SubjectToTutorSubject"}],"dbName":"subjects"},"Review":{"fields":[{"name":"review_id","kind":"scalar","type":"String"},{"name":"booking_id","kind":"scalar","type":"String"},{"name":"tutor_profile_id","kind":"scalar","type":"String"},{"name":"student_id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"created_at","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"}],"dbName":null},"TutorProfile":{"fields":[{"name":"tutor_profile_id","kind":"scalar","type":"String"},{"name":"hourly_rate","kind":"scalar","type":"Decimal"},{"name":"year_of_experience","kind":"scalar","type":"Int"},{"name":"avg_rating","kind":"scalar","type":"Decimal"},{"name":"tutor_id","kind":"scalar","type":"String"},{"name":"is_featured","kind":"scalar","type":"Boolean"},{"name":"created_at","kind":"scalar","type":"DateTime"},{"name":"updated_at","kind":"scalar","type":"DateTime"},{"name":"tutor","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"availabilities","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"tutorSubjects","kind":"object","type":"TutorSubject","relationName":"TutorProfileToTutorSubject"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"}],"dbName":"tutor_profiles"},"TutorSubject":{"fields":[{"name":"tutor_profile_id","kind":"scalar","type":"String"},{"name":"subject_id","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorProfileToTutorSubject"},{"name":"subject","kind":"object","type":"Subject","relationName":"SubjectToTutorSubject"}],"dbName":"tutor_subjects"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AvailabilityScalarFieldEnum: () => AvailabilityScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  SubjectScalarFieldEnum: () => SubjectScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  TutorSubjectScalarFieldEnum: () => TutorSubjectScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Availability: "Availability",
  Booking: "Booking",
  Category: "Category",
  Subject: "Subject",
  Review: "Review",
  TutorProfile: "TutorProfile",
  TutorSubject: "TutorSubject"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AvailabilityScalarFieldEnum = {
  availability_id: "availability_id",
  tutor_profile_id: "tutor_profile_id",
  day_of_week: "day_of_week",
  start_time: "start_time",
  end_time: "end_time",
  created_at: "created_at",
  updated_at: "updated_at"
};
var BookingScalarFieldEnum = {
  booking_id: "booking_id",
  student_id: "student_id",
  tutor_profile_id: "tutor_profile_id",
  subject_id: "subject_id",
  day_of_week: "day_of_week",
  start_time: "start_time",
  end_time: "end_time",
  status: "status",
  price: "price",
  meeting_link: "meeting_link",
  created_at: "created_at",
  updated_at: "updated_at"
};
var CategoryScalarFieldEnum = {
  category_id: "category_id",
  name: "name",
  desc: "desc",
  img_url: "img_url",
  created_at: "created_at",
  updated_at: "updated_at"
};
var SubjectScalarFieldEnum = {
  subject_id: "subject_id",
  name: "name",
  desc: "desc",
  img_url: "img_url",
  category_id: "category_id",
  created_at: "created_at",
  updated_at: "updated_at"
};
var ReviewScalarFieldEnum = {
  review_id: "review_id",
  booking_id: "booking_id",
  tutor_profile_id: "tutor_profile_id",
  student_id: "student_id",
  rating: "rating",
  comment: "comment",
  created_at: "created_at"
};
var TutorProfileScalarFieldEnum = {
  tutor_profile_id: "tutor_profile_id",
  hourly_rate: "hourly_rate",
  year_of_experience: "year_of_experience",
  avg_rating: "avg_rating",
  tutor_id: "tutor_id",
  is_featured: "is_featured",
  created_at: "created_at",
  updated_at: "updated_at"
};
var TutorSubjectScalarFieldEnum = {
  tutor_profile_id: "tutor_profile_id",
  subject_id: "subject_id"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = env.dbUrl;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  baseURL: env.betterAuthUrl,
  trustedOrigins: [env.corsOrigin],
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { status: true }
          });
          if (!user) return false;
          if (user.status === UserStatus.BAN) {
            throw new APIError("FORBIDDEN", {
              message: "Your account has been banned. Please contact support."
            });
          }
        }
      }
    }
  },
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "STUDENT" },
      phone: { type: "string", required: false },
      img_url: { type: "string", required: false },
      status: { type: "string", required: false, defaultValue: "ACTIVE" }
    }
  }
});

// src/middlewares/globalErrorHandler.ts
function errorHandler(err, _req, res, _next) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = 400;
    errorMessage = "You provide incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 404;
      errorMessage = "Requested record not found";
    } else if (err.code === "P2002") {
      statusCode = 409;
      errorMessage = err.meta?.driverAdapterError?.cause?.originalMessage || "Duplicate value violates unique constraint";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "An unknown database error occurred.";
  }
  res.status(statusCode);
  res.json({ success: false, message: errorMessage, error: err });
}
var globalErrorHandler_default = errorHandler;

// src/middlewares/notFound.ts
var notFound = (req, res) => {
  res.status(404).json({
    message: "The requested resource was not found on this server",
    status: 404,
    path: req.originalUrl
  });
};
var notFound_default = notFound;

// src/routes/v1.ts
import { Router as Router4 } from "express";

// src/modules/availability/availability.router.ts
import express from "express";

// src/middlewares/auth.ts
import { fromNodeHeaders } from "better-auth/node";
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      const userStatus = session.user.status;
      if (userStatus === UserStatus.BAN) {
        return res.status(403).json({
          success: false,
          message: "Your account has been banned. Please contact support."
        });
      }
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        role: session.user.role,
        status: userStatus ?? UserStatus.ACTIVE
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! Unauthorize User."
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth2;

// src/lib/responseHandler.ts
var sendResponse = (res, { success, statusCode, message, data, meta }) => {
  return res.status(statusCode).json({ success, message, data, meta });
};

// src/modules/availability/availability.service.ts
var createAvailability = async (payloads) => {
  console.log("createAvailability", payloads);
  return await prisma.availability.createManyAndReturn({ data: payloads });
};
var getAllAvailability = async () => {
  return await prisma.availability.findMany();
};
var deleteAvailabilityById = async (availabilityId) => {
  return await prisma.availability.delete({
    where: { availability_id: availabilityId }
  });
};
var availabilityService = {
  createAvailability,
  getAllAvailability,
  deleteAvailabilityById
};

// src/modules/availability/availability.controller.ts
var createAvailability2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tutorProfile = await prisma.tutorProfile.findUniqueOrThrow({
      where: { tutor_id: userId },
      select: { tutor_profile_id: true }
    });
    if (!Array.isArray(req.body)) {
      req.body = [req.body];
    }
    const payloads = req.body.map((item) => {
      return {
        ...item,
        tutor_profile_id: tutorProfile.tutor_profile_id
      };
    });
    const data = await availabilityService.createAvailability(payloads);
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Created availability successfully",
      data
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var deleteAvailabilityById2 = async (req, res, next) => {
  try {
    await availabilityService.deleteAvailabilityById(
      req.params.availabilityId
    );
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
var availabilityController = {
  createAvailability: createAvailability2,
  deleteAvailabilityById: deleteAvailabilityById2
};

// src/modules/availability/availability.router.ts
var router = express.Router();
router.post(
  "/",
  auth_default(UserRoles.TUTOR),
  availabilityController.createAvailability
);
router.delete(
  "/:availabilityId",
  auth_default(UserRoles.TUTOR),
  availabilityController.deleteAvailabilityById
);
var availability_router_default = router;

// src/modules/booking/booking.router.ts
import express2 from "express";

// src/modules/booking/booking.controller.ts
import { randomUUID } from "crypto";

// src/utils/paginationSortingHelper.ts
var paginationSortingHelper = (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  return { page, limit, skip, sortBy, sortOrder };
};
var paginationSortingHelper_default = paginationSortingHelper;

// src/modules/booking/booking.service.ts
var createBooking = async (payload) => {
  const hourlyRate = await prisma.tutorProfile.findUniqueOrThrow({
    where: { tutor_profile_id: payload.tutor_profile_id },
    select: { hourly_rate: true }
  });
  const minRate = Number(hourlyRate.hourly_rate) / 60;
  const endTimeSplit = payload.end_time.split(":");
  const endTimeMin = Number(endTimeSplit[0]) * 60 + Number(endTimeSplit[1]);
  const startTimeSplit = payload.start_time.split(":");
  const startTimeMin = Number(startTimeSplit[0]) * 60 + Number(startTimeSplit[1]);
  const durationMin = endTimeMin - startTimeMin;
  const price = minRate * durationMin;
  return await prisma.booking.create({
    data: {
      ...payload,
      price
    }
  });
};
var getBookingsByUserId = async (userId) => {
  return await prisma.booking.findMany({
    where: {
      OR: [
        { student_id: userId },
        { tutorProfile: { tutor_id: userId } }
      ]
    },
    omit: { subject_id: true, tutor_profile_id: true, student_id: true },
    include: {
      subject: true,
      tutorProfile: true,
      student: true
    }
  });
};
var getAllBookings = async (page, limit, skip, userId) => {
  const where = userId ? {
    OR: [{ student_id: userId }, { tutor_profile_id: userId }]
  } : void 0;
  const [total, bookings] = await Promise.all([
    prisma.booking.count({
      ...where ? { where } : {}
    }),
    prisma.booking.findMany({
      ...where ? { where } : {},
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
      include: {
        subject: true,
        tutorProfile: true,
        student: true
      }
    })
  ]);
  return {
    total,
    page,
    limit,
    bookings,
    totalPages: Math.ceil(total / limit)
  };
};
var getBookingDetails = async (bookingId) => {
  console.log(bookingId);
  return await prisma.booking.findUniqueOrThrow({
    where: { booking_id: bookingId },
    include: {
      tutorProfile: {
        include: {
          tutor: true
        }
      },
      subject: true,
      student: true,
      reviews: true
    }
  });
};
var cancelBooking = async (bookingId) => {
  return await prisma.booking.update({
    where: { booking_id: bookingId },
    data: { status: BookingStatus.CANCELLED }
  });
};
var bookingService = {
  createBooking,
  getBookingsByUserId,
  getAllBookings,
  getBookingDetails,
  cancelBooking
};

// src/modules/booking/booking.controller.ts
var createBooking2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const uuid = randomUUID();
    const bookingData = {
      ...req.body,
      student_id: userId,
      meeting_link: `https://sb.com/${uuid}&${userId}`
    };
    const data = await bookingService.createBooking(bookingData);
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Booking created successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var getBookingsByUserId2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await bookingService.getBookingsByUserId(userId);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Bookings fetched successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var getBookingDetails2 = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    if (!bookingId) throw new Error("Booking Id Required!");
    if (Array.isArray(bookingId)) throw new Error("Id Formant not valid");
    const data = await bookingService.getBookingDetails(bookingId);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get Booking details successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var getAllBookings2 = async (req, res, next) => {
  try {
    let userId = void 0;
    if (req.user.role === UserRoles.TUTOR) {
      userId = req.user.id;
    }
    const { page, limit, skip } = paginationSortingHelper_default(req.query);
    const data = await bookingService.getAllBookings(
      page,
      limit,
      skip,
      userId
    );
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All bookings fetched successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var cancelBooking2 = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    if (!bookingId) throw new Error("Booking Id Required!");
    if (Array.isArray(bookingId)) throw new Error("Id Formant not valid");
    const data = await bookingService.cancelBooking(bookingId);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking cancelled successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var bookingController = {
  createBooking: createBooking2,
  getBookingsByUserId: getBookingsByUserId2,
  getAllBookings: getAllBookings2,
  getBookingDetails: getBookingDetails2,
  cancelBooking: cancelBooking2
};

// src/modules/booking/booking.router.ts
var router2 = express2.Router();
router2.post(
  "/",
  auth_default(UserRoles.STUDENT),
  bookingController.createBooking
);
router2.get(
  "/",
  auth_default(UserRoles.STUDENT, UserRoles.ADMIN, UserRoles.TUTOR),
  bookingController.getAllBookings
);
router2.patch(
  "/:bookingId/cancel",
  auth_default(UserRoles.STUDENT),
  bookingController.cancelBooking
);
router2.get(
  "/:bookingId",
  auth_default(UserRoles.STUDENT, UserRoles.TUTOR),
  bookingController.getBookingDetails
);
var booking_router_default = router2;

// src/modules/categories/categories.router.ts
import express3 from "express";

// src/modules/categories/categories.service.ts
var createCategory = async (payload) => {
  return await prisma.category.create({ data: payload });
};
var getAllCategories = async ({
  page = 1,
  limit = 10,
  skip = 0
} = {}) => {
  const [data, total] = await Promise.all([
    prisma.category.findMany({
      skip,
      take: limit,
      orderBy: { name: "asc" },
      include: { subjects: { orderBy: { name: "asc" } } }
    }),
    prisma.category.count()
  ]);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var categoryService = { createCategory, getAllCategories };

// src/modules/categories/categories.controller.ts
var createCategory2 = async (req, res, next) => {
  try {
    const data = await categoryService.createCategory(req.body);
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Category created successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var getAllCategories2 = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginationSortingHelper_default(req.query);
    const data = await categoryService.getAllCategories({
      page,
      limit,
      skip
    });
    console.log(data);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get all categories successfully",
      data: data.data,
      meta: data.meta
    });
  } catch (error) {
    next(error);
  }
};
var categoryController = { createCategory: createCategory2, getAllCategories: getAllCategories2 };

// src/modules/categories/categories.router.ts
var router3 = express3.Router();
router3.post("/", auth_default(UserRoles.ADMIN), categoryController.createCategory);
router3.get("/", categoryController.getAllCategories);
var categories_router_default = router3;

// src/modules/dashboard/dashboard.router.ts
import express4 from "express";

// src/modules/dashboard/dashboard.service.ts
var getAdminStats = async () => {
  const [
    totalUsers,
    activeUsers,
    bannedUsers,
    totalTutors,
    totalStudents,
    totalCategories,
    totalSubjects,
    totalBookings,
    totalReviews
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { status: "BAN" } }),
    prisma.user.count({ where: { role: "TUTOR" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.category.count(),
    prisma.subject.count(),
    prisma.booking.count(),
    prisma.review.count()
  ]);
  return {
    totalUsers,
    activeUsers,
    bannedUsers,
    totalTutors,
    totalStudents,
    totalCategories,
    totalSubjects,
    totalBookings,
    totalReviews
  };
};
var getTutorStats = async (tutorId) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { tutor_id: tutorId },
    select: { tutor_profile_id: true }
  });
  if (!tutorProfile) {
    return {
      bookings: { total: 0, byStatus: {} },
      totalEarnings: 0,
      reviews: { total: 0, avgRating: 0 }
    };
  }
  const tutorProfileId = tutorProfile.tutor_profile_id;
  const [bookings, bookingsByStatus, earnings, reviews, avgRating] = await Promise.all([
    prisma.booking.count({
      where: { tutor_profile_id: tutorProfileId }
    }),
    prisma.booking.groupBy({
      by: ["status"],
      where: { tutor_profile_id: tutorProfileId },
      _count: { status: true }
    }),
    prisma.booking.aggregate({
      where: {
        tutor_profile_id: tutorProfileId,
        status: BookingStatus.COMPLETED
      },
      _sum: { price: true }
    }),
    prisma.review.count({
      where: { tutor_profile_id: tutorProfileId }
    }),
    prisma.review.aggregate({
      where: { tutor_profile_id: tutorProfileId },
      _avg: { rating: true }
    })
  ]);
  return {
    bookings: {
      total: bookings,
      byStatus: bookingsByStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        },
        {}
      )
    },
    totalEarnings: earnings._sum.price || 0,
    reviews: {
      total: reviews,
      avgRating: avgRating._avg.rating || 0
    }
  };
};
var getStudentStats = async (studentId) => {
  const [totalBookings, bookingsByStatus, totalSpent, reviewsGiven] = await Promise.all([
    prisma.booking.count({
      where: { student_id: studentId }
    }),
    prisma.booking.groupBy({
      by: ["status"],
      where: { student_id: studentId },
      _count: { status: true }
    }),
    prisma.booking.aggregate({
      where: {
        student_id: studentId,
        status: {
          in: [BookingStatus.COMPLETED, BookingStatus.CONFIRMED]
        }
      },
      _sum: { price: true }
    }),
    prisma.review.count({
      where: { student_id: studentId }
    })
  ]);
  return {
    bookings: {
      total: totalBookings,
      byStatus: bookingsByStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count.status;
          return acc;
        },
        {}
      )
    },
    totalSpent: totalSpent._sum.price || 0,
    reviewsGiven
  };
};
var getLandingPageStats = async () => {
  const [totalTutors, totalStudents, totalSessionsCompleted, totalSubjects] = await Promise.all([
    prisma.user.count({ where: { role: "TUTOR", status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.booking.count({
      where: { status: BookingStatus.COMPLETED }
    }),
    prisma.subject.count()
  ]);
  return {
    totalTutors,
    totalStudents,
    totalSessionsCompleted,
    totalSubjects
  };
};
var dashboardService = {
  getAdminStats,
  getTutorStats,
  getStudentStats,
  getLandingPageStats
};

// src/modules/dashboard/dashboard.controller.ts
var getStats = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    let data;
    switch (role) {
      case UserRoles.ADMIN:
        data = await dashboardService.getAdminStats();
        break;
      case UserRoles.TUTOR:
        data = await dashboardService.getTutorStats(id);
        break;
      case UserRoles.STUDENT:
        data = await dashboardService.getStudentStats(id);
        break;
      default:
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Invalid role",
          data: null
        });
    }
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Dashboard statistics fetched successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var getLandingPageStats2 = async (req, res, next) => {
  try {
    const data = await dashboardService.getLandingPageStats();
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Landing page statistics fetched successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var dashboardController = {
  getStats,
  getLandingPageStats: getLandingPageStats2
};

// src/modules/dashboard/dashboard.router.ts
var router4 = express4.Router();
router4.get(
  "/stats",
  auth_default(UserRoles.ADMIN, UserRoles.TUTOR, UserRoles.STUDENT),
  dashboardController.getStats
);
router4.get("/landing-page-stats", dashboardController.getLandingPageStats);
var dashboard_router_default = router4;

// src/modules/review/review.router.ts
import express5 from "express";

// src/modules/review/review.service.ts
var createReview = async (payload) => {
  const reviewResult = await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { booking_id: payload.booking_id },
      data: { status: BookingStatus.COMPLETED }
    });
    return await tx.review.create({ data: payload });
  });
  const updateTutorProfile3 = await prisma.$transaction(async (tx) => {
    const avgRating = await tx.review.aggregate({
      where: { tutor_profile_id: payload.tutor_profile_id },
      _avg: { rating: true }
    });
    return await tx.tutorProfile.update({
      where: { tutor_profile_id: payload.tutor_profile_id },
      data: { avg_rating: avgRating._avg.rating || 0 }
    });
  });
  return {
    reviewResult,
    updateTutorProfile: updateTutorProfile3
  };
};
var getAllReviews = async () => {
  return await prisma.review.findMany();
};
var getReviewDetails = async (reviewId) => {
  return await prisma.review.findUniqueOrThrow({
    where: { review_id: reviewId }
  });
};
var reviewService = { createReview, getReviewDetails, getAllReviews };

// src/modules/review/review.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const body = { ...req.body, student_id: userId };
    const data = await reviewService.createReview(body);
    console.log("data review", data);
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Create Review Successfully",
      data
    });
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
};
var getAllReviews2 = async (req, res, next) => {
  try {
    const data = await reviewService.getAllReviews();
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get All Reviews Successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var getReviewsDetails = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    if (!reviewId) throw new Error("Review Id Required!");
    if (Array.isArray(reviewId)) throw new Error("Id Formant not valid");
    const data = await reviewService.getReviewDetails(reviewId);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get Reviews Details Successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var reviewController = {
  createReview: createReview2,
  getReviewsDetails,
  getAllReviews: getAllReviews2
};

// src/modules/review/review.router.ts
var router5 = express5.Router();
router5.post("/", auth_default(UserRoles.STUDENT), reviewController.createReview);
router5.get("/", auth_default(UserRoles.STUDENT), reviewController.getAllReviews);
router5.get(
  "/:reviewId",
  auth_default(UserRoles.STUDENT),
  reviewController.getReviewsDetails
);
var review_router_default = router5;

// src/modules/subjects/subjects.router.ts
import express6 from "express";

// src/modules/subjects/subjects.service.ts
var createSubject = async (payload) => {
  return await prisma.subject.create({ data: payload });
};
var getAllSubject = async () => {
  return await prisma.subject.findMany({ orderBy: { name: "asc" } });
};
var subjectsService = { createSubject, getAllSubject };

// src/modules/subjects/subjects.controller.ts
var createSubject2 = async (req, res, next) => {
  try {
    const data = await subjectsService.createSubject(req.body);
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Created subject successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var getAllSubject2 = async (req, res, next) => {
  try {
    const data = await subjectsService.getAllSubject();
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get all subjects successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var subjectsController = { createSubject: createSubject2, getAllSubject: getAllSubject2 };

// src/modules/subjects/subjects.router.ts
var router6 = express6.Router();
router6.post("/", subjectsController.createSubject);
router6.get("/", subjectsController.getAllSubject);
var subjects_router_default = router6;

// src/modules/tutorProfile/tutorProfile.router.ts
import express7 from "express";

// src/modules/user/user.service.ts
var getAllUsers = async ({
  search,
  status,
  role,
  page,
  limit,
  skip,
  sortOrder,
  sortBy,
  tutorProfiles,
  isFeatured,
  minRating,
  maxRating,
  minPrice,
  maxPrice,
  category
}) => {
  const andCondition = [];
  if (search) {
    andCondition.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        {
          tutorProfiles: {
            tutorSubjects: {
              some: {
                subject: {
                  name: {
                    contains: search,
                    mode: "insensitive"
                  }
                }
              }
            }
          }
        }
      ]
    });
  }
  if (tutorProfiles) {
    andCondition.push({
      tutorProfiles: { isNot: null }
    });
  }
  if (role) {
    andCondition.push({
      role
    });
  }
  if (status) {
    andCondition.push({
      status
    });
  }
  if (isFeatured === "true") {
    andCondition.push({
      tutorProfiles: {
        is_featured: Boolean(isFeatured)
      }
    });
  }
  if (minRating !== void 0) {
    andCondition.push({
      tutorProfiles: {
        avg_rating: {
          gte: minRating
        }
      }
    });
  }
  if (maxRating !== void 0) {
    andCondition.push({
      tutorProfiles: {
        avg_rating: {
          lte: maxRating
        }
      }
    });
  }
  if (minPrice !== void 0) {
    andCondition.push({
      tutorProfiles: {
        hourly_rate: {
          gte: minPrice
        }
      }
    });
  }
  if (maxPrice !== void 0) {
    andCondition.push({
      tutorProfiles: {
        hourly_rate: {
          lte: maxPrice
        }
      }
    });
  }
  if (category) {
    andCondition.push({
      tutorProfiles: {
        tutorSubjects: {
          some: {
            subject: {
              category: {
                name: {
                  contains: category,
                  mode: "insensitive"
                }
              }
            }
          }
        }
      }
    });
  }
  const whereClause = {
    AND: andCondition
  };
  const [result, total] = await Promise.all([
    prisma.user.findMany({
      take: limit,
      skip,
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        phone: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        tutorProfiles: {
          select: {
            tutor_profile_id: true,
            hourly_rate: true,
            year_of_experience: true,
            avg_rating: true,
            created_at: true,
            updated_at: true,
            is_featured: true,
            tutorSubjects: { include: { subject: true } },
            availabilities: true
          }
        }
      },
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.user.count({
      where: whereClause
    })
  ]);
  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getUserDetails = async (userId) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      tutorProfiles: {
        include: {
          availabilities: true,
          tutorSubjects: { include: { subject: true } },
          reviews: true,
          bookings: true
        }
      }
    }
  });
};
var getUserTutorDetails = async (userId) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id: userId, role: "TUTOR" },
    include: {
      tutorProfiles: {
        include: {
          tutorSubjects: { include: { subject: true } },
          availabilities: true,
          reviews: true,
          bookings: true
        }
      }
    }
  });
};
var banUser = async (userId) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { status: "BAN" }
  });
};
var unbanUser = async (userId) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { status: "ACTIVE" }
  });
};
var updateUserById = async (userId, payload) => {
  return await prisma.user.update({
    where: { id: userId },
    data: payload
  });
};
var userService = {
  getAllUsers,
  getUserDetails,
  banUser,
  unbanUser,
  updateUserById,
  getUserTutorDetails
};

// src/modules/tutorProfile/tutorProfile.service.ts
var createTutorProfile = async (payload, tutorId) => {
  return await prisma.tutorProfile.create({
    data: { ...payload, tutor_id: tutorId }
  });
};
var getAllTutors = async ({ search }) => {
  return await prisma.tutorProfile.findMany({
    include: { tutor: true, tutorSubjects: true }
  });
};
var getTutorDetails = async (tutor_id) => {
  return await prisma.tutorProfile.findUniqueOrThrow({
    where: { tutor_id },
    include: {
      tutor: true,
      reviews: true,
      tutorSubjects: true,
      availabilities: true
    }
  });
};
var updateTutorProfile = async (payload, tutorProfileId) => {
  return await prisma.tutorProfile.update({
    where: { tutor_profile_id: tutorProfileId },
    data: payload
  });
};
var tutorProfileService = {
  createTutorProfile,
  updateTutorProfile,
  getAllTutors,
  getTutorDetails
};

// src/modules/tutorProfile/tutorProfile.controller.ts
var createTutorProfile2 = async (req, res, next) => {
  try {
    const result = await tutorProfileService.createTutorProfile(
      req.body,
      req.user.id
    );
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Profile Created Successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllTutors2 = async (req, res, next) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const list = await tutorProfileService.getAllTutors({
      search: searchString
    });
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      data: list,
      message: "Fetch Successfully"
    });
  } catch (error) {
    next(error);
  }
};
var getTutorDetails2 = async (req, res, next) => {
  try {
    const { tutorId } = req.params;
    if (!tutorId) throw new Error("Tutor Id Required!");
    if (Array.isArray(tutorId)) throw new Error("Id Formant not valid");
    const data = await tutorProfileService.getTutorDetails(tutorId);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      data,
      message: "Tutor details fetched successfully"
    });
  } catch (error) {
    next(error);
  }
};
var getMyProfile = async (req, res, next) => {
  try {
    const data = await userService.getUserDetails(req.user.id);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      data,
      message: "My profile fetched successfully"
    });
  } catch (error) {
    next(error);
  }
};
var updateTutorProfile2 = async (req, res, next) => {
  try {
    const { tutorProfileId } = req.params;
    console.log("tutorProfileId", tutorProfileId);
    if (!tutorProfileId) throw new Error("Tutor Profile Id Required!");
    if (Array.isArray(tutorProfileId))
      throw new Error("Profile Id Formant not valid");
    console.log("req.body", req.body);
    const data = await tutorProfileService.updateTutorProfile(
      req.body,
      tutorProfileId
    );
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      data,
      message: "Tutor profile updated successfully"
    });
  } catch (error) {
    next(error);
  }
};
var tutorProfileController = {
  createTutorProfile: createTutorProfile2,
  updateTutorProfile: updateTutorProfile2,
  getAllTutors: getAllTutors2,
  getTutorDetails: getTutorDetails2,
  getMyProfile
};

// src/modules/tutorProfile/tutorProfile.router.ts
var router7 = express7.Router();
router7.post(
  "/profile",
  auth_default(UserRoles.TUTOR),
  tutorProfileController.createTutorProfile
);
router7.get(
  "/my-profile",
  auth_default(UserRoles.TUTOR),
  tutorProfileController.getMyProfile
);
router7.get("/", tutorProfileController.getAllTutors);
router7.get("/:tutorId", tutorProfileController.getTutorDetails);
router7.patch(
  "/profile/:tutorProfileId",
  auth_default(UserRoles.ADMIN, UserRoles.TUTOR),
  tutorProfileController.updateTutorProfile
);
router7.put(
  "/profile",
  auth_default(UserRoles.ADMIN, UserRoles.TUTOR),
  tutorProfileController.updateTutorProfile
);
var tutorProfile_router_default = router7;

// src/modules/tutorSubjects/tutorSubjects.router.ts
import express8 from "express";

// src/modules/tutorSubjects/tutorSubjects.service.ts
var createTutorSubjects = async (payload) => {
  console.log("createTutorSubjects", payload);
  return await prisma.tutorSubject.create({ data: payload });
};
var getTutorSubjects = async (tutorProfileId) => {
  return await prisma.tutorSubject.findMany({
    where: { tutor_profile_id: tutorProfileId },
    omit: { subject_id: true },
    include: { subject: true }
  });
};
var deleteTutorSubjectBySubjectId = async (tutorProfileId, subjectId) => {
  return await prisma.tutorSubject.delete({
    where: {
      tutor_profile_id_subject_id: {
        tutor_profile_id: tutorProfileId,
        subject_id: subjectId
      }
    }
  });
};
var tutorSubjectsService = {
  createTutorSubjects,
  getTutorSubjects,
  deleteTutorSubjectBySubjectId
};

// src/modules/tutorSubjects/tutorSubjects.controller.ts
var createTutorSubjects2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tutorProfile = await prisma.tutorProfile.findUniqueOrThrow({
      where: { tutor_id: userId },
      select: { tutor_profile_id: true }
    });
    const payload = {
      tutor_profile_id: tutorProfile.tutor_profile_id,
      subject_id: req.body.subject_id
    };
    const data = await tutorSubjectsService.createTutorSubjects(payload);
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Created tutor subjects successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var getTutorSubjects2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tutorProfile = await prisma.tutorProfile.findUniqueOrThrow({
      where: { tutor_id: userId },
      select: { tutor_profile_id: true }
    });
    const data = await tutorSubjectsService.getTutorSubjects(
      tutorProfile.tutor_profile_id
    );
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get tutor subjects successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var deleteTutorSubjectBySubjectId2 = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tutorProfile = await prisma.tutorProfile.findUniqueOrThrow({
      where: { tutor_id: userId },
      select: { tutor_profile_id: true }
    });
    const data = await tutorSubjectsService.deleteTutorSubjectBySubjectId(
      tutorProfile.tutor_profile_id,
      req.params.subjectId
    );
    if (!data) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Tutor subject not found"
      });
    }
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};
var tutorSubjectsController = {
  createTutorSubjects: createTutorSubjects2,
  getTutorSubjects: getTutorSubjects2,
  deleteTutorSubjectBySubjectId: deleteTutorSubjectBySubjectId2
};

// src/modules/tutorSubjects/tutorSubjects.router.ts
var router8 = express8.Router();
router8.post(
  "/",
  auth_default(UserRoles.TUTOR),
  tutorSubjectsController.createTutorSubjects
);
router8.get(
  "/",
  auth_default(UserRoles.TUTOR),
  tutorSubjectsController.getTutorSubjects
);
router8.delete(
  "/:subjectId",
  auth_default(UserRoles.TUTOR),
  tutorSubjectsController.deleteTutorSubjectBySubjectId
);
var tutorSubjects_router_default = router8;

// src/modules/user/user.router.ts
import express9 from "express";

// src/modules/user/user.controller.ts
var getAllUsers2 = async (req, res, next) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const status = req.query.status;
    const role = req.query.role;
    const tutorProfiles = req.query.tutorProfiles;
    const category = req.query.category;
    const isFeatured = req.query.isFeatured;
    const minRatingRaw = req.query.minRating;
    const maxRatingRaw = req.query.maxRating;
    const minPriceRaw = req.query.minPrice;
    const maxPriceRaw = req.query.maxPrice;
    const minRating = typeof minRatingRaw === "string" && !Number.isNaN(Number(minRatingRaw)) ? Number(minRatingRaw) : void 0;
    const maxRating = typeof maxRatingRaw === "string" && !Number.isNaN(Number(maxRatingRaw)) ? Number(maxRatingRaw) : void 0;
    const minPrice = typeof minPriceRaw === "string" && !Number.isNaN(Number(minPriceRaw)) ? Number(minPriceRaw) : void 0;
    const maxPrice = typeof maxPriceRaw === "string" && !Number.isNaN(Number(maxPriceRaw)) ? Number(maxPriceRaw) : void 0;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(req.query);
    const data = await userService.getAllUsers({
      search: searchString,
      status,
      role,
      page,
      limit,
      skip,
      sortOrder,
      sortBy,
      tutorProfiles,
      isFeatured,
      minRating,
      maxRating,
      minPrice,
      maxPrice,
      category
    });
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get all users successfully",
      data: data.data,
      meta: data.meta
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
var getUserDetails2 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "User ID is required"
      });
    }
    if (Array.isArray(userId)) throw new Error("Id Formant not valid");
    const data = await userService.getUserDetails(userId);
    console.log("data", data);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get user details successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var getUserTutorDetails2 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "User ID is required"
      });
    }
    if (Array.isArray(userId)) throw new Error("Id Formant not valid");
    console.log("userIdssss", userId);
    const data = await userService.getUserTutorDetails(userId);
    console.log("dataaaaa", data);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get user tutor details successfully",
      data
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};
var banUser2 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "User ID is required"
      });
    }
    if (Array.isArray(userId)) throw new Error("Id Formant not valid");
    const data = await userService.banUser(userId);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `User ${data.name} banned successfully`,
      data
    });
  } catch (error) {
    next(error);
  }
};
var unbanUser2 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "User ID is required"
      });
    }
    if (Array.isArray(userId)) throw new Error("Id Formant not valid");
    const data = await userService.unbanUser(userId);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `User ${data.name} unbanned successfully`,
      data
    });
  } catch (error) {
    next(error);
  }
};
var updateUserById2 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) throw new Error("User ID Required!");
    if (Array.isArray(userId)) throw new Error("Id Formant not valid");
    const data = await userService.updateUserById(userId, req.body);
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `User ${data.name} updated successfully`,
      data
    });
  } catch (error) {
    next(error);
  }
};
var userController = {
  getAllUsers: getAllUsers2,
  getUserDetails: getUserDetails2,
  getUserTutorDetails: getUserTutorDetails2,
  banUser: banUser2,
  unbanUser: unbanUser2,
  updateUserById: updateUserById2
};

// src/modules/user/user.router.ts
var router9 = express9.Router();
router9.get("/", userController.getAllUsers);
router9.get("/:userId", auth_default(UserRoles.ADMIN), userController.getUserDetails);
router9.get("/public/:userId", userController.getUserTutorDetails);
router9.patch("/:userId/ban", auth_default(UserRoles.ADMIN), userController.banUser);
router9.patch("/:userId/unban", auth_default(UserRoles.ADMIN), userController.unbanUser);
router9.patch(
  "/:userId",
  auth_default(UserRoles.ADMIN, UserRoles.TUTOR, UserRoles.STUDENT),
  userController.updateUserById
);
var user_router_default = router9;

// src/routes/v1.ts
var router10 = Router4();
router10.use("/users", user_router_default);
router10.use("/tutors", tutorProfile_router_default);
router10.use("/categories", categories_router_default);
router10.use("/subjects", subjects_router_default);
router10.use("/availabilities", availability_router_default);
router10.use("/tutor-subjects", tutorSubjects_router_default);
router10.use("/bookings", booking_router_default);
router10.use("/reviews", review_router_default);
router10.use("/dashboard", dashboard_router_default);
var v1_default = router10;

// src/app.ts
var app = express10();
app.use(
  cors({
    origin: env.corsOrigin || "http://localhost:3000",
    credentials: true
  })
);
app.use(express10.json());
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/v1", v1_default);
app.get("/", (_req, res) => {
  res.send("Welcome to the Skill Bridge App");
});
app.use(notFound_default);
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
var port = env.port;
app_default.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
