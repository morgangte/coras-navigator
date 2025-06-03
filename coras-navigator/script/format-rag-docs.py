import csv

class Capec:
    ID = 0
    NAME = 1
    ABSTRACTION = 2
    STATUS = 3
    DESCRIPTION = 4
    ALTERNATE_TERMS = 5
    LIKELIHOOD = 6
    SEVERITY = 7
    RELATED_ATTACK_PATTERNS = 8
    EXECUTION_FLOW = 9
    PREREQUISITES = 10
    SKILLS_REQUIRED = 11
    RESOURCES_REQUIRED = 12
    INDICATORS = 13
    CONSEQUENCES = 14
    MITIGATIONS = 15
    EXAMPLE_INSTANCES = 16
    RELATED_WEAKNESSES = 17
    TAXONOMY = 18
    NOTES = 19

class CWE:
    ID = 0
    NAME = 1
    WEAKNESS_ABSTRACTION = 2
    STATUS = 3
    DESCRIPTION = 4 
    EXTENDED_DESCRIPTION = 5 
    RELATED_WEAKNESSES = 6
    WEAKNESS_ORDINALITIES = 7
    APPLICABLE_PLATFORMS = 8
    BACKGROUND_DETAILS = 9
    ALTERNATE_TERMS = 10
    MODES_OF_INTRODUCTION = 11 
    EXPLOITATION_FACTORS = 12
    LIKELIHOOD_OF_EXPLOIT = 13
    COMMON_CONSEQUENCES = 14
    DETECTION_METHODS = 15
    POTENTIAL_MITIGATIONS = 16
    OBSERVED_EXAMPLES = 17
    FUNCTIONAL_AREAS = 18
    AFFECTED_RESOURCES = 19
    TAXONOMY_MAPPINGS = 20
    RELATED_ATTACK_PATTERNS = 21
    NOTES = 22

def format_capec_document_row(row) -> str:
    return f"{row[Capec.NAME]}: {row[Capec.DESCRIPTION]}\n"

def format_cwe_document_row(row) -> str:
    if row[CWE.WEAKNESS_ABSTRACTION] == "Variant":
        return ""

    return f"CWE-{row[CWE.ID]}: {row[CWE.NAME]}: {row[CWE.DESCRIPTION]}\n"

def format_csv_document(filename_in: str, filename_out: str, format_row) -> None:
    with open(filename_in, "r") as file_in, open(filename_out, "w") as file_out:
        reader = csv.reader(file_in)
        title = reader.__next__()
        for row in reader:
            text = format_row(row)
            file_out.write(text)

if __name__ == "__main__":
    format_csv_document(
        "rag-docs/capec-mechanisms-of-attack.csv", 
        "rag-docs/capec-mechanisms-of-attack.txt",
        format_capec_document_row
    )

    # CWE Documents
    format_csv_document(
        "rag-docs/cwe-software-development.csv",
        "rag-docs/cwe-software-development.txt",
        format_cwe_document_row   
    )
    format_csv_document(
        "rag-docs/cwe-hardware-design.csv",
        "rag-docs/cwe-hardware-design.txt",
        format_cwe_document_row   
    )
    format_csv_document(
        "rag-docs/cwe-research-concepts.csv",
        "rag-docs/cwe-research-concepts.txt",
        format_cwe_document_row   
   )
 
