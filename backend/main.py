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
    target_audience: Optional[str] = "Professionals"
    goal: str = "thought_leadership"
    max_words: int = 300
    include_hashtags: bool = True
    include_cta: bool = True
    model_provider: str = "gemini" # default
    model_name: Optional[str] = None
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    discovery_mode: bool = False
    tavily_key: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "TrendPost API is running"}

from agent_graph import agent_app

@app.post("/generate-draft")
async def generate_draft(request: PostRequest):
    print(f"DEBUG: Received request for topic: {request.topic}, url: {request.url}")
    # Initial state for the agent graph
    initial_state = {
        "topic": request.topic or "latest trends",
        "field": request.field,
        "url": request.url,
        "context": request.context or "",
        "key_points": request.key_points or "",
        "style": request.style or "Professional",
        "target_audience": request.target_audience or "General Professional Audience",
        "goal": request.goal,
        "max_words": request.max_words,
        "include_hashtags": request.include_hashtags,
        "include_cta": request.include_cta,
        "provider": request.model_provider,
        "model": request.model_name,
        "api_key": request.api_key,
        "base_url": request.base_url,
        "tavily_key": request.tavily_key,
        "discovery_mode": request.discovery_mode,
        "research": "",
        "citations": [],
        "initial_draft": "",
        "draft": "",
        "critique": "",
        "strategic_angle": "",
        "search_queries": [],
        "planner_notes": "",
        "iterations": 0,
        "max_iterations": 2, # Prevent excessive loops
        "status": "Starting agents...",
        "draft_history": []
    }
    
    try:
        # Run the agentic workflow
        final_state = agent_app.invoke(initial_state)
        
        return {
            "draft": final_state["draft"],
            "initial_draft": final_state.get("initial_draft", ""),
            "citations": final_state["citations"],
            "researched_info": final_state["research"],
            "agent_status": final_state["status"],
            "total_iterations": final_state.get("iterations", 0),
            "planner_notes": final_state.get("planner_notes", ""),
            "search_queries": final_state.get("search_queries", []),
            "strategic_angle": final_state.get("strategic_angle", ""),
            "critique": final_state.get("critique", ""),
            "draft_history": final_state.get("draft_history", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent workflow failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
