# API Design

## Endpoint
`POST /attendance`

## Request Body
```json
{
  "source": "FaceCap",
  "records": [
    {
      "id": "att_...",
      "userId": "user_...",
      "timestamp": "2026-06-05T14:00:00.000Z",
      "confidence": 93.2,
      "syncedToAWS": false
    }
  ]
}
```

## Headers
- `content-type: application/json`
- `x-api-key: <optional>`

## Response
- `200/201`: accepted and processed
- `4xx/5xx`: queued for retry with exponential backoff
