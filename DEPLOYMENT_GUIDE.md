# GrindGauge Deployment Guide

Complete guide to deploy your coding prep platform to GCP and GitHub Pages.

---

## **Prerequisites**

1. **Google Cloud Account** with $300 free credits
2. **GitHub Account**
3. **Git installed** on your machine
4. **gcloud CLI** installed: https://cloud.google.com/sdk/docs/install

---

## **Part 1: Set Up GCP**

### **1.1 Install and Configure gcloud CLI**

```bash
# Install gcloud (if not already installed)
# Visit: https://cloud.google.com/sdk/docs/install

# Login to your Google account
gcloud auth login

# Create a new GCP project
gcloud projects create grindgauge-project --name="GrindGauge"

# Set as active project
gcloud config set project grindgauge-project

# Enable billing (required even for free tier)
# Go to: https://console.cloud.google.com/billing
# Link your project to billing account with free credits
```

### **1.2 Enable Required APIs**

```bash
# Enable App Engine API
gcloud services enable appengine.googleapis.com

# Enable Cloud SQL Admin API
gcloud services enable sqladmin.googleapis.com

# Enable Cloud Build API (for deployments)
gcloud services enable cloudbuild.googleapis.com
```

---

## **Part 2: Create PostgreSQL Database on Cloud SQL**

### **2.1 Create Cloud SQL Instance**

```bash
# Create PostgreSQL instance (this takes 5-10 minutes)
gcloud sql instances create grindgauge-db \
    --database-version=POSTGRES_16 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=YOUR_SECURE_PASSWORD_HERE \
    --storage-type=HDD \
    --storage-size=10GB

# Wait for it to finish...
```

### **2.2 Create the Database**

```bash
# Create the grindgauge database
gcloud sql databases create grindgauge --instance=grindgauge-db
```

### **2.3 Get Connection Information**

```bash
# Get the instance connection name
gcloud sql instances describe grindgauge-db --format="value(connectionName)"

# Save this! It looks like: grindgauge-project:us-central1:grindgauge-db
```

---

## **Part 3: Configure Backend for GCP**

### **3.1 Update application-production.properties**

Edit `server/src/main/resources/application-production.properties`:

```properties
spring.application.name=grindgauge

# Cloud SQL Configuration
spring.datasource.url=jdbc:postgresql:///${CLOUD_SQL_DATABASE_NAME:grindgauge}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD}

# Cloud SQL instance connection
spring.cloud.gcp.sql.instance-connection-name=${CLOUD_SQL_INSTANCE_CONNECTION_NAME}
spring.cloud.gcp.sql.database-name=${CLOUD_SQL_DATABASE_NAME:grindgauge}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

### **3.2 Set Environment Variables in app.yaml**

Edit `server/src/main/appengine/app.yaml` and add:

```yaml
runtime: java17
instance_class: F1

env_variables:
  SPRING_PROFILES_ACTIVE: "production"
  CLOUD_SQL_INSTANCE_CONNECTION_NAME: "grindgauge-project:us-central1:grindgauge-db"
  CLOUD_SQL_DATABASE_NAME: "grindgauge"
  DB_USERNAME: "postgres"
  DB_PASSWORD: "YOUR_SECURE_PASSWORD_HERE"  # Replace with your password

automatic_scaling:
  min_instances: 0
  max_instances: 1
```

---

## **Part 4: Deploy Backend to App Engine**

### **4.1 Initialize App Engine**

```bash
# Initialize App Engine (only needed once)
gcloud app create --region=us-central1
```

### **4.2 Build the Application**

```bash
cd server

# Build the JAR file
./gradlew build -x test

# Verify the JAR exists
ls build/libs/
```

### **4.3 Deploy to App Engine**

```bash
# Deploy (from server directory)
gcloud app deploy src/main/appengine/app.yaml

# This will:
# 1. Upload your code
# 2. Build the application
# 3. Deploy to App Engine
# Takes 5-10 minutes

# When prompted, type 'y' to continue
```

### **4.4 Get Your Backend URL**

```bash
# Get the deployed URL
gcloud app browse

# Your backend will be at:
# https://grindgauge-project.uc.r.appspot.com
```

### **4.5 Test the Backend**

```bash
# Test the backend is working
curl https://grindgauge-project.uc.r.appspot.com/tasks

# Should return: []
```

---

## **Part 5: Deploy Frontend to GitHub Pages**

### **5.1 Update Frontend API URL**

Edit `client/.env.production`:

```
REACT_APP_API_URL=https://grindgauge-project.uc.r.appspot.com
```

Replace with your actual App Engine URL.

### **5.2 Create GitHub Repository**

```bash
# From the grindgauge directory
cd ..

# Initialize git if not already done
git init

# Add all files
git add .
git commit -m "Initial commit"

# Create repo on GitHub (go to github.com and create 'grindgauge' repo)

# Add remote and push
git remote add origin https://github.com/ryjtoh/grindgauge.git
git branch -M main
git push -u origin main
```

### **5.3 Deploy to GitHub Pages**

```bash
cd client

# Deploy to GitHub Pages
npm run deploy

# This will:
# 1. Build the production version
# 2. Deploy to gh-pages branch
# 3. Take about 1-2 minutes
```

### **5.4 Enable GitHub Pages**

1. Go to your repo: `https://github.com/ryjtoh/grindgauge`
2. Click **Settings** → **Pages**
3. Under "Branch", select `gh-pages` and `/root`
4. Click **Save**
5. Wait 2-3 minutes

Your site will be live at: `https://ryjtoh.github.io/grindgauge`

---

## **Part 6: Configure CORS (Important!)**

Your backend needs to allow requests from GitHub Pages.

### **6.1 Update CORS Configuration**

Edit `server/src/main/java/com/grindgauge/server/controller/TaskController.java`:

Change:
```java
@CrossOrigin(origins = "http://localhost:3000")
```

To:
```java
@CrossOrigin(origins = {"http://localhost:3000", "https://ryjtoh.github.io"})
```

Do the same for `ProgressController.java`.

### **6.2 Redeploy Backend**

```bash
cd server
./gradlew build -x test
gcloud app deploy src/main/appengine/app.yaml
```

---

## **Part 7: Test Everything**

1. **Visit your site**: `https://ryjtoh.github.io/grindgauge`
2. **Add a task** - should save to GCP database
3. **Refresh page** - tasks should persist
4. **Check Progress Dashboard** - should show stats

---

## **Part 8: Monitoring & Costs**

### **8.1 Monitor Your Spending**

```bash
# Check current spending
gcloud billing accounts list
gcloud billing projects describe grindgauge-project
```

Or visit: https://console.cloud.google.com/billing

### **8.2 View App Logs**

```bash
# View application logs
gcloud app logs tail -s default

# View Cloud SQL logs
gcloud sql operations list --instance=grindgauge-db
```

### **8.3 Shut Down When Done**

**To completely stop charges:**

```bash
# Stop App Engine (CAUTION: This deletes everything)
gcloud app services delete default

# Delete Cloud SQL instance
gcloud sql instances delete grindgauge-db

# Or just disable App Engine
gcloud app versions stop --service=default --version=VERSION_ID
```

**To just pause:**
- App Engine: Set `max_instances: 0` in app.yaml
- Cloud SQL: Stop the instance in console

---

## **Troubleshooting**

### **Backend won't start**
```bash
# Check logs
gcloud app logs tail -s default

# Common issues:
# - Database connection failed: Check CLOUD_SQL_INSTANCE_CONNECTION_NAME
# - Missing environment variables: Check app.yaml
```

### **Frontend can't connect to backend**
- Check CORS settings in controllers
- Verify `.env.production` has correct URL
- Check browser console for errors

### **Database connection errors**
```bash
# Test database connection
gcloud sql connect grindgauge-db --user=postgres

# If fails, check:
# - Instance is running
# - Password is correct
# - Connection name matches
```

---

## **Updating Your Deployed App**

### **Update Backend:**
```bash
cd server
./gradlew build -x test
gcloud app deploy src/main/appengine/app.yaml
```

### **Update Frontend:**
```bash
cd client
npm run deploy
```

---

## **Cost Estimates (After Free Credits)**

- **App Engine F1**: ~$25-30/month (always on)
- **Cloud SQL db-f1-micro**: ~$10-15/month
- **Total**: ~$35-45/month

**With Free Credits**: $0 for 90 days or until credits run out

---

## **Summary of URLs**

- **Frontend**: https://ryjtoh.github.io/grindgauge
- **Backend**: https://grindgauge-project.uc.r.appspot.com
- **Database**: Cloud SQL (internal only)

---

## **For Your Resume**

You can now say:
✅ "Built a coding prep platform using React, Spring Boot, and PostgreSQL supporting 3 interview focus areas"
✅ "Deployed a GCP database layer paired with PostgreSQL to support scalable user data and progress tracking"
✅ "Designed responsive React frontend with real-time task updates, progress tracking, and mobile compatibility"

Keep the GitHub repo public to show employers!
