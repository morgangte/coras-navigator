from langchain_core.messages import AIMessage
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, FewShotChatMessagePromptTemplate

import json

class Formatter:
    llm = None

    def __init__(self, model: str):
        self.llm = ChatOllama(
            model=model,
            temperature=0
        )

    def format(self, text: str) -> str:
        raise Exception("Invalid class: format() not implemented")

class SimpleJSONFormatter(Formatter):
    system_prompt = """You are a helpul assistant that formats text input by the user into a structured JSON file following a pre-defined format. The JSON format you must follow is:
{{ 
    "vertices": [{{ 
        "type": string,  
        "id": string,   
        "text": string     
    }}],
    "edges": [{{
        "source": string,
        "target": string,
        "vulnerabilities": [string]
    }}]
}} 
The rules you must follow to generate the JSON file are:
- Include each of the described risks in the JSON
- Vertices type can be "human_threat_non_malicious" (a human threat with no malicious intent), "human_threat_malicious" (a human threat with malicious intent), "non_human_threat" (a threat that is not a human), "threat_scenario", "unwanted_incident", or "asset"
- Every vertices must have a type, an id and a text
- Every edges must have a source and a target
- A threat can initiate a threat scenario
- A threat scenario can lead to an other threat scenario or an unwanted incident
- Every unwanted incident must impact at least one asset."""
    json_schema = {
"type": "object",
  "properties": {
    "vertices": {
      "type": "array",
      "description": "List of vertices",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "enum": [
              "threat_scenario",
              "unwanted_incident",
              "asset",
              "human_threat_non_malicious",
              "human_threat_malicious",
              "non_human_threat"
            ],
            "type": "string",
            "description": "The type of vertice"
          },
          "id": {
            "type": "string",
            "description": "Unique ID of the vertice"
          },
          "text": {
            "type": "string",
            "description": "Text description of the vertice"
          }
        },
        "required": [
          "type",
          "id",
          "text"
        ]
      }
    },
    "edges": {
      "type": "array",
      "description": "List of edges",
      "items": {
        "type": "object",
        "properties": {
          "source": {
            "type": "string",
            "description": "The ID of the source vertice"
          },
          "target": {
            "type": "string",
            "description": "The ID of the target vertice"
          },
          "vulnerabilities": {
            "type": "array",
            "description": "List of vulnerabilities associated to the edge",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "source",
          "target"
        ]
      }
    }
  },
  "required": [
    "vertices",
    "edges"
  ]
}
    examples = [
        {"input": """**Risk 1: Insider Attack on Tester Computer**
* **Threat:** Insider with access to tester computer
* **Consecutive Threat Scenarios:**
	1. The insider gains unauthorized access to the tester computer.
	2. The insider programs malicious firmware or credentials into the tester computer.
	3. The compromised tester computer injects the wearable sensor-patch with malicious firmware or credentials (vulerabilities: CWE-1073: Non-SQL Invokable Control Element with Excessive Number of Data Resource Accesses, CWE-140: Improper Neutralization of Delimiters).
* **Unwanted Incident:** Injection of wearable sensor-patch with malicious firmware or credentials
* **Impacted Assets:** Health data, Wearable sensor-patch""",
         "output": """{{
    "edges": [
        {{
            "source": "R1-T1",
            "target": "R1-TS1",
            "vulnerabilities": []
        }},
        {{
            "source": "R1-TS1",
            "target": "R1-TS2",
            "vulnerabilities": []
        }},
        {{
            "source": "R1-TS2",
            "target": "R1-TS3",
            "vulnerabilities": [
                "CWE-1073",
                "CWE-140"
            ]
        }},
        {{
            "source": "R1-TS3",
            "target": "R1-UI",
            "vulnerabilities": []
        }},
        {{
            "source": "R1-UI",
            "target": "health_data",
            "vulnerabilities": []
        }},
        {{
            "source": "R1-UI",
            "target": "wearable_sensor_patch",
            "vulnerabilities": []
        }}
    ],
    "vertices": [
        {{
            "id": "R1-T1",
            "text": "Insider with access to tester computer",
            "type": "human_threat_malicious"
        }},
        {{
            "id": "R1-TS1",
            "text": "The insider gains unauthorized access to the tester computer.",
            "type": "threat_scenario"
        }},
        {{
            "id": "R1-TS2",
            "text": "The insider programs malicious firmware or credentials into the tester computer.",
            "type": "threat_scenario"
        }},
        {{
            "id": "R1-TS3",
            "text": "The compromised tester computer injects the wearable sensor-patch with malicious firmware or credentials.",
            "type": "threat_scenario"
        }},
        {{
            "id": "R1-UI",
            "text": "Injection of wearable sensor-patch with malicious firmware or credentials",
            "type": "unwanted_incident"
        }},
        {{
            "id": "health_data",
            "text": "Health data",
            "type": "asset"
        }},
        {{
            "id": "wearable_sensor_patch",
            "text": "Wearable sensor-patch",
            "type": "asset"
        }}
    ]
}}"""
        }
    ]
    def format(self, text: str) -> str:
        print("Formatter::format() called")
        example_prompt = ChatPromptTemplate.from_messages([
            ("human", "{input}"),
            ("ai", "{output}")
        ])
        few_shot_prompt = FewShotChatMessagePromptTemplate(
            example_prompt=example_prompt,
            examples=self.examples
        )
    
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            few_shot_prompt,
            ("human", "{input}")
        ])

        structured_llm = self.llm.with_structured_output(self.json_schema)

        chain = prompt | structured_llm
        result_dict = chain.invoke({
            "input": text
        })

        return json.dumps(result_dict)
