const ejs = require("ejs");
const path = require("path");

module.exports = {
  RenderEJSTemplate: async (templateName, data) => {
    return new Promise((resolve, reject) => {
      const templatePath = path.join(
        __dirname,
        "templates",
        `${templateName}.ejs`,
      );

      ejs.renderFile(templatePath, data, (error, html) => {
        if (error) {
          reject(error);
        } else {
          resolve(html);
        }
      });
    });
  },
};
