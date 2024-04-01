package com.thuongmoon.movieservice.services;

import org.thymeleaf.context.Context;

public interface MailService {
    public void sendEmailWithHtmlTemplate(String to, String subject, String templateName, Context context);
}
