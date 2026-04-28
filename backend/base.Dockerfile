# Reusable AI Base Image
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install AI libraries (PyTorch, HuggingFace, NLP)
RUN pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir \
    transformers diffusers accelerate safetensors \
    sentence-transformers \
    nltk spacy scikit-learn pandas numpy \
    openai anthropic google-generativeai litellm \
    trafilatura beautifulsoup4 lxml tqdm

# Download common NLP models
RUN python -m spacy download en_core_web_sm
RUN python -m nltk.downloader punkt stopwords averaged_perceptron_tagger

# Set workspace
WORKDIR /app
