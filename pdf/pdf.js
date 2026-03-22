const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const express = require('express');

const logoPath = path.join('../uploads/37560.jpg');
const config = {
    fontSize: {
        title: 10,
        subtitle: 6,
        text: 6,
        principal: 12
    },
    colors: {
        title: rgb(0, 0, 0),
        text: rgb(0.2, 0.2, 0.2),
        highlight: rgb(0, 0, 1)
    }
};

const app = express();
const port = 3000;

// Middleware para parsear JSON en el cuerpo de la solicitud
app.use(express.json());

async function createPDF(cotizacion) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let yPosition = height - 50;

    // Imagen 60x60
    if (fs.existsSync(logoPath)) {
        const imageBytes = fs.readFileSync(logoPath);
        const image = await pdfDoc.embedJpg(imageBytes);
        page.drawImage(image, { x: 50, y: yPosition - 60, width: 60, height: 60 });
    }

    // Cotización Nº, Número de Orden y Fecha en la misma línea
    page.drawText(`Cotización N° ${cotizacion.numero}`, { x: 250, y: yPosition, size: config.fontSize.principal, font, color: config.colors.title });
    page.drawText(`Fecha: ${cotizacion.fecha}`, { x: 450, y: yPosition - 20, size: config.fontSize.title, font, color: config.colors.text });
    yPosition -= 100;

    // Datos del Vendedor
    page.drawText('Datos del Vendedor:', { x: 50, y: yPosition, size: config.fontSize.title, font: boldFont, color: config.colors.highlight });
    yPosition -= 15;

    const sellerDataLeft = [
        [`Nombre:`, cotizacion.vendedor.nombre],
        [`RUT:`, cotizacion.vendedor.rut],
        [`Email:`, cotizacion.vendedor.email]
    ];
    const sellerDataRight = [
        [`Teléfono:`, cotizacion.vendedor.telefono],
        [`Dirección:`, cotizacion.vendedor.direccion],
        [`Comuna:`, cotizacion.vendedor.comuna]
    ];

    sellerDataLeft.forEach(([label, value], index) => {
        page.drawText(`${label}`, { x: 50, y: yPosition - (index * 20), size: config.fontSize.text, font: boldFont, color: config.colors.text });
        page.drawText(`${value}`, { x: 100, y: yPosition - (index * 20), size: config.fontSize.text, font, color: config.colors.text });
    });
    sellerDataRight.forEach(([label, value], index) => {
        page.drawText(`${label}`, { x: width - 170, y: yPosition - (index * 20), size: config.fontSize.text, font: boldFont, color: config.colors.text });
        page.drawText(`${value}`, { x: width - 110, y: yPosition - (index * 20), size: config.fontSize.text, font, color: config.colors.text });
    });
    yPosition -= (sellerDataLeft.length * 20) + 20;

    // Datos del Cliente
    page.drawText('Datos del Cliente:', { x: 50, y: yPosition, size: config.fontSize.title, font: boldFont, color: config.colors.highlight });
    yPosition -= 15;

    const clientDataLeft = [
        [`Nombre:`, cotizacion.cliente.nombre],
        [`RUT:`, cotizacion.cliente.rut],
        [`Email:`, cotizacion.cliente.email]
    ];
    const clientDataRight = [
        [`Teléfono:`, cotizacion.cliente.telefono],
        [`Dirección:`, cotizacion.cliente.direccion],
        [`Comuna:`, cotizacion.cliente.comuna]
    ];

    clientDataLeft.forEach(([label, value], index) => {
        page.drawText(`${label}`, { x: 50, y: yPosition - (index * 20), size: config.fontSize.text, font: boldFont, color: config.colors.text });
        page.drawText(`${value}`, { x: 100, y: yPosition - (index * 20), size: config.fontSize.text, font, color: config.colors.text });
    });
    clientDataRight.forEach(([label, value], index) => {
        page.drawText(`${label}`, { x: width - 170, y: yPosition - (index * 20), size: config.fontSize.text, font: boldFont, color: config.colors.text });
        page.drawText(`${value}`, { x: width - 110, y: yPosition - (index * 20), size: config.fontSize.text, font, color: config.colors.text });
    });
    yPosition -= (clientDataLeft.length * 20) + 20;

    // Tabla de Ítems
    page.drawText('Detalle de Ítems:', { x: 50, y: yPosition, size: config.fontSize.title, font, color: config.colors.highlight });
    yPosition -= 20;

    let xStart = 50;
    const columnWidths = [20, 40, 40, 150, 100, 50, 50, 50]; // Ajuste de las columnas
    const headers = ['#', 'Codigo', 'Cantidad', 'Producto', 'Nota', 'Precio', 'Descuento', 'Subtotal'];

    // Dibuja los encabezados con bordes y alineación centrada
    headers.forEach((text, index) => {
        page.drawText(text, { x: xStart + (columnWidths[index] - font.widthOfTextAtSize(text, config.fontSize.text)) / 2, y: yPosition - 10, size: config.fontSize.text, font, color: config.colors.text });
        page.drawRectangle({
            x: xStart,
            y: yPosition - 15,
            width: columnWidths[index],
            height: 20,
            borderColor: config.colors.highlight,
            borderWidth: 1,
        });
        xStart += columnWidths[index];
    });
    yPosition -= 20;

    cotizacion.items.forEach((item, index) => {
        xStart = 50;
        const rowData = [
            (index + 1).toString(),
            item.codigo,
            item.cantidad.toString(),
            item.producto,
            item.nota,
            `$${item.precio.toLocaleString()}`,
            `$${item.descuento.toLocaleString()}`,
            `$${item.subtotal.toLocaleString()}`
        ];

        // Dibuja los valores de la fila con borde y alineación
        rowData.forEach((text, colIndex) => {
            let xAlign = xStart + (columnWidths[colIndex] - font.widthOfTextAtSize(text, config.fontSize.text)) / 2;

            // Alineación a la izquierda para 'Producto' y 'Nota'
            if (colIndex != 0 && colIndex != 2) {
                xAlign = xStart + 5;
            }

            page.drawText(text, { x: xAlign, y: yPosition - 10, size: config.fontSize.text, font, color: config.colors.text });
            page.drawRectangle({
                x: xStart,
                y: yPosition - 15,
                width: columnWidths[colIndex],
                height: 20,
                borderColor: config.colors.highlight,
                borderWidth: 1,
            });
            xStart += columnWidths[colIndex];
        });
        yPosition -= 20;
    });
    yPosition -= 30;

    // Totales
    const totalStartY = yPosition;
    const totalWidth = 110; // Reducción del ancho de cada columna
    const borderHeight = 15; // Altura compacta para cada fila
    const separatorX = width - totalWidth + 70; // Ajuste de la posición del separador entre las columnas

    // Dibuja el borde y la fila para 'Neto'
    page.drawRectangle({
        x: width - totalWidth - 50,
        y: totalStartY - 10,
        width: totalWidth,
        height: borderHeight,
        borderColor: config.colors.highlight,
        borderWidth: 1,
    });
    page.drawText(`Neto:`, { x: width - totalWidth - 45, y: yPosition - 5, size: config.fontSize.text, font, color: config.colors.text });
    page.drawText(`$${cotizacion.neto.toLocaleString()}`, { x: width - totalWidth + 5, y: yPosition - 5, size: config.fontSize.text, font, color: config.colors.text });
    yPosition -= borderHeight;

    // Dibuja el separador entre las dos columnas
    page.drawLine({
        start: { x: separatorX - 70, y: totalStartY + 5.5 },
        end: { x: separatorX - 70, y: totalStartY + 4.5 - (borderHeight * 3) }, // Línea desde el principio hasta el final de las 3 filas
        color: config.colors.highlight,
        thickness: 1
    });

    // Dibuja el borde y la fila para 'IVA'
    page.drawRectangle({
        x: width - totalWidth - 50,
        y: totalStartY - 10 - borderHeight,
        width: totalWidth,
        height: borderHeight,
        borderColor: config.colors.highlight,
        borderWidth: 1,
    });
    page.drawText(`IVA:`, { x: width - totalWidth - 45, y: yPosition - 5, size: config.fontSize.text, font, color: config.colors.text });
    page.drawText(`$${cotizacion.iva.toLocaleString()}`, { x: width - totalWidth + 5, y: yPosition - 5, size: config.fontSize.text, font, color: config.colors.text });
    yPosition -= borderHeight;

    // Dibuja el borde y la fila para 'Total'
    page.drawRectangle({
        x: width - totalWidth - 50,
        y: totalStartY - 10 - (borderHeight * 2),
        width: totalWidth,
        height: borderHeight,
        borderColor: config.colors.highlight,
        borderWidth: 1,
    });
    page.drawText(`Total:`, { x: width - totalWidth - 45, y: yPosition - 5, size: config.fontSize.text, font, color: config.colors.text });
    page.drawText(`$${cotizacion.total.toLocaleString()}`, { x: width - totalWidth + 5, y: yPosition - 5, size: config.fontSize.text, font, color: config.colors.text });
    yPosition -= borderHeight;

    // Observaciones
    page.drawText(`Observaciones: ${cotizacion.observaciones}`, { x: 50, y: yPosition, size: config.fontSize.text, font, color: config.colors.text });

    // Guardar el PDF como un archivo de bytes para enviarlo como respuesta
    const pdfBytes = await pdfDoc.save();
    return pdfBytes; // Devolver el PDF generado en lugar de guardarlo
}