const { RenderEJSTemplate } = require("../render-html/index");
const sendMail = require("./node-mailer");

module.exports = {
  sendMail: async (receiverEmail, templateName, templateData, emailSubject) => {
    try {
      const HTML_CONTENT = await RenderEJSTemplate(templateName, templateData);
      const sent = await sendMail(receiverEmail, emailSubject, HTML_CONTENT);
      if (!sent) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error in sendMail:", error);
      throw error;
    }
  },
};
