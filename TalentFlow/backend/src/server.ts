import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import passport from "passport";
import session from "express-session";

import routes from "./routes";
import { logRequest, errorHandler } from "./middleware/auth";
import {
  initializeDatabase,
  closeDatabase,
  checkDatabaseHealth,
} from "./config/database";
import { initializeDatabaseData } from "./database/init";

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// Swagger конфігурація
import swaggerJSDoc from "swagger-jsdoc";
import YAML from "yamljs";
import path from "path";

const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));

// Оновлюємо URL сервера динамічно
swaggerDocument.servers[0].url = `http://localhost:${PORT}`;

const options = {
  swaggerDefinition: swaggerDocument,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

// Спрощена CORS конфігурація
const corsOptions = {
  origin: true, // Дозволяємо всі origin тимчасово для діагностики
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "x-requested-with",
  ],
  exposedHeaders: ["Content-Length", "X-Requested-With"],
  maxAge: 86400,
};

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

// Compression middleware - стискає всі відповіді > 1KB
app.use(
  compression({
    level: 6, // Balance between speed and compression ratio
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// Rate limiting для захисту від DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === "/health" || req.path === "/api/health";
  },
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: {
    success: false,
    error: "Too many authentication attempts, please try again later",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
  skipSuccessfulRequests: true, // Don't count successful logins
});
// CORS middleware
app.use(cors(corsOptions));

// ✅ дозволити preflight для всіх запитів
app.options("*", cors(corsOptions));
// Apply rate limiters
app.use("/api/", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Додаткове логування для CORS
app.use((req, res, next) => {
  console.log("🌐 Request:", req.method, req.path);
  console.log("🌐 Origin:", req.headers.origin);
  console.log("🌐 User-Agent:", req.headers["user-agent"]);

  // Додаємо CORS заголовки для всіх запитів
  if (req.headers.origin) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-requested-with"
  );

  next();
});

// Preflight middleware для OPTIONS запитів
app.options("*", cors(corsOptions));

// Додатковий preflight middleware для всіх запитів
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log("🔄 Preflight request detected");
    console.log("🔄 Request headers:", req.headers);

    // Встановлюємо всі необхідні CORS заголовки для preflight
    if (req.headers.origin) {
      res.header("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-requested-with"
    );
    res.header("Access-Control-Max-Age", "86400");

    res.status(200).end();
    return;
  }
  next();
});

app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Custom middleware
app.use(logRequest);

// Swagger документація
app.get("/api-docs/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic routes
app.get("/", (req, res) => {
  res.json({
    message: "🎯 TalentFlow API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
    documentation: `/api-docs`,
  });
});

// CORS test endpoint
app.get("/cors-test", (req, res) => {
  res.json({
    message: "CORS test successful",
    origin: req.headers.origin,
    method: req.method,
    timestamp: new Date().toISOString(),
    cors: "enabled",
    headers: req.headers,
  });
});

// Додатковий CORS test endpoint
app.post("/cors-test", (req, res) => {
  res.json({
    message: "CORS POST test successful",
    origin: req.headers.origin,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealth ? "connected" : "disconnected",
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "error",
      error: error.message,
    });
  }
});

// OAuth configuration
import { configureLinkedInStrategy } from "./config/linkedinStrategy";
import { configureGoogleStrategy } from "./config/googleStrategy";
import linkedinAuthRoutes from "./routes/linkedinAuth";
import googleAuthRoutes from "./routes/googleAuth";

// Initialize passport (без сесій)
app.use(passport.initialize());

// Configure LinkedIn strategy
try {
  console.log("🔑 Configuring LinkedIn OAuth...");
  configureLinkedInStrategy();
  console.log("✅ LinkedIn OAuth configured successfully");
} catch (error) {
  console.error("❌ Failed to configure LinkedIn OAuth:", error);
}

// Configure Google strategy
try {
  console.log("🔑 Configuring Google OAuth...");
  configureGoogleStrategy();
  console.log("✅ Google OAuth configured successfully");
} catch (error) {
  console.error("❌ Failed to configure Google OAuth:", error);
}

// OAuth auth routes
app.use("/api", linkedinAuthRoutes);
app.use("/api", googleAuthRoutes);

// Admin routes (захищені)
import adminRoutes from "./routes/adminRoutes";
app.use("/api/admin", adminRoutes);

// API routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handlers для unhandled promises та exceptions
process.on("unhandledRejection", (reason: Error, promise: Promise<any>) => {
  console.error("❌ Unhandled Promise Rejection at:", promise);
  console.error("❌ Reason:", reason);
  console.error("❌ Stack:", reason.stack);
  // Don't crash in production, log and continue
  if (process.env.NODE_ENV !== "production") {
    // In development, we might want to crash to catch bugs
    process.exit(1);
  }
});

process.on("uncaughtException", (error: Error) => {
  console.error("❌ Uncaught Exception:", error);
  console.error("❌ Stack:", error.stack);
  // Uncaught exceptions are serious, always exit
  closeDatabase().finally(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await closeDatabase();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  await closeDatabase();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Ініціалізуємо базу даних
    await initializeDatabase();

    // Ініціалізуємо базові дані
    await initializeDatabaseData();

    app.listen(PORT, () => {
      console.log(`🚀 TalentMatch Pro Backend запущено на порту ${PORT}`);
      console.log(`📍 API доступне за адресою: http://localhost:${PORT}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/api-docs`);
      console.log(
        `💾 База даних: PostgreSQL (${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "5432"})`
      );
      console.log(`🔑 Тестові облікові записи:`);
      console.log(`   👨‍💼 Адмін: admin@talentmatch.pro / admin123`);
      console.log(`   🏢 Роботодавець: employer@techcorp.ua / employer123`);
      console.log(`   👩‍💻 Кандидат: candidate@example.com / candidate123`);
    });
  } catch (error) {
    console.error("❌ Помилка запуску сервера:", error);
    process.exit(1);
  }
};

startServer();

export default app;
