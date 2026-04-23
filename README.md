# HNG Stage 2 - Advanced Name Classification API

A REST API that accepts a name, enriches it with data from three external APIs, stores it in MongoDB, and exposes endpoints to query and manage profile data with advanced filtering, sorting, pagination, and natural language search.

## Live URL
https://intelligence-query-engine-production-d738.up.railway.app


## GitHub Repo
https://github.com/ayanfe-arch/hng-stage2

## Tech Stack
- Node.js / Express
- MongoDB / Mongoose
- Axios
- UUID v7

## Endpoints

### Create Profile
POST /api/profiles
Body: { "name": "ella" }

### Get All Profiles
GET /api/profiles
Filters: gender, age_group, country_id, min_age, max_age, min_gender_probability, min_country_probability
Sorting: sort_by (age, created_at, gender_probability), order (asc, desc)
Pagination: page, limit

### Get Single Profile
GET /api/profiles/:id

### Delete Profile
DELETE /api/profiles/:id

### Natural Language Search
GET /api/profiles/search?q=young males from nigeria

## Natural Language Search Parsing
The search endpoint parses plain English queries into database filters:
- Gender: "male", "female"
- Age group: "child", "teenager", "adult", "senior"
- Age range: "young" (16-24), "above X", "below X"
- Country: "nigeria", "ghana", "kenya" etc.

## Seed Data
2026 profiles pre-loaded from seed file covering diverse names, genders, ages and nationalities across Africa and beyond.

## External APIs Used
- Genderize.io - gender prediction
- Agify.io - age prediction
- Nationalize.io - nationality prediction

## Error Handling
- 400: Missing or empty name
- 404: Profile not found
- 422: Invalid name type
- 500: Server error
- 502: External API returned invalid response