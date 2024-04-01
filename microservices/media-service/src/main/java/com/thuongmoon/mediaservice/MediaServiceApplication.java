package com.thuongmoon.mediaservice;

import com.thuongmoon.mediaservice.services.Impl.FilesStorageServiceImpl;
import jakarta.annotation.Resource;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MediaServiceApplication implements CommandLineRunner {
	@Resource
	FilesStorageServiceImpl filesStorageService;

	public static void main(String[] args) {
		SpringApplication.run(MediaServiceApplication.class, args);
	}

	@Override
	public void run(String... arg) throws Exception {
		filesStorageService.init();
	}
}
