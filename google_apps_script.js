function doPost(e) {
  // 1. Verify reCAPTCHA token
  var recaptchaToken = e.parameter.recaptcha_token || "";
  
  if (recaptchaToken === "") {
    console.error("Spam blocked! Missing token.");
    return ContentService.createTextOutput(JSON.stringify({ "result": "spam" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // REPLACE THIS WITH YOUR SECRET KEY FROM GOOGLE RECAPTCHA
  var secretKey = "6LdbzBUtAAAAALLh0BddKjGbDb36Xh3F1jAhmTwQ"; 
  
  var payload = {
    "secret": secretKey,
    "response": recaptchaToken
  };
  
  var options = {
    "method": "post",
    "payload": payload
  };
  
  try {
    var response = UrlFetchApp.fetch("https://www.google.com/recaptcha/api/siteverify", options);
    var json = JSON.parse(response.getContentText());
    
    // If it's a bot (score < 0.5) or verification failed, exit early.
    if (!json.success || json.score < 0.5) {
      console.error("Spam blocked! Score: " + json.score);
      return ContentService.createTextOutput(JSON.stringify({ "result": "spam" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    console.error("reCAPTCHA Error: " + err.toString());
    // Fail closed on error to be safe, but return the message for debugging
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Setup the spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 3. Parse the incoming data from the website form
  var name = e.parameter.name || "";
  var email = e.parameter.email || "";
  var subject = e.parameter.subject || "";
  var message = e.parameter.message || "";
  var photosJson = e.parameter.photos_json || "";
  
  // 3. Format the data for the sheet
  var timestamp = new Date();
  
  // Create a row of data matching your columns:
  // Date, Name, Email, Subject, Message, Preffered Consultation Date, Preffered Consultation Time
  var rowData = [
    timestamp,           // Date (when form was submitted)
    name,                // Name
    email,               // Email
    subject,             // Subject
    message,             // Message
    "",                  // Preffered Consultation Date (Removed)
    ""                   // Preffered Consultation Time (Removed)
  ];
  
  // 4. Write data to the spreadsheet
  sheet.appendRow(rowData);
  
  // 5. Send an email notification to yourself
  try {
    var adminEmail = "v292studios@gmail.com"; // Hardcoded studio email
    var emailSubject = "[Inquiry] New Website Message: " + name;
    var emailBody = "You have a new message from your website!\n\n" +
                    "Name: " + name + "\n" +
                    "Email: " + email + "\n" +
                    "Subject: " + subject + "\n\n" +
                    "Message:\n" + message + "\n\n" +
                    (attachments.length > 0 ? "Attached Reference Photos: " + attachments.length : "No reference photos attached.");
                    
    var attachments = [];
    if (photosJson) {
      try {
        var files = JSON.parse(photosJson);
        for (var i = 0; i < files.length; i++) {
          var blob = Utilities.newBlob(Utilities.base64Decode(files[i].data), files[i].mimeType, files[i].name);
          attachments.push(blob);
        }
      } catch (err) {
        console.error("Error parsing photos: " + err);
      }
    }
                    
    MailApp.sendEmail({
      to: adminEmail,
      replyTo: email,
      subject: emailSubject,
      body: emailBody,
      attachments: attachments
    });
  } catch (emailError) {
    console.error("Email Error: " + emailError.toString());
  }

  // 6. Return a success message back to the website
  return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// RUN THIS FUNCTION in the Google Apps Script editor to authorize all permissions (Spreadsheet, Calendar, UrlFetch)!
function runAuthorizationCheck() {
  Logger.log("Starting authorization check...");
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log("SpreadsheetApp is authorized.");
  } catch (e) {
    Logger.log("SpreadsheetApp error: " + e.toString());
  }
  
  try {
    var cal = CalendarApp.getDefaultCalendar();
    Logger.log("CalendarApp is authorized.");
  } catch (e) {
    Logger.log("CalendarApp error: " + e.toString());
  }
  
  try {
    var response = UrlFetchApp.fetch("https://www.google.com/recaptcha/api/siteverify");
    Logger.log("UrlFetchApp is authorized.");
  } catch (e) {
    Logger.log("UrlFetchApp error: " + e.toString());
  }
  
  Logger.log("Authorization check complete!");
}

// If runAuthorizationCheck fails silently without prompting for permissions, 
// select and run this function in the editor. It will force a permission prompt if scopes are automatic.
function forceAuthorize() {
  UrlFetchApp.fetch("https://www.google.com");
}
