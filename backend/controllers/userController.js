const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jsforce = require('jsforce');
const axios = require('axios');
const nodeMailer = require("nodemailer");



const sendEmail = async (options) => {
  // console.log(process.env.SMPT_HOST, process.env.SMPT_MAIL, process.env.SMPT_PASSWORD);

  const transporter = nodeMailer.createTransport({
    service: process.env.SMPT_SERVICE,
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    secure: true,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};




// Salesforce Login & Send Lead To Salesforce
exports.sendLeadToSalesforce = catchAsyncErrors(async (req, res, next) => {
  console.log("SalesForce lead saved function initiated");

  console.log("credentials", process.env.SALESFORCE_USERNAME,
    process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN);


  try {
    // const conn = new jsforce.Connection();
    const conn = new jsforce.Connection({
      // you can change loginUrl to connect to sandbox or prerelease env.
      loginUrl: process.env.SALESFORCE_POST_URL 
    });
    const userInfo = await conn.login(
      process.env.SALESFORCE_USERNAME,
      process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_SECURITY_TOKEN
    );

    if (userInfo) {
      console.log("SalesForce authenticated");
      console.log("Access token: " + conn.accessToken);
      console.log("Instance url: " + conn.instanceUrl);
      console.log("User ID: " + userInfo.id);
      console.log("Org ID: " + userInfo.organizationId);
    }

    const { financing, nameEmailPhone, addressProvince, loanPurpose, lookingFor, hearAboutUs, traditionalLenders, timeframe, purchasePrice, downPayment, valueOfProperty, totalMortgage, shareOtherDetail } = req.body;
    const accessToken = conn.accessToken;
    console.log("accessToken", accessToken);

    if (!accessToken) {
      return res.status(500).json({
        success: false,
        message: "Access token is expired, Please refresh once.",
      });
    }

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    const body = {
      FirstName: nameEmailPhone.firstname,
      LastName: nameEmailPhone.lastname,
      Email: nameEmailPhone.email,
      Phone: nameEmailPhone.phone,
      Traditional_Lender__c: traditionalLenders,
      Estimated_Timeframe__c: timeframe,
      LeadSource: hearAboutUs,
      Loan_Types__c: loanPurpose,
      Financing_Explanation__c: shareOtherDetail.additionalDetails,
      Company: "New Application Form",
      // Application_Source__c: "New Application Form",

      Street: addressProvince.address,
      State: addressProvince.province,
      // City: 'San Francisco',
      // Country: 'USA'

    };

    if (financing === "New Purchase") {
      body.Loan_Purpose__c = "Purchase"
    } else {
      body.Loan_Purpose__c = financing
    }



    if (lookingFor === "1st Mortgage") {
      body.Loan_Type__c = "1st Mtg"
    } else if (lookingFor === "2nd Mortgage") {
      body.Loan_Type__c = "2nd Mtg"
    } else if (lookingFor === "3rd Mortgage") {
      body.Loan_Type__c = "3rd Mtg"
    }

    if (purchasePrice && downPayment) {
      body.Purchase_Price__c = parseFloat(purchasePrice.replace(/,/g, ''))
      body.Down_Payment__c = parseFloat(downPayment.replace(/,/g, ''))
    } else {
      body.Estimated_Market_Value__c = parseFloat(valueOfProperty.replace(/,/g, ''))
      body.Total_Mortgages__c = parseFloat(totalMortgage.replace(/,/g, ''))
    }

    // console.log("body", req.body);

    try {
      const response = await axios.post(`${process.env.SALESFORCE_POST_URL}/services/data/v60.0/sobjects/lead`, body, { headers });



      if (response.status === 200 || response.status === 201) {

        await sendEmail({
          email: nameEmailPhone?.email,
          subject: `Thanks for reaching out! We’ve got your query.`,
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freedom Capital</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.4; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #f7f7f7; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="padding: 40px 20px;">
                            <a href="https://www.freedomcapital.com/" style="text-decoration: none;">
                                <img src="https://www.freedomcapital.com/wp-content/uploads/2024/08/Freedom-Capital-LOGO-black-300x50.png" alt="Freedom Capital Logo" width="250" style="display: block; max-width: 100%; height: auto; border: 0;">
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 20px;">
                            <h3 style="color: #2E4053; font-weight: bold; margin-bottom: 0px;">Dear ${nameEmailPhone?.firstname},</h3>
                            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-top: 5px; margin-bottom: 30px;">
                                Thank you for your recent inquiry. One of our experienced mortgage specialists will contact you shortly to discuss the details of your request.
                            </p>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #eaf2f8; border-radius: 8px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <p style="font-size: 18px; color: #1F618D; font-weight: bold; margin: 0 0 15px 0;">Need immediate assistance?</p>
                                        <a href="tel:+1-(866)-944-7778" style="display: inline-block; background-color: #F39C12; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; white-space: nowrap; mso-padding-alt: 0; text-underline-color: #F39C12;">
                                            <!--[if mso]>
                                            <i style="letter-spacing: 25px; mso-font-width: -100%; mso-text-raise: 30pt;">&nbsp;</i>
                                            <![endif]-->
                                            <span style="mso-text-raise: 15pt;">Call Us: +1-(866)-944-7778</span>
                                            <!--[if mso]>
                                            <i style="letter-spacing: 25px; mso-font-width: -100%;">&nbsp;</i>
                                            <![endif]-->
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <h4 style="color: #2E86C1; text-align: center; font-size: 20px; margin-bottom: 0px;">Thank you for choosing Freedom Capital!</h4>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 20px;">
                            <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
                            <p style="font-size: 14px; color: #888; text-align: center; margin-bottom: 30px;">
                                Best regards,<br>
                                <strong>The Freedom Capital Team</strong>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
        }).then((err) => {
          if (err) {
            console.log("On sending mail", err)
          } else {

            return res.status(200).json({
              success: true,
              message: "Lead saved in Salesforce successfully..."
            });

          }
        });


      } else {
        console.log("Unexpected response status:", response.status);
        return res.status(500).json({
          success: false,
          message: "Failed to save data, Please try again.",
          error: response.data
        });
      }
    } catch (axiosError) {
      if (axiosError.response) {
        // The request was made and the server responded with a status code outside of the range of 2xx
        console.error("Axios error response data:", axiosError.response);
        // console.error("Axios error response data:", axiosError.response.data);
        // console.error("Axios error response status:", axiosError.response.status);
        // console.error("Axios error response headers:", axiosError.response.headers);
        const errorCode = axiosError.response.data[0]?.errorCode || 'Unknown errorCode';
        const errorMessage = axiosError.response.data[0]?.message || 'Unknown message';

        if (errorCode === "DUPLICATES_DETECTED") {
          return res.status(500).json({
            success: false,
            message: "Duplicate values detected, Update your contact details.",
            error: axiosError.response.data
          });
        } else {
          return res.status(500).json({
            success: false,
            message: errorMessage,
            error: axiosError.response.data
          });
        }
      } else if (axiosError.request) {
        // The request was made but no response was received
        console.error("Axios error request data:", axiosError.request);
        return res.status(500).json({
          success: false,
          message: "No response received from Salesforce, Please try again.",
          error: axiosError.request
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Axios error message:", axiosError.message);
        return res.status(500).json({
          success: false,
          message: "Error in setting up the request, Please try again.",
          error: axiosError.message
        });
      }
    }
  } catch (error) {
    console.log("sendLeadToSalesforce: " + error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, Please try again.",
      error: error.message
    });
  }
});











