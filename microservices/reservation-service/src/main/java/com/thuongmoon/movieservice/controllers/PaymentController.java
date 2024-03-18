package com.thuongmoon.movieservice.controllers;

import com.thuongmoon.movieservice.zalocrypto.HMACUtil;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/v1/reservation/payment")
public class PaymentController {

    @PostMapping
    public void myTestUrl() throws IOException {

    }

//    @PostMapping
//    public String zalopayPaymentTest(@RequestBody String url) throws Exception {
//        CloseableHttpClient client = HttpClients.createDefault();
//        HttpPost myPost = new HttpPost(url.substring(1, url.length() - 1));
//        CloseableHttpResponse res = client.execute(myPost);
//        BufferedReader rd = new BufferedReader(new InputStreamReader(res.getEntity().getContent()));
//        StringBuilder resultJsonStr = new StringBuilder();
//        String line;
//
//        while ((line = rd.readLine()) != null) {
//            resultJsonStr.append(line);
//        }
//
//        JSONObject result = new JSONObject(resultJsonStr.toString());
//        String resultOrderUrl = "";
//        for (String key : result.keySet()) {
//            if (key.equals("order_url")) resultOrderUrl = result.get(key).toString();
//            System.out.format("%s = %s\n", key, result.get(key));
//        }
//        return resultOrderUrl;
//    }


}
