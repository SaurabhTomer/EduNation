`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>EduNation | Course Enrollment Confirmation</title>
  <style>
    body {
      font-family: 'Poppins', Arial, sans-serif;
      background-color: #f5f7fb;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 650px;
      background: #ffffff;
      margin: 40px auto;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background-color: #2563eb;
      padding: 25px 0;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 30px;
    }
    h2 {
      color: #2563eb;
      font-size: 22px;
    }
    p {
      line-height: 1.7;
      font-size: 15px;
    }
    .course-card {
      background: #f0f5ff;
      padding: 20px;
      border-left: 4px solid #2563eb;
      border-radius: 8px;
      margin: 20px 0;
    }
    .cta {
      text-align: center;
      margin-top: 30px;
    }
    .cta a {
      background-color: #2563eb;
      color: #ffffff;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      display: inline-block;
    }
    .footer {
      background-color: #f9fafb;
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: #777;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>EduNation</h1>
    </div>
    <div class="content">
      <h2>🎉 Congratulations, {{userName}}!</h2>
      <p>
        You’ve successfully enrolled in <strong>{{courseName}}</strong> on <strong>EduNation</strong>.
        We’re thrilled to have you join our learning community!
      </p>

      <div class="course-card">
        <p><strong>📘 Course:</strong> {{courseName}}</p>
        <p><strong>👨‍🏫 Instructor:</strong> {{instructorName}}</p>
        <p><strong>💰 Price Paid:</strong> ₹{{price}}</p>
        <p><strong>🗓 Purchase Date:</strong> {{purchaseDate}}</p>
      </div>

      <p>
        Get started now and begin your journey towards mastering new skills. Your learning dashboard is ready for you!
      </p>

      <div class="cta">
        <a href="{{courseLink}}">Go to My Course</a>
      </div>
    </div>

    <div class="footer">
      <p>Need help? Contact us at <a href="mailto:support@edunation.com">support@edunation.com</a></p>
      <p>© {{year}} EduNation. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`