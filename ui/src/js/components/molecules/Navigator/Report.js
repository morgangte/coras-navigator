import { jsPDF } from 'jspdf';

export default class CorasReport {
    constructor() {
        this.doc = new jsPDF();
        this.ready = true;
        this.pageHeight = this.doc.internal.pageSize.getHeight(); 

        this.sections = [];
        this.addTitle("CORAS Navigator - Report of a Guided Risk Analysis");
    }

    addTitle(text) {
        this.sections.push({
            append: (y) => {
                const lines = this.doc.splitTextToSize(text, 175);
                for (const line of lines) {
                    y = this.appendText(line, 16, 'bold', 15, y, 7)
                }    
                return y;
            }
        });
        return this;
    }
    
    addSubTitle(title) {
        this.sections.push({
            append: (y) => {
                y += 5;
                const lines = this.doc.splitTextToSize(title, 175);
                for (const line of lines) {
                    y = this.appendText(line, 12, 'bold', 15, y, 5);
                }
                return y;
            }
        });    
        return this;
    }

    addParagraph(text) {
        this.sections.push({
            append: (y) => {
                const lines = this.doc.splitTextToSize(text, 175);
                for (const line of lines) {
                    y = this.appendText(line, 12, 'normal', 20, y, 5);
                }
                return y;
            }
        });
        return this;
    }

    addPNG(source, width, height, alias) {
        const ratio = height/width;
        const IMAGE_WIDTH = 190;
        const IMAGE_HEIGHT = ratio * IMAGE_WIDTH;

        this.sections.push({
            append: (y) => {
                if (y + IMAGE_HEIGHT > this.pageHeight - 15) {
                    this.doc.addPage();
                    y = 15;
                }
                this.doc.addImage(source, 'PNG', 10, y, IMAGE_WIDTH, IMAGE_HEIGHT, alias, 'NONE', 0);
                y += IMAGE_HEIGHT;
                return y;
            }
        });
        return this;
    }

    appendText(text, fontSize, fontWeight, x, y, lineHeight) {
        if (y + lineHeight > this.pageHeight - 15) {
            this.doc.addPage();
            y = 15;
        }

        this.doc.setFontSize(fontSize)
                .setFont(undefined, fontWeight)
                .text(text, x, y);
        y += lineHeight;
        return y;
    }

    generate(filename) {
        let y = 15; 
        for (const section of this.sections) {
            y = section.append(y);
        }

        this.doc.save(filename);
    }
}

export function svgStringToImage(svgString, width, height) {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Create canvas and draw the SVG image on it
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Get PNG Data URL from canvas
      const pngDataUrl = canvas.toDataURL("image/png");

      URL.revokeObjectURL(url);
      resolve(pngDataUrl);
    };
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

