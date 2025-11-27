# =====================================================
# TEAM WORKFLOW RULES (READ THIS)
# =====================================================

# 0. START DOCKER FIRST (VERY IMPORTANT)
# -------------------------------------
# Open Docker Desktop / Docker GUI
# Make sure Docker Engine is RUNNING before any command.

# You can verify Docker is running:
docker info


# 1. START ONLY YOUR OWN DATABASE (RECOMMENDED)
# --------------------------------------------

# Auth Service:
docker compose up -d auth-db
npm run dev:auth

# Job Service:
docker compose up -d jobcompany-db
npm run dev:job

# Application Service:
docker compose up -d application-db
npm run dev:app


# 2. START ALL DATABASES (ONLY FOR FULL TESTING / DEMO)
# ----------------------------------------------------
npm run dbs
npm run dev


# 3. ALWAYS PULL BEFORE PUSHING
# -----------------------------
git pull origin master

# THEN PUSH:
git add .
git commit -m "describe your change"
git push


# 4. DATABASE CHANGES (PRISMA) — ONLY IN YOUR SERVICE
# --------------------------------------------------
cd services/<your-service>
npx prisma generate
npx prisma migrate dev --name <change-name>
cd ../..


# 5. IF SOMEONE ELSE CHANGED THEIR DATABASE
# -----------------------------------------
git pull

# Only if you plan to run THEIR service locally:
cd services/<their-service>
npx prisma migrate dev
cd ../..


# 6. FULL SYSTEM IN DOCKER (OPTIONAL)
# ----------------------------------
npm run docker:all
npm run docker:down


# 7. STRICT RULES
# ---------------
# DO NOT TOUCH:
# - docker-compose.yml
# - proto/*
# - root package.json
# - other services
#
# gRPC only via proto + grpc folder
# NEVER access another service DB directly
