// In node, every file is treated as a module,
// can be exported as follows (unnamed export)
module.exports = (template, product) => {
  let output = template.replace(/{%PRODUCT_NAME%}/g, product.productName,'{%PRODUCT_IMAGE%}', '{%PRODUCT_DESCRIPTION%}', '{%PRODUCT_CARDS%}', '{%PRODUCT_NUTRIENTS%}', '{%COUNTRY_OF_ORIGIN%}', '{%NOT_ORGANIC%}', '{%ID%}');
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%PRODUCT_IMAGE%}/g, product.image);
  output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);
  // output = output.replace(/{%PRODUCT_CARDS%}/g, product.price);
  output = output.replace(/{%PRODUCT_NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%COUNTRY_OF_ORIGIN%}/g, product.from);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
}
