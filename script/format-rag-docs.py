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

def format_capec_document(filename_in: str, filename_out: str) -> None:
    with open(filename_in, "r") as file_in, open(filename_out, "w") as file_out:
        reader = csv.reader(file_in)
        title = reader.__next__()
        for row in reader:
            text = f"{row[Capec.NAME]}: {row[Capec.DESCRIPTION]}\n"
            file_out.write(text)
        
if __name__ == "__main__":
    format_capec_document("rag-docs/capec-mechanisms-of-attack.csv", "rag-docs/capec-mechanisms-of-attack.txt")
