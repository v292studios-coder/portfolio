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
  var dateStr = e.parameter.date || ""; // e.g. "2026-06-16"
  var timeStr = e.parameter.time || ""; // e.g. "15:00"
  var subject = e.parameter.subject || "";
  var message = e.parameter.message || "";
  
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
    dateStr,             // Preffered Consultation Date
    timeStr              // Preffered Consultation Time
  ];
  
  // 4. Write data to the spreadsheet
  sheet.appendRow(rowData);
  
  // 5. Send an email notification to yourself
  try {
    var adminEmail = "v292studios@gmail.com"; // Hardcoded studio email
    var emailSubject = "[Consultation Sessions] New Booking Request: " + name;
    var emailBody = "You have a new consultation request from your website!\n\n" +
                    "Name: " + name + "\n" +
                    "Email: " + email + "\n" +
                    "Date: " + dateStr + "\n" +
                    "Time: " + timeStr + "\n" +
                    "Subject: " + subject + "\n\n" +
                    "Message:\n" + message;
                    
    MailApp.sendEmail(adminEmail, emailSubject, emailBody);
  } catch (emailError) {
    console.error("Email Error: " + emailError.toString());
  }

  // 6. Try creating a Calendar Event safely
  try {
    if (dateStr && timeStr) {
      // Create a valid Javascript Date object from the inputs
      // dateStr is 'YYYY-MM-DD', timeStr is 'HH:MM'
      var eventStart = new Date(dateStr + "T" + timeStr + ":00");
      
      // Check if the date is valid (prevent year 60615 errors!)
      if (!isNaN(eventStart.getTime()) && eventStart.getFullYear() < 3000) {
        
        // Event runs for 15 minutes
        var eventEnd = new Date(eventStart.getTime() + (15 * 60 * 1000));
        
        var eventTitle = "Consultation: " + name + " (" + subject + ")";
        var eventDescription = "Name: " + name + "\n" +
                               "Email: " + email + "\n" +
                               "Subject: " + subject + "\n\n" +
                               "Message:\n" + message;
        
        // Create the event on your specific photography calendar
        // REPLACE 'YOUR_CALENDAR_ID_HERE' WITH YOUR ACTUAL CALENDAR ID
        // (Find this in Google Calendar -> Settings -> click your photography calendar -> Integrate calendar -> Calendar ID)
        var calendarId = "5db3fe0e4d0e40d31cd43b29946faa0c51e85d56bf5d7cc63eb27c95d3b20faf@group.calendar.google.com"; 
        var myCalendar = CalendarApp.getCalendarById(calendarId);
        
        // Fallback to default if the ID isn't set properly yet
        if (!myCalendar) {
          myCalendar = CalendarApp.getDefaultCalendar();
        }

        myCalendar.createEvent(
          eventTitle, 
          eventStart, 
          eventEnd,
          { description: eventDescription }
        );
      } else {
        console.error("Invalid date provided, skipping calendar event: " + dateStr);
      }
    }
  } catch (error) {
    // Log the error silently so the form submission doesn't fail on the website side
    console.error("Calendar Error: " + error.toString());
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
