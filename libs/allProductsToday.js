const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const productModel = require("../DB/models/Product");
const userModel = require("../DB/models/User");
const moment = require("moment");
const sendEmail = require("../services/sendEmail");
///////////////////////////////////////////////////////
async function runAllProductsToday() {
  try {
    const start = moment().startOf("day");
    const end = moment(start).endOf("day");
    //---------------------------------------------
    const products = await productModel
      .find({ createdAt: { $gte: start, $lte: end } })
      .select("title description price");
    //---------------------------------------------
    const admins = await userModel.find({ role: "Admin" }).select("email");
    const adminsArr = admins.map((user) => user.email);
    //---------------------------------------------
    createAllProductsToday(
      products,
      path.join(__dirname, "../uploads/temp/allProductsToday.pdf")
    );
    //---------------------------------------------
    await sendEmail(
      adminsArr,
      "In the attachment, you will find the file.",
      "Products that are created today.",
      "allProductsToday.pdf",
      path.join(__dirname, "../uploads/temp/allProductsToday.pdf")
    );
    //---------------------------------------------
    fs.unlinkSync(path.join(__dirname, "../uploads/temp/allProductsToday.pdf"));
    //---------------------------------------------
  } catch (error) {
    return error;
  }
}
///////////////////////////////////////////////////////
function createAllProductsToday(products, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });
  generateHeader(doc);
  generateProductsTable(doc, products);
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}
///////////////////////////////////////////////////////
function generateHeader(doc) {
  const today = moment().startOf("day").format("MM/DD/YYYY");
  doc
    .fillColor("#444444")
    .fontSize(12)
    .text(`All Product Today ( ${today} )`, 50, 50)
    .moveDown();
}
///////////////////////////////////////////////////////
function generateProductsTable(doc, products) {
  let i;
  const productsTableTop = 70;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    productsTableTop,
    "ID",
    "Title",
    "Description",
    "Price"
  );
  generateHr(doc, productsTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < products.length; i++) {
    const item = products[i];
    const position = productsTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item._id,
      item.title,
      item.description,
      item.price
    );

    generateHr(doc, position + 20);
  }
}
///////////////////////////////////////////////////////
function generateTableRow(doc, y, _id, title, description, price) {
  doc
    .fontSize(7)
    .text(_id, 50, y)
    .fontSize(9)
    .text(title, 150, y, { width: 130 })
    .text(description, 280, y)
    .text(price, 0, y, { align: "right" });
}
///////////////////////////////////////////////////////
function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}
///////////////////////////////////////////////////////
module.exports = {
  runAllProductsToday,
};
