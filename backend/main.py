from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TrendPost API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PostRequest(BaseModel):
    topic: Optional[str] = None
    field: str = "Technology"
    url: Optional[str] = None
    context: Optional[str] = None
    key_points: Optional[str] = None
    style: Optional[str] = "Professional"
    model_provider: str = "gemini" # default
    model_name: Optional[str] = None
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    discovery_mode: bool = False
    tavily_key: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "TrendPost API is running"}

from agent_utils import gather_context
from llm_utils import get_llm_response

@app.post("/generate-draft")
async def generate_draft(request: PostRequest):
    # 1. Discovery Mode Logic vs Standard
    search_topic = None
    if request.discovery_mode and request.topic:
        # Use field for better search targeting
        search_topic = f"latest breaking news, trends and debates in {request.field}: {request.topic} within last 7 days"
    
    # 2. Gather context and citations
    gathered_info, citations = gather_context(
        topic=search_topic, 
        url=request.url,
        tavily_api_key=request.tavily_key
    )
    
    # 3. Discovery Refinement
    discovery_prompt = ""
    if request.discovery_mode and not request.url:
        discovery_prompt = f"From the researched information, pick the single MOST INTERESTING or RECENT specific story/news item about {request.topic} in the field of {request.field} and focus the post on it."

    # 4. Construct the main prompt
    prompt = f"""
    You are an expert LinkedIn content creator specializing in {request.field}.
    
    {discovery_prompt}
    
    USER CONTEXT/VOICE:
    {request.context or "No specific context provided. Focus on a clear, authoritative expert voice in " + request.field}
    
    KEY POINTS TO HIGHLIGHT:
    {request.key_points or "None provided"}
    
    RESEARCHED TRENDS & DATA:
    {gathered_info or "No research found. Use general knowledge about " + (request.topic or request.field)}
    
    STYLE PREFERENCE:
    {request.style}
    
    FIELD CONTEXT: {request.field}
    
    STRUCTURE:
    1. A 'Scroll-Stopping' Hook related to the recent news/trend.
    2. The 'Meat': Why this matters for the industry.
    3. The 'Insight': A unique perspective or tip.
    4. Engagement: A question or call to action.
    
    Style: {request.style}
    
    Draft the post now:
    """
    
    # 4. Call LLM
    draft = get_llm_response(
        prompt, 
        provider=request.model_provider, 
        model=request.model_name,
        api_key=request.api_key,
        base_url=request.base_url
    )
    
    return {
        "draft": draft,
        "citations": citations,
        "researched_info": gathered_info[:500] + "..." if len(gathered_info) > 500 else gathered_info
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
