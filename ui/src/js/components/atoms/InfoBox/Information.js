export default {
    diagrams: {
        asset: {
            description: "Asset diagrams are used to define and document the assets of relevance to the analysis."
        },
        threat: {
            description: "Threat diagrams are used to identify the potential risks the identified assets may face, and how they may be targeted. They are also used as the basis for estimating the risk level of the identified risks."
        },
        risk: {
            description: "Risk diagram presents a more concise picture of the identified risks. They are used as a base for evaluating which risks should be evaluated for treatment."
        },
        treatment: {
            description: "Treatment diagrams are used to identify and document viable treatments to reduce the risk levels of the identified risks."
        },
        treatment_overview: {
            description: "Treatment overview diagram are used to present the final results of the analysis."
        }

    },
    perspectives: {
        before: {
            description: "The before perspective allows for explicit modeling of elements that only exist in their current state before the change has occured."
        },
        before_after: {
            description: "The before-after perspective allows for explicit modeling of elements that are persistent over the course of the change."
        },
        after: {
            description: "The after perspective allows for explicit modeling of elements that are added to the diagram as part of the change."
        }

    },
    elements: {
        stakeholder: {
            description: "A stakeholder, or party, is an organization, company, person, group or other body on whose behalf the risk analysis is conducted."
        },
        direct_asset: {
            description: "An asset is something to which a party assigns value and hence for which the party requires protection. A direct asset is an asset that is harmed directly by an unwanted incident."
        },
        indirect_asset: {
            description: "An Indirect asset is an asset that, with respect to the target and scope of analysis, is harmed only via harm to other assets."
        },
        threat_scenario: {
            description: "A threat scenario is a chain or series of events that is initiated by a threat source, and that may lead to an unwanted incident."
        },
        unwanted_incident: {
            description: "An unwanted incident is an incident that harms or reduces the value of an asset."
        },
        risk: {
            description: "A risk is the likelihood of an unwanted incident and its consequence for a specific asset."
        },
        human_threat_non_malicious: {
            description: "A threat source is a potential cause of an unwanted incident. A non-malicious human threat typically takes the form of accidents, and is often due to negligence."
        },
        human_threat_malicious: {
            description: "A threat source is a potential cause of an unwanted incident. A malicious human threat is often represented by the generic hacker, but depending on the party, other entities ranging from script kiddies to nation states may be represented by this threat source."
        },
        threat_non_human: {
            description: "A threat source is a potential cause of an unwanted incident. Non-human threats include malware that is not directly targeted by a malicious human threat, in other words, malware that is found 'in the wild' in cyberspace."
        },
        vulnerability: {
            description: "A vulnerability is a weakness, flaw or deficiency that opens for, or may be exploited by, a threat to cause harm to or reduce the value of an asset."
        },
        treatment: {
            description: "A treatment refers to a method that can be used to decrease the likelihood and or consequence of risk. It can be applied anywhere in the diagram, though most frequently on vulnerabilties."
        },
        indicator: {
            description: "An indicator can be used to describe events or features of a system that may affect the risk evaluation. There are four types of indicators available, depending on where and how the indicator is implemented. "
        }
    }
};