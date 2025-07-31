import csv
import json

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

NAVIGATOR_DIR = "./coras-navigator/"

def format_capec_document_row(row, ids) -> str:
    mitigations = list(filter(lambda x: x != '', row[Capec.MITIGATIONS].split("::")))

    text = f"[CAPEC-{row[Capec.ID]}]\n**Attack pattern**: {row[Capec.NAME]}\n**Description**: {row[Capec.DESCRIPTION]}\n**Mitgations**:\n"
    for mitigation in mitigations:
        text += f"- {mitigation}\n"
    return (f"{text};\n", ids)

def format_cwe_document_row(row, cwe_ids) -> str:
    if row[CWE.ID] in cwe_ids:
        return ("", cwe_ids)

    cwe_ids.append(row[CWE.ID])
    if row[CWE.WEAKNESS_ABSTRACTION] == "Variant":
        return ("", cwe_ids)

    return (f"CWE-{row[CWE.ID]}: {row[CWE.NAME]}: {row[CWE.DESCRIPTION]};\n", cwe_ids)

def format_csv_documents(filenames_in: list[str], filename_out: str, format_row) -> None:
    row_ids = []

    with open(filename_out, "w") as file_out:
        for filename_in in filenames_in:
            with open(filename_in, "r") as file_in:
                reader = csv.reader(file_in)
                title = reader.__next__()
                for row in reader:
                    text, row_ids = format_row(row, row_ids)
                    file_out.write(text)

def get_cwe_dict(cwe_files: list[str]):
    read_cwe_ids = []
    cwe_dict = {}    

    for filename in cwe_files:
        with open(filename, "r") as file:
            reader = csv.reader(file)
            title = reader.__next__()
            for row in reader:
                if row[CWE.ID] in read_cwe_ids:
                    continue
                
                read_cwe_ids.append(row[CWE.ID])
                cwe_dict[row[CWE.ID]] = f"CWE-{row[CWE.ID]}: {row[CWE.NAME]}: {row[CWE.DESCRIPTION]}"
    
    print(f"Saved {len(cwe_dict)} CWE entires.")
    return cwe_dict

def construct_capec_detailed(filename_in: str, filename_out_abstract: str, filename_out_detailed: str, cwe_dict) -> None:
    count = 0
    capec_dict = {}

    with open(filename_in, "r") as file_in, open(filename_out_abstract, "w") as file_out, open(filename_out_detailed, "w") as json_file:
        reader = csv.reader(file_in)
        title = reader.__next__()
        for row in reader:
            mitigation_list = list(filter(lambda x: x != '', row[Capec.MITIGATIONS].split("::")))
            mitigations = ""
            cwe_list = list(filter(lambda x: x != '', row[Capec.RELATED_WEAKNESSES].split("::")))
            cwes = ""
            
            text_abstract = f"[CAPEC-{row[Capec.ID]}]: {row[Capec.NAME]}: {row[Capec.DESCRIPTION]};\n"
            file_out.write(text_abstract)

            for mitigation in mitigation_list:
                mitigations += f"- {mitigation}\n"
            for cwe in cwe_list:
                cwes += f"- {cwe_dict[cwe]}\n"

            text_detailed = f"[CAPEC-{row[Capec.ID]}]\n**Attack pattern**: {row[Capec.NAME]}\n**Description**: {row[Capec.DESCRIPTION]}\n**Vulnerabilities**:\n{cwes}**Mitigations**:\n{mitigations}"
            capec_dict[row[Capec.ID]] = text_detailed
            count += 1

        json.dump(capec_dict, json_file, indent=4) 
        print(f"Saved {count} CAPEC entries (abstract) to '{filename_out_abstract}'.")
        print(f"Saved {count} CAPEC entries (detailed) to '{filename_out_detailed}'.")

if __name__ == "__main__":
    cwe_dict = get_cwe_dict([
        f"{NAVIGATOR_DIR}rag-docs/cwe-software-development.csv",
        f"{NAVIGATOR_DIR}rag-docs/cwe-hardware-design.csv",
        f"{NAVIGATOR_DIR}rag-docs/cwe-research-concepts.csv"
    ])
    construct_capec_detailed(
        f"{NAVIGATOR_DIR}rag-docs/capec-mechanisms-of-attack.csv",
        f"{NAVIGATOR_DIR}rag-docs/capec-abstract.txt",
        f"{NAVIGATOR_DIR}rag-docs/capec-detailed.json",
        cwe_dict
    )

    # format_csv_documents([
    #         f"{NAVIGATOR_DIR}rag-docs/capec-mechanisms-of-attack.csv"
    #     ], 
    #     f"{NAVIGATOR_DIR}rag-docs/capec-mechanisms-of-attack.txt",
    #     format_capec_document_row
    # )

    # CWE Documents
    # format_csv_documents([
    #         f"{NAVIGATOR_DIR}rag-docs/cwe-software-development.csv",
    #         f"{NAVIGATOR_DIR}rag-docs/cwe-hardware-design.csv",
    #         f"{NAVIGATOR_DIR}rag-docs/cwe-research-concepts.csv"
    #     ],
    #     f"{NAVIGATOR_DIR}rag-docs/cwe-records.txt",
    #     format_cwe_document_row   
    # )
    
    print("Successfully formatted RAG docs")
