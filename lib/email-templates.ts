export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export const emailTemplates = {
  welcome: (email: string): EmailTemplate => ({
    subject: "Welcome to SQUAREDRUM Records!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SQUAREDRUM</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { background: #000; color: white; padding: 20px; text-align: center; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .social-links { margin: 20px 0; }
            .social-links a { margin: 0 10px; color: #f59e0b; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to SQUAREDRUM Records!</h1>
              <p>Where global sounds meet cutting-edge technology</p>
            </div>
            
            <div class="content">
              <h2>Thanks for joining the Square, ${email}!</h2>
              
              <p>You're now part of our exclusive community of music lovers who get first access to:</p>
              
              <ul>
                <li>🎵 New releases before anyone else</li>
                <li>🎤 Behind-the-scenes artist content</li>
                <li>🎧 Exclusive remixes and unreleased tracks</li>
                <li>🎪 Early access to events and concerts</li>
                <li>💿 Special merchandise and limited editions</li>
              </ul>
              
              <p>Ready to discover your next favorite artist?</p>
              
              <a href="https://squaredrum.com/artists" class="button">Explore Our Artists</a>
              
              <div class="social-links">
                <p>Follow us on social media:</p>
                <a href="#">Instagram</a> |
                <a href="#">Twitter</a> |
                <a href="#">Spotify</a> |
                <a href="#">YouTube</a>
              </div>
            </div>
            
            <div class="footer">
              <p>&copy; 2024 Squaredrum. All rights reserved.</p>
              <p>
                <a href="https://squaredrum.com/unsubscribe" style="color: #f59e0b;">Unsubscribe</a> |
                <a href="https://squaredrum.com/privacy" style="color: #f59e0b;">Privacy Policy</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to SQUAREDRUM Records!
      
      Thanks for joining the Square, ${email}!
      
      You're now part of our exclusive community of music lovers who get first access to:
      
      • New releases before anyone else
      • Behind-the-scenes artist content  
      • Exclusive remixes and unreleased tracks
      • Early access to events and concerts
      • Special merchandise and limited editions
      
      Visit https://squaredrum.com/artists to explore our artists.
      
      Follow us on social media for daily updates!
      
      © 2024 Squaredrum. All rights reserved.
      Unsubscribe: https://squaredrum.com/unsubscribe
    `,
  }),

  newRelease: (artistName: string, songTitle: string, releaseDate: string): EmailTemplate => ({
    subject: `🎵 New Release: ${songTitle} by ${artistName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Release - ${songTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { background: #000; color: white; padding: 20px; text-align: center; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
            .release-info { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎵 New Release Alert!</h1>
            </div>
            
            <div class="content">
              <div class="release-info">
                <h2>${songTitle}</h2>
                <h3>by ${artistName}</h3>
                <p><strong>Release Date:</strong> ${releaseDate}</p>
              </div>
              
              <p>One of our incredible artists just dropped something special, and you're getting first access!</p>
              
              <p>Stream it now on your favorite platform:</p>
              
              <a href="#" class="button">Spotify</a>
              <a href="#" class="button">Apple Music</a>
              <a href="#" class="button">YouTube</a>
              
              <p>Don't forget to add it to your playlists and share it with your friends!</p>
            </div>
            
            <div class="footer">
              <p>&copy; 2024 Squaredrum. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      🎵 New Release Alert!
      
      ${songTitle} by ${artistName}
      Release Date: ${releaseDate}
      
      One of our incredible artists just dropped something special, and you're getting first access!
      
      Stream it now on your favorite platform and don't forget to share it with your friends!
      
      © 2024 Squaredrum. All rights reserved.
    `,
  }),

  monthlyDigest: (month: string, highlights: string[]): EmailTemplate => ({
    subject: `🎶 SQUAREDRUM Monthly Digest - ${month}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Monthly Digest - ${month}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { background: #000; color: white; padding: 20px; text-align: center; }
            .highlight { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #f59e0b; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎶 Monthly Digest</h1>
              <p>${month} Highlights</p>
            </div>
            
            <div class="content">
              <h2>What's Been Happening at SQUAREDRUM</h2>
              
              ${highlights.map((highlight) => `<div class="highlight">${highlight}</div>`).join("")}
              
              <p>Thanks for being part of our journey. Here's to another month of incredible music!</p>
              
              <a href="https://squaredrum.com/releases" class="button">Explore Latest Releases</a>
            </div>
            
            <div class="footer">
              <p>&copy; 2024 Squaredrum. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      🎶 SQUAREDRUM Monthly Digest - ${month}
      
      What's Been Happening at SQUAREDRUM:
      
      ${highlights.map((highlight) => `• ${highlight}`).join("\n")}
      
      Thanks for being part of our journey. Here's to another month of incredible music!
      
      Explore our latest releases: https://squaredrum.com/releases
      
      © 2024 Squaredrum. All rights reserved.
    `,
  }),
}
