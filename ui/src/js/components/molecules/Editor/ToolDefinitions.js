import joint from 'jointjs';

import {
    assetSymbol,
    assetSymbolOutlined,
    assetSymbolShaded,
    indicatorSymbol,
    indirectAssetSymbol,
    indirectAssetSymbolOutlined,
    indirectAssetSymbolShaded,
    riskSymbol,
    riskSymbolOutlined,
    riskSymbolShaded,
    stakeholderSymbol,
    stakeholderSymbolOutlined,
    stakeholderSymbolShaded,
    threatHumanAccidentalSymbol,
    threatHumanAccidentalSymbolOutline,
    threatHumanAccidentalSymbolShadow,
    threatHumanDeliberateSymbol,
    threatHumanDeliberateSymbolOutlined,
    threatHumanDeliberateSymbolShaded,
    threatNonHumanSymbol,
    threatNonHumanSymbolOutlined,
    threatNonHumanSymbolShaded,
    treatmentSymbol,
    treatmentSymbolOutlined,
    treatmentSymbolShaded,
    unwantedIncidentSymbol,
    unwantedIncidentSymbolOutlined,
    unwantedIncidentSymbolShaded,
    vulnerabilitySymbol,
    vulnerabilitySymbolOutlined,
    vulnerabilitySymbolShaded,
    expand,
} from "./svg//CorasSymbolsBase64.js"

const assetHeight = 60;
const riskHeight = 40;
const indirectHeight = 60;
const stakeholderHeight = 60;
const accidentalHeight = 40;
const deliberateHeight = 40;
const nonHumanHeight = 40;
const incidentHeight = 30;
const indicatorHeight = 40;
const vulnerabilityHeight = 40;
const treatmentHeight = 40;
const expandHeight = 15;

export default [
    {
        shapeFn: () => new joint.shapes.coras.unboxedElement(),
        width: 40,
        height: 80,
        iconHeight: accidentalHeight,
        icon: threatHumanAccidentalSymbol,
        text: "Human Threat\nAccidental",
        id: "human_threat_non_malicious",
        perspectives: {
            0: { "icon/href": threatHumanAccidentalSymbol, "icon/height": accidentalHeight },
            1: { "icon/href": threatHumanAccidentalSymbolOutline, "icon/height": accidentalHeight },
            2: { "icon/href": threatHumanAccidentalSymbolShadow, "icon/height": accidentalHeight }
        },
        existsIn: {
            threat: true,
            risk: true,
            treatment: true,
            treatment_overview: true
        },
        role: "threat_source"
    },
    {
        shapeFn: () => new joint.shapes.coras.unboxedElement(),
        width: 40,
        height: 100,
        iconHeight: deliberateHeight,
        icon: threatHumanDeliberateSymbol,
        text: "Human Threat\nDeliberate",
        id: "human_threat_malicious",
        perspectives: {
            0: { "icon/href": threatHumanDeliberateSymbol, "icon/height": deliberateHeight },
            1: { "icon/href": threatHumanDeliberateSymbolOutlined, "icon/height": deliberateHeight },
            2: { "icon/href": threatHumanDeliberateSymbolShaded, "icon/height": deliberateHeight }
        },
        existsIn: {
            threat: true,
            risk: true,
            treatment: true,
            treatment_overview: true
        },
        role: "threat_source"
    },
    {
        shapeFn: () => new joint.shapes.coras.unboxedElement(),
        width: 40,
        height: 80,
        iconHeight: nonHumanHeight,
        icon: threatNonHumanSymbol,
        text: "Non-Human\nThreat",
        id: "threat_non_human",
        perspectives: {
            0: { "icon/href": threatNonHumanSymbol, "icon/height": nonHumanHeight },
            1: { "icon/href": threatNonHumanSymbolOutlined, "icon/height": nonHumanHeight },
            2: { "icon/href": threatNonHumanSymbolShaded, "icon/height": nonHumanHeight }
        },
        existsIn: {
            threat: true,
            risk: true,
            treatment: true,
            treatment_overview: true
        },
        role: "threat_source"
    },
    {
        shapeFn: () => new joint.shapes.coras.ellipseElement(),
        width: 190,
        height: 80,
        iconHeight: riskHeight,
        icon: riskSymbol,
        text: "Threat Scenario",
        id: "threat_scenario",
        perspectives: {
            0: { "icon/href": riskSymbol, "icon/height": riskHeight },
            1: { "icon/href": riskSymbolOutlined, "icon/height": riskHeight },
            2: { "icon/href": riskSymbolShaded, "icon/height": riskHeight }
        },
        existsIn: {
            threat: true,
            treatment: true
        },
        valueType: "Likelihood",
        role: "threat_scenario",
    },
    {
        shapeFn: () => new joint.shapes.coras.rectElement(),
        width: 190,
        height: 80,
        iconHeight: incidentHeight,
        icon: unwantedIncidentSymbol,
        text: "Incident",
        id: "unwanted_incident",
        perspectives: {
            0: { "icon/href": unwantedIncidentSymbol, "body/strokeDasharray": "", "icon/height": incidentHeight },
            1: { "icon/href": unwantedIncidentSymbolOutlined, "body/strokeDasharray": "8, 4", "icon/height": incidentHeight },
            2: { "icon/href": unwantedIncidentSymbolShaded, "body/strokeDasharray": "8, 4", "icon/height": incidentHeight }
        },
        existsIn: {
            threat: true,
            treatment: true
        },
        valueType: "Likelihood",
        role: "unwanted_incident"
    },
    {
        shapeFn: () => new joint.shapes.coras.riskElement(),
        width: 190,
        height: 80,
        iconHeight: riskHeight,
        icon: riskSymbol,
        text: "Risk",
        id: "risk",
        perspectives: {
            0: { "icon/href": riskSymbol, "icon/height": riskHeight },
            1: { "icon/href": riskSymbolOutlined, "icon/height": riskHeight },
            2: { "icon/href": riskSymbolShaded, "icon/height": riskHeight }
        },
        existsIn: {
            risk: true,
            treatment: true,
            treatment_overview: true
        },
        valueType: "Likelihood", //?
        role: "risk",
    },
    {
        shapeFn: () => new joint.shapes.coras.unboxedElement(),
        width: 40,
        height: 80,
        iconHeight: stakeholderHeight,
        icon: stakeholderSymbol,
        text: "Stakeholder",
        id: "stakeholder",
        perspectives: {
            0: { "icon/href": stakeholderSymbol, "icon/height": stakeholderHeight },
            1: { "icon/href": stakeholderSymbolOutlined, "icon/height": stakeholderHeight },
            2: { "icon/href": stakeholderSymbolShaded, "icon/height": stakeholderHeight }
        },
        existsIn: {
            //asset: true
        },
        role: "risk"
    },
    {
        shapeFn: () => new joint.shapes.coras.roundRectElement(),
        width: 300,
        height: 300,

        //sizeSelector: unwantedIncidentSymbol,
        iconHeight: stakeholderHeight,
        icon: stakeholderSymbol,
        text: "Stakeholder",
        id: "stakeholder",
        perspectives: {
            0: { "icon/href": stakeholderSymbol, "icon/height": stakeholderHeight },
            1: { "icon/href": stakeholderSymbolOutlined, "icon/height": stakeholderHeight },
            2: { "icon/href": stakeholderSymbolShaded, "icon/height": stakeholderHeight }
        },
        existsIn: {
            asset: true
        },
        role: "stakeholder"
    },
    {
        shapeFn: () => new joint.shapes.coras.unboxedElement(),
        width: 40,
        height: 80,
        iconHeight: assetHeight,
        icon: assetSymbol,
        text: "Asset",
        id: "direct_asset",
        perspectives: {
            0: { "icon/href": assetSymbol, "icon/height": assetHeight },
            1: { "icon/href": assetSymbolOutlined, "icon/height": assetHeight },
            2: { "icon/href": assetSymbolShaded, "icon/height": assetHeight }
        },
        //
        existsIn: {
            threat: true,
            asset: true,
            risk: true,
            treatment: true,
            treatment_overview: true
        },
        role: "direct_asset"
    },
    {
        shapeFn: () => new joint.shapes.coras.unboxedElement(),
        width: 40,
        height: 80,
        iconHeight: indirectHeight,
        icon: indirectAssetSymbol,
        text: "Indirect\nAsset",
        id: "indirect_asset",

        perspectives: {
            0: { "icon/href": indirectAssetSymbol, "icon/height": indirectHeight },
            1: { "icon/href": indirectAssetSymbolOutlined, "icon/height": indirectHeight },
            2: { "icon/href": indirectAssetSymbolShaded, "icon/height": indirectHeight }
        },
        existsIn: {
            asset: true,
            risk: true,
            treatment: true,
            treatment_overview: true
        },
        role: "indirect_asset"
    },
    {
        shapeFn: () => new joint.shapes.coras.unboxedElement(),
        width: 40,
        height: 80,
        iconHeight: vulnerabilityHeight,
        icon: vulnerabilitySymbol,
        text: "Vulnerability",
        id: "vulnerability",
        perspectives: {
            0: { "icon/href": vulnerabilitySymbol, "icon/height": vulnerabilityHeight },
            1: { "icon/href": vulnerabilitySymbolOutlined, "icon/height": vulnerabilityHeight },
            2: { "icon/href": vulnerabilitySymbolShaded, "icon/height": vulnerabilityHeight }
        },
        existsIn: {
            threat: true,
            treatment: true
        },
        role: "vulnerability",
        magnet: 'passive'
    },
    {
        shapeFn: () => new joint.shapes.coras.ellipseElement(),
        width: 190,
        height: 80,
        iconHeight: treatmentHeight,
        icon: treatmentSymbol,
        text: "Treatment",
        id: "treatment",
        perspectives: {
            0: { "icon/href": treatmentSymbol, "body/strokeDasharray": "", "icon/height": treatmentHeight },
            1: { "icon/href": treatmentSymbolOutlined, "body/strokeDasharray": "8, 4", "icon/height": treatmentHeight },
            2: { "icon/href": treatmentSymbolShaded, "body/strokeDasharray": "8, 4", "icon/height": treatmentHeight }
        },
        existsIn: {
            //threat: true,
            //risk: true,
            treatment: true,
            treatment_overview: true
        },
        role: "treatment"
    },
    {
        shapeFn: () => new joint.shapes.coras.indicatorElement(),
        width: 190,
        height: 80,
        //fill,
        iconHeight: indicatorHeight,
        icon: indicatorSymbol,
        text: "Indicator",
        id: "indicator",
        perspectives: {
            0: { "icon/href": indicatorSymbol, "body/strokeDasharray": "", "icon/height": indicatorHeight },
            1: { "icon/href": indicatorSymbol, "body/strokeDasharray": "", "icon/height": indicatorHeight },
            2: { "icon/href": indicatorSymbol, "body/strokeDasharray": "", "icon/height": indicatorHeight }
        },
        existsIn: {
            threat: true,
            treatment: true
        },
        role: "indicator",
        indicatorType: "businessConfiguration"
    },
]
