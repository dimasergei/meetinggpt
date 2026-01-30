from anthropic import AsyncAnthropic
import json

class MeetingAnalyzer:
    """
    Analyze meeting transcript with Claude
    
    Extracts:
    - Summary
    - Action items
    - Key decisions
    - Attendees mentioned
    """
    
    def __init__(self):
        self.client = AsyncAnthropic()
        self.model = "claude-sonnet-4-20250514"
    
    async def analyze(self, transcript: str) -> Dict:
        """Analyze meeting transcript"""
        
        prompt = f"""Analyze this meeting transcript.

TRANSCRIPT:
{transcript}

Extract the following (JSON format):
{{
  "summary": "2-3 sentence overview",
  "action_items": [
    {{"task": "...", "owner": "...", "deadline": "..."}}
  ],
  "key_decisions": ["decision 1", "decision 2"],
  "topics_discussed": ["topic 1", "topic 2"],
  "next_steps": ["step 1", "step 2"]
}}
"""
        
        response = await self.client.messages.create(
            model=self.model,
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}],
        )
        
        # Parse JSON
        text = response.content[0].text
        if "```json" in text:
            json_str = text.split("```json")[1].split("```")[0]
        else:
            json_str = text
        
        return json.loads(json_str)
