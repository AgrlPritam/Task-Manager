const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_APIKEY)

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to:email,
        from: 'pritamagrawal95@gmail.com',
        subject: 'Welcome to our Task Application',
        text: `Hello, ${name}. Let me know your application experience.`        //Mark the back-tick here, not the single quotes
    })
}

const sendGoodByeEmail = (email,name) => {
    sgMail.send({
        to:email,
        from:'pritamagrawal95@gmail.com',
        subject:'It is hard to see you leave us',
        text:`GoodBye ${name}. Please let us know what can be done to improve our services`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail
}