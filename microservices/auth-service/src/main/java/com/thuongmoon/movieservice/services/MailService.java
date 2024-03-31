package com.thuongmoon.movieservice.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.context.Context;

public interface MailService {
    public void sendEmailWithHtmlTemplate(String to, String subject, String templateName, Context context);
}
