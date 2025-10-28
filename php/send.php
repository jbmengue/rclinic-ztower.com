<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$uriPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriSegments = explode("/", trim($uriPath, "/"));
$sendType = isset($uriSegments[2]) ? $uriSegments[2] : null;

// Instância da classe
$mail = new PHPMailer(true);
try {
    // Configurações do servidor
    $mail->isSMTP();        //Devine o uso de SMTP no envio
    $mail->SMTPAuth     = true; //Habilita a autenticação SMTP
    $mail->Username     = 'api';
    $mail->Password     = '47671311bc89e1ae733626e35f3fbb5e';
    // Criptografia do envio SSL também é aceito
    $mail->SMTPSecure   = 'tls';
    // Informações específicadas pelo Google
    $mail->Host         = 'live.smtp.mailtrap.io';
    $mail->Port         = 587;
    // Define o remetente
    $mail->setFrom('site@drbragaretina.com.br', 'Site Dr. Rafael de Azevedo Braga');
    // Define o destinatário
    $mail->addAddress('drrafaeloft@gmail.com', 'Dr. Rafael de Azevedo Braga');
    $mail->addCC('rafaelbraga2@gmail.com', 'Dr. Rafael de Azevedo Braga');
    //$mail->AddBCC("jonas@millenium-seo.com");
    //$mail->addAddress('jonas@millenium-seo.com', 'Dr. Rafael de Azevedo Braga');
    
    // Conteúdo da mensagem
    $mail->isHTML(true);  // Seta o formato do e-mail para aceitar conteúdo HTML

    if($sendType === 'whatsappchat') {
        $mail = emailWhatsappChat($mail);
    } else {
        $mail = emailContact($mail);
    }
    
    // Enviar
    $mail->send();
    echo json_encode(['return' => 'success', 'msg' => 'A mensagem foi enviada!']);
}
catch (Exception $e) {
    echo json_encode(['return' => 'error', 'msg' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}

function emailContact($mail) {
    $mail->AddReplyTo($_POST['txt_email'], $_POST['txt_name']);
    $mail->Subject = 'Contato via Site';
    
    $mail->Body  = mb_convert_encoding(<<<EOT
            Nome: {$_POST['txt_name']}<br />
            Telefone: {$_POST['txt_phone']}<br />
            E-mail: {$_POST['txt_email']}<br /><br />
            Mensagem: <br />
            {$_POST['txta_message']}<br /><br />

            <i>Aceitar os termos e condições: {$_POST['r_terms']}</i>
        EOT, 'ISO-8859-1', 'UTF-8');

    return $mail;
}

function emailWhatsappChat($mail) {
    $data = (object)json_decode(file_get_contents('php://input'));
    $name   = $data->name;
    $phone  = $data->phone;
    $email  = $data->email;

    $mail->Subject = mb_convert_encoding('Notificação :: Contato via WhatsApp | ' . $name . ' | ' . $phone, 'ISO-8859-1', 'UTF-8');
    
    $mail->Body  = mb_convert_encoding(<<<EOT
            Nome: {$name}<br />
            Telefone: {$phone}<br />
            E-mail: {$email}
        EOT, 'ISO-8859-1', 'UTF-8');

    return $mail;
}