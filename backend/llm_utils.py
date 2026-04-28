import os
from litellm import completion
from typing import Optional

def get_llm_response(prompt: str, provider: str = "gemini", model: Optional[str] = None, api_key: Optional[str] = None, base_url: Optional[str] = None):
    """
    Unified interface for different LLM providers using LiteLLM.
    """
    if api_key:
        # LiteLLM uses standard environment variables...
        if provider == "gemini":
            os.environ["GEMINI_API_KEY"] = api_key
            os.environ["GOOGLE_API_KEY"] = api_key
        elif provider == "openai":
            os.environ["OPENAI_API_KEY"] = api_key
        elif provider == "anthropic":
            os.environ["ANTHROPIC_API_KEY"] = api_key
        elif provider == "vllm":
             os.environ["OPENAI_API_KEY"] = api_key # vLLM often uses OpenAI style keys
        elif provider == "huggingface":
             os.environ["HUGGINGFACE_API_KEY"] = api_key
             
    if provider == "gemini":
        # CRITICAL: LiteLLM needs the 'gemini/' prefix to use AI Studio API keys.
        # Without it, it tries to use Vertex AI which requires Google Cloud ADC.
        if model and not model.startswith("gemini/"):
            model = f"gemini/{model}"
        model = model or "gemini/gemini-3-flash-preview"
    elif provider == "openai":
        model = model or "gpt-4o-mini"
    elif provider == "anthropic":
        model = model or "claude-3-5-sonnet-20240620"
    elif provider == "vllm":
        # Override Base URL if provided via UI, else use env
        url = base_url or os.getenv("VLLM_BASE_URL", "http://localhost:8000/v1")
        os.environ["OPENAI_API_BASE"] = url
        model = model or "openai/custom-model"
    elif provider == "huggingface":
        if model:
            model = model.strip()
            if not model.startswith("huggingface/"):
                model = f"huggingface/{model}"
        model = model or "huggingface/meta-llama/Meta-Llama-3.1-8B-Instruct"
    
    print(f"DEBUG: Calling LiteLLM with provider={provider}, model={model}")
    try:
        response = completion(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            api_key=api_key
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error calling {provider}: {str(e)}"
