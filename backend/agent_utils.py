import trafilatura
from tavily import TavilyClient
import os
from typing import List, Dict

def scrape_url(url: str) -> str:
    """Extracts text content from a given URL."""
    downloaded = trafilatura.fetch_url(url)
    if downloaded:
        return trafilatura.extract(downloaded) or ""
    return ""

def search_trends(query: str) -> List[Dict]:
    """Searches for trending topics using Tavily."""
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        return []
    
    tavily = TavilyClient(api_key=api_key)
    # Search for latest news/trends
    results = tavily.search(query=query, search_depth="advanced", max_results=5)
    return results.get("results", [])

def gather_context(topic: str = None, url: str = None, tavily_api_key: str = None) -> tuple[str, List[str]]:
    """Gathers context from either a URL or a search query and returns (context, citations)."""
    context_chunks = []
    citations = []
    
    if url:
        urls = [u.strip() for u in url.split(",") if u.strip()]
        for u in urls:
            scraped_text = scrape_url(u)
            if scraped_text:
                context_chunks.append(f"Content from {u}:\n{scraped_text[:2000]}") # Limit text
                citations.append(u)
            
    if topic:
        api_key = tavily_api_key or os.getenv("TAVILY_API_KEY")
        if api_key:
            tavily = TavilyClient(api_key=api_key)
            try:
                results = tavily.search(query=topic, search_depth="advanced", max_results=5)
                search_results = results.get("results", [])
                for res in search_results:
                    context_chunks.append(f"Title: {res['title']}\nSource: {res['url']}\nSnippet: {res['content']}")
                    citations.append(res['url'])
            except Exception as e:
                print(f"Search error: {e}")
            
    return "\n\n---\n\n".join(context_chunks), list(set(citations))
