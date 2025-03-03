# Sentiment Analysis Web Application

This is a full-stack web application for sentiment analysis that allows users to analyze the emotional tone of text.

## Features

- User authentication (register/login)
- Text sentiment analysis (positive/negative/neutral)
- Responsive UI with Tailwind CSS
- GraphQL API for data operations
- JWT authentication

## Project Structure

```
sentiment-analysis-app/
├── src/
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── graphql/          # GraphQL operations and client setup
│   ├── mock-server/      # Mock server for development
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── README.md             # Project documentation
```

## Development Setup

This project uses a mock server for development purposes. In a production environment, you would replace this with a real backend server.

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Backend Implementation (Not Included in This Demo)

In a real-world scenario, you would implement a backend with:

### FastAPI Backend

```python
# Example FastAPI implementation (not included in this demo)
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import graphene
from graphene import ObjectType, String, Field, Float
from starlette.graphql import GraphQLApp
from transformers import pipeline
import jwt
from datetime import datetime, timedelta

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load sentiment analysis model
sentiment_analyzer = pipeline("sentiment-analysis")

# JWT settings
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# GraphQL types
class SentimentResult(ObjectType):
    sentiment = String()
    score = Float()
    text = String()

class SentimentMutation(ObjectType):
    analyze_sentiment = Field(SentimentResult, text=String(required=True))
    
    def resolve_analyze_sentiment(self, info, text):
        if len(text) > 500:
            raise Exception("Text must be 500 characters or less")
            
        result = sentiment_analyzer(text)[0]
        sentiment = "positive" if result["label"] == "POSITIVE" else "negative"
        score = result["score"]
        
        return SentimentResult(
            sentiment=sentiment,
            score=score,
            text=text
        )

class Query(ObjectType):
    hello = String()
    
    def resolve_hello(self, info):
        return "Hello, world!"

schema = graphene.Schema(query=Query, mutation=SentimentMutation)

app.add_route("/graphql", GraphQLApp(schema=schema))
```

### Docker Setup

```dockerfile
# Example Dockerfile for FastAPI backend (not included in this demo)
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the model
RUN python -c "from transformers import pipeline; pipeline('sentiment-analysis')"

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# Example Dockerfile for React frontend (not included in this demo)
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# Example docker-compose.yml (not included in this demo)
version: '3'

services:
  frontend:
    build:
      context: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_GRAPHQL_API_URL=http://localhost:8000/graphql

  backend:
    build:
      context: ./backend
    ports:
      - "8000:8000"
    volumes:
      - model-cache:/root/.cache
    environment:
      - SECRET_KEY=your-secret-key
      - ALGORITHM=HS256
      - ACCESS_TOKEN_EXPIRE_MINUTES=30

volumes:
  model-cache:
```

## License

MIT#   S e n t i m e n t - A n a l y s i s - F r o n t e d -  
 