# AI Matching API Documentation

## Overview

AI Matching API provides intelligent job-candidate matching capabilities using OpenAI's GPT models. The API supports 8 languages and provides comprehensive matching analysis, recommendations, and statistics.

## Supported Languages

- **en** - English
- **pt** - Portuguese (Português)
- **fr** - French (Français)
- **uk** - Ukrainian (Українська)
- **ru** - Russian (Русский)
- **de** - German (Deutsch)
- **pl** - Polish (Polski)
- **cs** - Czech (Čeština)

## Base URL

```
/api/ai-matching
```

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer your-jwt-token
```

## Endpoints

### 1. Get Recommendations

Retrieve AI-generated job recommendations with filtering options.

**GET** `/recommendations`

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | No | Type of recommendation |
| `minMatchScore` | number | No | Minimum match score (0-100) |
| `candidateId` | UUID | No | Filter by candidate ID |
| `jobId` | UUID | No | Filter by job ID |
| `search` | string | No | Search term |
| `location` | string | No | Filter by location |
| `skills` | string[] | No | Filter by skills |
| `limit` | number | No | Number of results (default: 20) |
| `offset` | number | No | Pagination offset (default: 0) |
| `language` | string | No | Language code (default: 'en') |

#### Example Request

```bash
curl -X GET "/api/ai-matching/recommendations?candidateId=123&language=uk&minMatchScore=70" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Accept-Language: uk"
```

#### Example Response

```json
{
  "success": true,
  "message": "Рекомендації успішно отримано",
  "data": {
    "recommendations": [
      {
        "id": "rec-1",
        "type": "job_recommendation",
        "matchScore": 85,
        "matchScoreCategory": "good",
        "skillsMatch": {
          "matched": ["JavaScript", "React", "TypeScript"],
          "missing": ["Node.js"],
          "score": 80
        },
        "experienceMatch": {
          "required": "3-5 років",
          "candidate": "4 роки",
          "score": 90
        },
        "locationMatch": {
          "required": "Київ",
          "candidate": "Київ",
          "score": 100
        },
        "salaryMatch": {
          "required": { "min": 3000, "max": 5000 },
          "candidate": { "min": 3500, "max": 4500 },
          "score": 85
        },
        "aiReason": "Відмінний матч по навичках та досвіду. Локація ідеально підходить.",
        "aiMetadata": {
          "model": "talentflow-matching-v1",
          "confidence": 0.85,
          "processingTime": 245,
          "features": ["skills", "experience", "location", "salary"]
        },
        "isActive": true,
        "isViewed": false,
        "isContacted": false,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "stats": {
      "totalMatches": 150,
      "highQualityMatches": 45,
      "averageMatchScore": 78.5,
      "candidatesMatched": 25,
      "jobsMatched": 12,
      "lastUpdated": "2024-01-15T10:30:00Z",
      "aiAccuracy": 94.5,
      "processingTime": 245
    },
    "pagination": {
      "total": 1,
      "limit": 10,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

### 2. Generate Recommendations

Generate new AI recommendations for candidates or jobs.

**POST** `/generate`

#### Request Body

```json
{
  "type": "job_recommendation",
  "candidateId": "candidate-uuid",
  "jobId": "job-uuid",
  "limit": 10,
  "language": "en"
}
```

#### Example Request

```bash
curl -X POST "/api/ai-matching/generate" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -H "Accept-Language: de" \
  -d '{
    "jobId": "job-uuid-here",
    "language": "de",
    "limit": 15
  }'
```

#### Example Response

```json
{
  "success": true,
  "message": "Empfehlungen erfolgreich generiert",
  "data": [
    {
      "id": "rec-2",
      "type": "job_recommendation",
      "matchScore": 92,
      "matchScoreCategory": "excellent",
      "aiReason": "Hervorragende Übereinstimmung in Fähigkeiten und Erfahrung.",
      "aiMetadata": {
        "model": "talentflow-matching-v1",
        "confidence": 0.92,
        "processingTime": 198
      }
    }
  ]
}
```

### 3. Bulk Generate Recommendations

Generate recommendations for multiple candidates or jobs at once.

**POST** `/bulk-generate`

#### Request Body

```json
{
  "type": "job_recommendation",
  "candidateIds": ["candidate-1-uuid", "candidate-2-uuid"],
  "jobIds": ["job-1-uuid", "job-2-uuid"],
  "limit": 20,
  "language": "fr"
}
```

#### Example Request

```bash
curl -X POST "/api/ai-matching/bulk-generate" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -H "Accept-Language: fr" \
  -d '{
    "candidateIds": ["candidate-1-uuid", "candidate-2-uuid"],
    "language": "fr",
    "limit": 20
  }'
```

#### Example Response

```json
{
  "success": true,
  "message": "Recommandations générées avec succès",
  "data": {
    "totalGenerated": 25,
    "successful": 23,
    "failed": 2,
    "processingTime": 1200,
    "recommendations": []
  }
}
```

### 4. Update Recommendation

Update the status or feedback of a recommendation.

**PUT** `/recommendations/:id`

#### Request Body

```json
{
  "isViewed": true,
  "isContacted": false,
  "feedbackRating": 4,
  "feedbackComment": "Good recommendation, but missing some skills"
}
```

#### Example Request

```bash
curl -X PUT "/api/ai-matching/recommendations/rec-uuid-here" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -H "Accept-Language: pl" \
  -d '{
    "isViewed": true,
    "isContacted": false,
    "feedbackRating": 4,
    "feedbackComment": "Dobra rekomendacja, ale brakuje niektórych umiejętności"
  }'
```

#### Example Response

```json
{
  "success": true,
  "message": "Rekomendacja zaktualizowana pomyślnie",
  "data": {
    "id": "rec-uuid-here",
    "isViewed": true,
    "isContacted": false,
    "feedback": {
      "rating": 4,
      "comment": "Dobra rekomendacja, ale brakuje niektórych umiejętności",
      "createdAt": "2024-01-15T11:00:00Z"
    },
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

### 5. Get Recommendation by ID

Retrieve a specific recommendation by its ID.

**GET** `/recommendations/:id`

#### Example Request

```bash
curl -X GET "/api/ai-matching/recommendations/rec-uuid-here" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Accept-Language: cs"
```

#### Example Response

```json
{
  "success": true,
  "message": "Doporučení úspěšně načteno",
  "data": {
    "id": "rec-uuid-here",
    "type": "job_recommendation",
    "matchScore": 82,
    "matchScoreCategory": "good",
    "aiReason": "Výborná shoda v dovednostech a zkušenostech.",
    "aiMetadata": {
      "model": "talentflow-matching-v1",
      "confidence": 0.82,
      "processingTime": 289
    }
  }
}
```

### 6. Get Matching Statistics

Retrieve AI matching statistics and analytics.

**GET** `/stats`

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `period` | string | No | Time period for statistics |
| `language` | string | No | Language code |

#### Example Request

```bash
curl -X GET "/api/ai-matching/stats?period=last_30_days&language=pt" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Accept-Language: pt"
```

#### Example Response

```json
{
  "success": true,
  "message": "Estatísticas recuperadas com sucesso",
  "data": {
    "totalMatches": 150,
    "highQualityMatches": 45,
    "averageMatchScore": 78.5,
    "candidatesMatched": 25,
    "jobsMatched": 12,
    "lastUpdated": "2024-01-15T10:30:00Z",
    "aiAccuracy": 94.5,
    "processingTime": 245,
    "matchScoreDistribution": {
      "excellent": 15,
      "good": 30,
      "average": 45,
      "poor": 10
    },
    "topSkills": [
      { "skill": "JavaScript", "count": 45, "averageScore": 87 },
      { "skill": "React", "count": 38, "averageScore": 89 }
    ],
    "topLocations": [
      { "location": "São Paulo", "count": 156, "averageScore": 85 },
      { "location": "Rio de Janeiro", "count": 89, "averageScore": 82 }
    ]
  }
}
```

### 7. Cleanup Old Recommendations

Remove old and unused recommendations.

**DELETE** `/cleanup`

#### Example Request

```bash
curl -X DELETE "/api/ai-matching/cleanup" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Accept-Language: ru"
```

#### Example Response

```json
{
  "success": true,
  "message": "Старые рекомендации успешно удалены",
  "data": {
    "cleanedCount": 5
  }
}
```

### 8. Health Check

Check the health status of the AI Matching service.

**GET** `/health`

#### Example Request

```bash
curl -X GET "/api/ai-matching/health" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Accept-Language: en"
```

#### Example Response

```json
{
  "success": true,
  "message": "AI Matching service health check completed",
  "data": {
    "isHealthy": true,
    "services": {
      "database": true,
      "openai": true
    },
    "timestamp": "2024-01-15T11:00:00Z"
  }
}
```

### 9. AI Health Check

Check the health status of the AI service specifically.

**GET** `/ai-health`

#### Example Request

```bash
curl -X GET "/api/ai-matching/ai-health" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Accept-Language: uk"
```

#### Example Response

```json
{
  "success": true,
  "message": "Перевірка здоров'я AI сервісу завершена",
  "data": {
    "isHealthy": true,
    "model": "gpt-3.5-turbo",
    "openaiStatus": "connected"
  }
}
```

### 10. Get Supported Languages

Retrieve the list of supported languages.

**GET** `/languages`

#### Example Request

```bash
curl -X GET "/api/ai-matching/languages" \
  -H "Authorization: Bearer your-jwt-token"
```

#### Example Response

```json
{
  "success": true,
  "message": "Supported languages retrieved successfully",
  "data": {
    "languages": ["en", "pt", "fr", "uk", "ru", "de", "pl", "cs"]
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **404** - Not Found
- **500** - Internal Server Error
- **503** - Service Unavailable

## Language Support

The API automatically detects the language from the `Accept-Language` header or the `language` parameter. All responses, including error messages, are returned in the requested language.

### Language Detection Priority

1. `language` parameter in request body/query
2. `Accept-Language` header
3. Default to English (`en`)

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Free tier**: 100 requests per hour
- **Premium tier**: 1000 requests per hour
- **Enterprise tier**: 10000 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Examples

See `/src/examples/aiMatchingExamples.ts` for comprehensive examples in all supported languages.

## Environment Variables

Required environment variables:

```bash
OPENAI_API_KEY=your-openai-api-key
AI_DEFAULT_MODEL_GPT=gpt-3.5-turbo
```

## Support

For technical support or questions about the AI Matching API, please contact the development team or create an issue in the project repository.


