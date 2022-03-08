const nodemailer = require('nodemailer');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');


module.exports = async function mailCustom(ticket) {


        const transporter = nodemailer.createTransport({
            host: "smtp.dreamhost.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: "tnsolutions@sadevmail.com",
              pass: "89fffArH",
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
              }
        });

        

          const message = await transporter.sendMail({
            from: 'tnsolutions@sadevmail.com',
            to: 'mursoleo@tnsolutions.it',
            bcc: 'vince@salernodev.com',
	          subject: `Nuovo Ticket #${ticket.ticket_number} ${ticket.customer_id.company_name} ${ticket.operator_id?.username}`,
            text: `Nuovo Ticket Creato : ${ticket.title} \n Creato Da : ${ticket.added_by.username} \n Cliente : ${ticket.customer_id.company_name} \n Data Lavorazione : ${ticket.ticket_date} \n Tecnico Incaricato : ${ticket.operator_id?.username} \n Descrizione : ${ticket.description}`
          });

          console.log("Message sent: %s", message.messageId);

          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
}


