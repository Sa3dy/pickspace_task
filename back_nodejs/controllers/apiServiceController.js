const express = require("express");
const https = require("https");
var router = express.Router();
var nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.status(400).send(`Nothing to do here.`);
});

router.get("/login/:client/:email/:password", (req, res) => {
  var client = req.params.client;
  var email = req.params.email;
  var password = req.params.password;

  var login_api_url = `https://${client}.pickspace.com/api/app/login?email=${email}&password=${password}`;

  https
    .get(login_api_url, resp => {
      let data = "";
      resp.on("data", chunk => {
        data += chunk;
      });

      resp.on("end", () => {
        let result_login = JSON.parse(data);
        if (result_login.cookie) {
          var settings_api_url = `https://${client}.pickspace.com/api/app/settings?auth_token=${result_login.cookie}`;

          https
            .get(settings_api_url, resp => {
              let data = "";
              resp.on("data", chunk => {
                data += chunk;
              });

              resp.on("end", () => {
                let result_settings = JSON.parse(data);

                res.json({
                  success: true,
                  token: result_login.cookie,
                  company_logo: result_settings.logo_jpg,
                  company_name: result_settings.company
                });
              });
            })
            .on("error", err => {
              return res.status(400).send(`Error: ${err.message}`);
            });
        } else {
          res.json({ success: false });
        }
      });
    })
    .on("error", err => {
      return res.status(400).send(`Error: ${err.message}`);
    });
});

router.get("/get_members/:client/:token/:query", (req, res) => {
  var client = req.params.client;
  var token = req.params.token;
  var query = req.params.query;

  var members_api_url = `https://${client}.pickspace.com/api/app/users?auth_token=${token}&cmd=getMembersWithPage&page=0&searchMemberQuery=${query}`;

  https
    .get(members_api_url, resp => {
      let data = "";
      resp.on("data", chunk => {
        data += chunk;
      });

      resp.on("end", () => {
        let result_members = JSON.parse(data);
        res.json(result_members);
      });
    })
    .on("error", err => {
      return res.status(400).send(`Error: ${err.message}`);
    });
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sa3dyemailstest@gmail.com",
    pass: "test0123456789"
  }
});

router.post("/send_email", (req, res) => {
  var member_name = req.body.member_name;
  var member_email = req.body.member_email;
  var message_text = req.body.message_text;

  var mailOptions = {
    from: "sa3dyemailstest@gmail.com",
    to: member_email,
    subject: "You have a vistor!",
    text: `${member_name} is here at the front desk to ${message_text}. Please go there to meet them!`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

module.exports = router;
