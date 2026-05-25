import re

class EmergencyDetector:
    def __init__(self):
        # Critical emergencies (Triage Level 1 & 2)
        self.critical_patterns = [
            r"chest\s*pain", r"heart\s*attack", r"cardiac\s*arrest",
            r"difficulty\s*breathing", r"can'?t\s*breathe", r"shortness\s*of\s*breath",
            r"stroke", r"facial\s*droop", r"arm\s*weakness", r"slurred\s*speech",
            r"unconscious", r"passed\s*out", r"fainted\s*and\s*unresponsive",
            r"severe\s*bleeding", r"hemorrhage", r"arterial\s*bleed",
            r"anaphylaxis", r"throat\s*closing", r"severe\s*allergic",
            r"seizure", r"convulsion", r"status\s*epilepticus",
            r"poisoning", r"overdose", r"swallowed\s*toxin", r"suicidal"
        ]
        
        # Urgent emergencies (Triage Level 3)
        self.urgent_patterns = [
            r"fracture", r"broken\s*bone", r"deep\s*cut", r"laceration",
            r"high\s*fever", r"abdominal\s*pain", r"stomach\s*cramping",
            r"kidney\s*stone", r"blood\s*in\s*urine", r"cannot\s*urinate",
            r"head\s*injury", r"concussion", r"blurry\s*vision", r"dizziness"
        ]

    def detect(self, message: str) -> dict:
        text = message.lower()
        
        # Check critical emergency patterns
        for pattern in self.critical_patterns:
            if re.search(pattern, text):
                return {
                    "is_emergency": True,
                    "triage_level": 1,
                    "triage_label": "Immediate / Resuscitative",
                    "reason": f"Matches critical symptom pattern: '{pattern}'",
                    "action_required": "Call emergency services (108/911) immediately.",
                    "confidence": 0.98
                }
                
        # Check urgent patterns
        for pattern in self.urgent_patterns:
            if re.search(pattern, text):
                return {
                    "is_emergency": False,
                    "triage_level": 3,
                    "triage_label": "Urgent",
                    "reason": f"Matches urgent symptom pattern: '{pattern}'",
                    "action_required": "Consult a healthcare provider or visit urgent care promptly.",
                    "confidence": 0.85
                }
                
        # Less Urgent / Non-Urgent
        return {
            "is_emergency": False,
            "triage_level": 4,
            "triage_label": "Less Urgent / Routine Triage",
            "reason": "No critical or urgent symptom indicators found.",
            "action_required": "Schedule an appointment or practice home care.",
            "confidence": 0.90
        }
