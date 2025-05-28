import React from 'react';

import Preview from '../molecules/Preview/Preview.jsx';
import KeyPoints from '../molecules/KeyPoints/KeyPoints.jsx';

const keyPointData= [
    {
        header: "Risk assessment",
        //text: "CORAS supports risk analysis by providing a stepwise method helping you all the way from defining goals for the analysis, through identifying assets and risks to defining probabilities and mitigations for the discovered risks. The CORAS method can be used for any problem domain from small projects to large enterprise endeavors.", 
        text: "CORAS supports risk assessment by providing a stepwise method helping you all the way from specifying goals for the assessment, through identifying assets and risks to defining risk levels and mitigations for the discovered risks. The CORAS method has particular focus on security, but can be used for any problem domain, from small projects to large enterprise endeavours.  For more check out the CORAS book published by Springer. Chapter 3 of the CORAS book 'A Guided Tour of the CORAS Method' is also freely available.",
        links: [
            {
                text: "Check out the book ",
                href: "https://www.amazon.com/Model-Driven-Risk-Analysis-CORAS-Approach-ebook/dp/B00F75RASI"
            },
            {
                text: "Chapter 3 ",
                href: "https://www.researchgate.net/publication/287673426_A_Guided_Tour_of_the_CORAS_Method"
                }
        ]
    },
    {
        header: "Risk modelling",
        //text: "The CORAS modelling language is an easy-to-use graphical modelling language that can be translated into text descriptions. The language consists of threats, vulnerabilities, incidents and assets, and the relations between these. CORAS is well suited to create a graphical representation of a threat scenario, to be used for discussion and mitigation.",
        text: "The CORAS modelling language is an easy-to-use graphical modelling language. The language may be used to capture threats, vulnerabilities, incidents and assets, and the relations between these. CORAS is well suited to model threat scenarios, to be used for discussion and mitigation during risk assessment.",
        links: []
    },
    {
        header: "Tool support",
        //text: "The method and language is supported by several accessible and easy-to-use tools. You can try the online editor on this page, or download stencils for Microsoft Visio. There is also a windows GUI for creating CORAS diagrams. The approach is described and explained in several published articles, in addition to a text book explaining risk assessment in general, and CORAS in particular.",
        text: "The method and language is supported by an easy-to-use tool. You can try it on this page. You may alternatively download stencils for Microsoft Visio. There is also a Windows GUI for CORAS diagrams. ",
        links: [
            {
                text: "Windows GUI ",
                href: "http://coras.sourceforge.net/coras_tool.html"
            },
            {
                text: "Visio stencils ",
                href: "http://coras.sourceforge.net/downloads.html"
            }
        ]
    }
]

const Frontpage = (props) =>
    <div>
        <Preview tagLine={"CORAS - A risk modeling approach"}/>
        <KeyPoints keyPoints={keyPointData} />
    </div>;

export default Frontpage;