import os
from typing import TypedDict, List, Optional, Literal
from langgraph.graph import StateGraph, END, START
from llm_utils import get_llm_response
from agent_utils import gather_context

class AgentState(TypedDict):
    topic: str
    field: str
    url: Optional[str]
    context: str
    key_points: str
    style: str
    provider: str
    model: Optional[str]
    api_key: str
    base_url: Optional[str]
    tavily_key: Optional[str]
    discovery_mode: bool
    research: str
    citations: List[str]
    initial_draft: str
    draft: str
    critique: str
    iterations: int
    max_iterations: int
    status: str
    target_audience: str
    goal: Literal[
        "thought_leadership",
        "engagement",
        "authority_building",
        "lead_generation",
        "education",
        "brand_awareness"
    ]
    max_words: int
    include_hashtags: bool
    include_cta: bool
    strategic_angle: str
    search_queries: List[str]
    planner_notes: str
    draft_history: List[str]

def planner_node(state: AgentState):
    print("--- PLANNING STRATEGY & SEARCH ---")
    prompt = f"""
You are a high-level content strategist. The user has provided a topic: "{state['topic']}" in the field of "{state['field']}".
Your goal is to "{state['goal']}".

If the topic is generic, find a "hooky" or "niche" angle. 
Generate 3 specific search queries (max 150 chars each) for Tavily that will uncover:
- Recent technical shifts or news.
- Contrarian takes or industry friction.
- Real-world results or implementation challenges.

Format:
PLAN: <your one-sentence strategic direction>
QUERIES:
1. <query 1>
2. <query 2>
3. <query 3>
"""
    response = get_llm_response(
        prompt, 
        provider=state['provider'], 
        model=state['model'],
        api_key=state['api_key'],
        base_url=state['base_url']
    )
    
    plan = "Researching topic."
    queries = [f"latest trends in {state['topic']}"]
    try:
        if "PLAN:" in response and "QUERIES:" in response:
            parts = response.split("QUERIES:")
            plan = parts[0].replace("PLAN:", "").strip()
            queries = [q.strip().lstrip("123. - ") for q in parts[1].strip().split("\n") if q.strip()][:3]
    except:
        pass

    return {
        "planner_notes": plan,
        "search_queries": queries,
        "status": f"Strategic angle: {plan[:50]}..."
    }

def search_node(state: AgentState):
    print("--- RESEARCHING ---")
    all_research = []
    all_citations = []
    
    # 1. Handle explicit URL if provided
    if state.get('url'):
        res, cit = gather_context(url=state['url'])
        if res:
            all_research.append(res)
            all_citations.extend(cit)
            
    # 2. Handle targeted search queries from Planner
    if state['discovery_mode'] and state.get('search_queries'):
        for query in state['search_queries']:
            print(f"DEBUG: Searching for: {query}")
            res, cit = gather_context(topic=query, tavily_api_key=state['tavily_key'])
            if res:
                all_research.append(res)
                all_citations.extend(cit)
    elif state['discovery_mode']:
        # Fallback if no queries generated
        res, cit = gather_context(topic=state['topic'], tavily_api_key=state['tavily_key'])
        if res:
            all_research.append(res)
            all_citations.extend(cit)

    return {
        "research": "\n\n---\n\n".join(all_research), 
        "citations": list(set(all_citations)),
        "status": "Targeted research gathered."
    }

def strategist_node(state: AgentState):
    print("--- STRATEGIZING ANGLE ---")
    prompt = f"""
You are a world-class viral content strategist. Your goal is to define the "Strategic Angle" for a LinkedIn post that will make it stand out.

TOPIC: {state['topic']}
FIELD: {state['field']}
RESEARCH: {state['research']}
GOAL: {state['goal']}
TARGET AUDIENCE: {state['target_audience']}

Pick ONE of these patterns or create a high-impact hybrid:
- THE CONTRARIAN: Challenge a common industry myth (e.g., "Why X is actually bad").
- NARRATIVE ASYMMETRY: Connect a weird personal observation to a major industry trend.
- INSIGHT COMPRESSION: Take a 50-page report and distill it into 3 brutal lessons.
- THE TENSION: Highlight a conflict between two valid goals (e.g., Speed vs Quality).
- PROVOCATIVE POSITIONING: Take a strong, opinionated stand on a recent news item.

Return a brief "STRATEGIC BLUEPRINT" (1-2 paragraphs) that the writer must follow.
Include the 'Hook Strategy' and the 'Core Narrative Tension'.
"""
    angle = get_llm_response(
        prompt, 
        provider=state['provider'], 
        model=state['model'],
        api_key=state['api_key'],
        base_url=state['base_url']
    )
    return {
        "strategic_angle": angle,
        "status": "Strategic angle selected. Ready for Drafting."
    }

def writer_node(state: AgentState):
    print(f"--- WRITING (Iteration {state['iterations'] + 1}) ---")
    
    refinement_context = ""
    if state['critique']:
        refinement_context = f"\n\nPREVIOUS CRITIQUE: {state['critique']}\nPlease refine the draft based on this feedback."

    prompt = f"""
You are an elite LinkedIn thought leadership ghostwriter specializing in {state['field']}.

Your task is to write a high-performing LinkedIn post optimized for:
- credibility,
- engagement,
- readability,
- insight density,
- shareability,
- and authentic professional voice.

========================
TOPIC
========================
{state['topic']}

========================
STRATEGIC BLUEPRINT (FOLLOW THIS)
========================
{state['strategic_angle']}

========================
TARGET AUDIENCE
========================
{state['target_audience']}

========================
PRIMARY GOAL
========================
{state['goal']}

========================
RESEARCH & SOURCE MATERIAL
========================
{state['research']}

========================
USER CONTEXT
========================
{state['context']}

========================
KEY POINTS TO EMPHASIZE
========================
{state['key_points']}

========================
CONSTRAINTS
========================
- Target word count: Approximately {state['max_words']} words.
- Hashtags: {"Include 3-5 relevant hashtags" if state['include_hashtags'] else "Do NOT include hashtags."}
- CTA: {"Include a strong, discussion-starting CTA" if state['include_cta'] else "No explicit CTA required."}

========================
WRITING STYLE
========================
{state['style']}

========================
REVISION CONTEXT
========================
{refinement_context}

========================
OBJECTIVE
========================
Create a LinkedIn post that:
- captures attention immediately,
- delivers meaningful insight,
- sounds authoritative but human,
- avoids generic motivational fluff,
- encourages conversation,
- and feels native to LinkedIn.

========================
STRUCTURE REQUIREMENTS
========================
1. Start with a strong hook in the first 1–2 lines.
   The hook should create curiosity, tension, surprise, or challenge assumptions.

2. Keep paragraphs short and scannable.
   Maximum 1–3 lines per paragraph.

3. Introduce a clear central insight or argument.

4. Support claims with:
   - examples,
   - observations,
   - trends,
   - practical lessons,
   - or data from the research.

5. Include at least one:
   - actionable takeaway,
   - strategic insight,
   - or contrarian perspective.

6. End with a strong CTA.
   Examples:
   - asking a thoughtful question,
   - inviting disagreement,
   - encouraging discussion,
   - or prompting reflection.

========================
CONTENT QUALITY RULES
========================
- Do NOT fabricate statistics or claims.
- Do NOT invent sources.
- Do NOT sound corporate or robotic.
- Avoid clichés such as:
  "game changer",
  "unlock potential",
  "in today's fast-paced world",
  "leverage AI",
  etc.

- Avoid excessive emojis.
- Avoid hashtags unless naturally useful.
- Avoid repeating the same idea.
- Do not over-explain obvious concepts.
- Prioritize clarity over hype.

========================
TONE REQUIREMENTS
========================
The tone should match:
{state['style']}

Possible tones include:
- analytical,
- contrarian,
- visionary,
- educational,
- founder-style,
- technical but accessible,
- reflective,
- provocative,
- data-driven.

========================
OUTPUT REQUIREMENTS
========================
Return ONLY the final LinkedIn post.

Do not include:
- explanations,
- notes,
- markdown formatting,
- titles,
- labels,
- or commentary.
"""
    
    draft = get_llm_response(
        prompt, 
        provider=state['provider'], 
        model=state['model'],
        api_key=state['api_key'],
        base_url=state['base_url']
    )
    
    updates = {
        "draft": draft, 
        "iterations": state['iterations'] + 1,
        "status": "Draft created. Sending for Review.",
        "draft_history": state.get('draft_history', []) + [draft]
    }
    
    # Store initial draft if this is the first iteration
    if state['iterations'] == 0:
        updates["initial_draft"] = draft
        
    return updates

def reviewer_node(state: AgentState):
    print("--- REVIEWING ---")
    prompt = f"""
You are a senior LinkedIn content strategist and audience growth expert.

Your task is to critically evaluate the following LinkedIn post for quality, engagement potential, credibility, and clarity.

========================
POST TO REVIEW
========================
{state['draft']}

========================
TARGET STYLE
========================
{state['style']}

========================
REVIEW CRITERIA
========================

Evaluate the post on the following dimensions:

1. HOOK QUALITY
- Does the opening create immediate curiosity or emotional tension?
- Would a professional stop scrolling to read further?

2. READABILITY
- Is the formatting easy to scan on mobile?
- Are paragraphs concise?
- Is the pacing smooth?

3. ORIGINALITY
- Does the post contain genuine insight?
- Or does it sound generic/recycled?

4. VALUE DENSITY
- Does the reader learn something meaningful?
- Are there actionable insights or strong observations?

5. CREDIBILITY
- Are claims believable and grounded?
- Any signs of hallucination or exaggerated statements?

6. TONE ALIGNMENT
- Does the writing match:
{state['style']} ?

7. ENGAGEMENT POTENTIAL
- Is the ending likely to generate comments or discussion?

========================
DECISION RULES
========================

Reply with EXACTLY one of the following formats:

1. If the post is production-ready:

APPROVED

2. If the post needs improvement:

NEEDS_CHANGES:
- issue 1
- issue 2
- issue 3

========================
IMPORTANT RULES
========================
- Be direct and specific.
- Do not rewrite the post.
- Focus on strategic weaknesses.
- Avoid vague feedback like "make it more engaging."
- Critique only high-impact issues.
"""
    
    critique = get_llm_response(
        prompt, 
        provider=state['provider'], 
        model=state['model'],
        api_key=state['api_key'],
        base_url=state['base_url']
    )
    
    return {
        "critique": critique,
        "status": "Review complete."
    }

def editor_node(state: AgentState):
    print("--- FINAL EDITING ---")
    prompt = f"""
You are a professional editorial copy editor specializing in LinkedIn thought leadership content.

Your task is to perform a final editorial polish on the draft below.

========================
DRAFT
========================
{state['draft']}

========================
EDITORIAL OBJECTIVES
========================
Improve:
- grammar,
- clarity,
- sentence flow,
- readability,
- punctuation,
- spacing,
- rhythm,
- and phrasing quality.

========================
STRICT RULES
========================
- Preserve the original meaning.
- Preserve the original tone and personality.
- Do NOT change the strategic message.
- Do NOT remove strong opinions.
- Do NOT simplify nuanced insights.
- Do NOT add new claims or information.
- Do NOT make the writing sound AI-generated.
- Do NOT over-polish into corporate language.

========================
LINKEDIN OPTIMIZATION
========================
- Ensure clean spacing for mobile reading.
- Preserve strong hooks.
- Preserve conversational flow.
- Keep paragraphs compact and readable.

========================
OUTPUT REQUIREMENTS
========================
Return ONLY the final polished LinkedIn post.
Do not include explanations or notes.
"""
    
    final_draft = get_llm_response(
        prompt, 
        provider=state['provider'], 
        model=state['model'],
        api_key=state['api_key'],
        base_url=state['base_url']
    )
    
    return {
        "draft": final_draft,
        "status": "Final polish applied."
    }

def should_continue(state: AgentState) -> Literal["writer", "editor"]:
    if state['iterations'] >= state['max_iterations']:
        return "editor"
    
    if "APPROVED" in state['critique'].upper():
        return "editor"
    
    return "writer"

# Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("planner", planner_node)
workflow.add_node("search_node", search_node)
workflow.add_node("strategist", strategist_node)
workflow.add_node("writer", writer_node)
workflow.add_node("reviewer", reviewer_node)
workflow.add_node("editor", editor_node)

workflow.add_edge(START, "planner")
workflow.add_edge("planner", "search_node")
workflow.add_edge("search_node", "strategist")
workflow.add_edge("strategist", "writer")
workflow.add_edge("writer", "reviewer")

workflow.add_conditional_edges(
    "reviewer",
    should_continue,
    {
        "writer": "writer",
        "editor": "editor"
    }
)

workflow.add_edge("editor", END)

# Compile the graph
agent_app = workflow.compile()
