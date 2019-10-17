package com.themais.pdfbox;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.fdf.FDFDocument;
import org.apache.pdfbox.pdmodel.fdf.FDFField;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class PdfBoxPlayBook {
    public static void main(String args[]) throws IOException {

        //Loading an existing document
        File file = new File("D:/downloads/i-129f.pdf");
        try (PDDocument document = PDDocument.load(file)) {

            //Retrieving the pages of the document
//            PDPage page = document.getPage(1);
//            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            PDAcroForm form = document.getDocumentCatalog().getAcroForm();

            FDFDocument fdfDocument = form.exportFDF();

            for (FDFField field : fdfDocument.getCatalog().getFDF().getFields()) {
                travelFDFField("\t", field);
            }
            form.importFDF(fdfDocument);
            document.setAllSecurityToBeRemoved(true);
            document.save(new File("D:/downloads/i-129f-nqmai.pdf"));
        }
    }

    static void travelFDFField(String prefix, FDFField field) throws IOException {
        System.out.println(String.format("%sgetPartialName %s value %s", prefix, field.getPartialFieldName(), field.getValue()));
        if (field.getPartialFieldName().endsWith("Name[0]")) {
            field.setValue("nqmai " + field.getPartialFieldName());
        }
        List<FDFField> kids = field.getKids();
        if (kids == null || kids.isEmpty())
            return;
        for (FDFField kid : kids) {
            travelFDFField(prefix + "\t", kid);
        }

    }
}
